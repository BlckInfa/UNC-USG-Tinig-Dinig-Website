# Data Source Abstraction Pattern — Developer Guide

> **Last updated:** February 2026
> **Applies to:** Any feature that needs JSON ↔ API switching

---

## Purpose

This project uses a **data source abstraction pattern** so the frontend can run in two modes:

| Mode            | Flag value | Use case                                  |
| --------------- | ---------- | ----------------------------------------- |
| **Static JSON** | `"json"`   | Demo, offline dev, low budget, no backend |
| **Backend API** | `"api"`    | Production with real server               |

The pattern ensures:

- UI components never know where data comes from
- Switching modes requires **one line change**
- No component, routing, or structural refactors when the backend is ready

---

## How It Works

### 1. Global Config Flag

```
client/src/config/dataSource.js
```

```js
export const DATA_SOURCE = "json"; // "json" | "api"
```

This is the **single source of truth**. Every feature reads this flag.

### 2. Feature Service Structure

Each feature that supports data source switching follows this file layout inside its `services/` folder:

```
features/<feature>/services/
├── <feature>.service.js           ← Switch file (only import used by UI)
├── <feature>.service.json.js      ← Static JSON implementation
├── <feature>.service.api.js       ← Backend API implementation
└── index.js                       ← Barrel export
```

### 3. The Switch File Pattern

```js
// <feature>.service.js
import { DATA_SOURCE } from "../../../config/dataSource";
import { featureServiceJSON } from "./<feature>.service.json";
import { featureServiceAPI } from "./<feature>.service.api";

export const featureService =
    DATA_SOURCE === "api" ? featureServiceAPI : featureServiceJSON;
```

### 4. Implementation Contract

Both `.json.js` and `.api.js` MUST export objects with **identical method signatures**:

```js
// .json.js
export const featureServiceJSON = {
    getAll: async (params) => {
        /* return from JSON */
    },
    getById: async (id) => {
        /* find in JSON */
    },
};

// .api.js
export const featureServiceAPI = {
    getAll: async (params) => {
        /* GET /api/feature */
    },
    getById: async (id) => {
        /* GET /api/feature/:id */
    },
};
```

Key rules:

- **All methods must return Promises** (even JSON ones — use `async`)
- **Return shapes must match** between implementations
- **JSON write operations** should be no-op stubs with `console.warn`

---

## Currently Implemented Features

| Feature       | Switch file                                       | JSON data             | Status      |
| ------------- | ------------------------------------------------- | --------------------- | ----------- |
| **Issuances** | `features/issuances/services/issuance.service.js` | `data/issuances.json` | ✅ Complete |

See [ISSUANCES_FEATURE.md](./ISSUANCES_FEATURE.md) for full details.

---

## Adding Data Source Switching to a New Feature

### Step-by-step

**1. Create the JSON data file**

```
client/src/data/<feature>.json
```

Populate with sample data matching your Mongoose schema shape.

**2. Create the JSON service**

```
features/<feature>/services/<feature>.service.json.js
```

```js
import data from "../../../data/<feature>.json";

export const featureServiceJSON = {
    getAll: async () => data,
    getById: async (id) => data.find((item) => item._id === id) || null,
    // ... stub mutations with console.warn
};
```

**3. Create the API service**

```
features/<feature>/services/<feature>.service.api.js
```

```js
import api from "../../../services/api";
import { ENDPOINTS } from "../../../config";

export const featureServiceAPI = {
    getAll: async (params) => {
        const res = await api.get(ENDPOINTS.FEATURE.BASE, { params });
        return res.data?.data?.items || [];
    },
    // ...
};
```

**4. Create the switch file**

```
features/<feature>/services/<feature>.service.js
```

```js
import { DATA_SOURCE } from "../../../config/dataSource";
import { featureServiceJSON } from "./<feature>.service.json";
import { featureServiceAPI } from "./<feature>.service.api";

export const featureService =
    DATA_SOURCE === "api" ? featureServiceAPI : featureServiceJSON;
```

**5. Export from barrel**

```js
// features/<feature>/services/index.js
export { featureService } from "./<feature>.service";
```

**6. Use in UI**

```jsx
import { featureService } from "./services/<feature>.service";

useEffect(() => {
    featureService.getAll().then(setData);
}, []);
```

---

## JSON Mode — Mutation Stub Pattern

Write operations in JSON mode should:

1. Log a warning so devs know it's a no-op
2. Return a plausible mock response so the UI doesn't crash

```js
create: async (data) => {
    console.warn("[JSON mode] create is a no-op — backend required");
    return { _id: `temp-${Date.now()}`, ...data };
},
```

---

## Checklist Before Merging

When adding/modifying data source support, verify:

- [ ] Both `.json.js` and `.api.js` have **identical method names**
- [ ] All methods return **Promises**
- [ ] Return shapes match between implementations
- [ ] JSON mutations log `console.warn` and return mock data
- [ ] UI components import **only** from the switch file
- [ ] No direct `import` of `.json` data files in components
- [ ] No direct `api.get(...)` calls in components
- [ ] App runs with `DATA_SOURCE = "json"` (no backend needed)
- [ ] App runs with `DATA_SOURCE = "api"` (when backend is available)

---

## FAQ

### Q: Can I add a third data source (e.g. localStorage)?

Yes. Add a `<feature>.service.local.js` and extend the switch:

```js
import { featureServiceLocal } from "./<feature>.service.local";

export const featureService =
    DATA_SOURCE === "api" ? featureServiceAPI
    : DATA_SOURCE === "local" ? featureServiceLocal
    : featureServiceJSON;
```

Update `dataSource.js` type comment to `"json" | "api" | "local"`.

### Q: What happens if I add a method to only one implementation?

The app will crash when switching to the other mode. Always add methods to both `.json.js` and `.api.js`.

### Q: Can I use environment variables instead of the config flag?

Yes, you could change `dataSource.js` to read from Vite env:

```js
export const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || "json";
```

Then set `VITE_DATA_SOURCE=api` in your `.env` file. The pattern still works — one place to change.

### Q: Why not use dynamic imports / lazy loading?

Dynamic imports would make the unused implementation tree-shakeable, but add complexity with async module loading. The current static import approach is simpler, debuggable, and the bundle cost of one extra file is negligible for this project's scale.
