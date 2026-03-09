# Issuances Feature — Developer Documentation

> **Last updated:** February 2026
> **Branch:** `feature/issuances-reports`
> **Status:** Active development

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Data Source Abstraction](#data-source-abstraction)
4. [Service Layer Architecture](#service-layer-architecture)
5. [Switching Data Sources](#switching-data-sources)
6. [JSON Data File](#json-data-file)
7. [Service API Reference](#service-api-reference)
8. [UI Component Map](#ui-component-map)
9. [Backend API Endpoints](#backend-api-endpoints)
10. [Adding a New Data Source Method](#adding-a-new-data-source-method)
11. [Common Pitfalls](#common-pitfalls)

---

## Overview

The **Issuances** feature handles the browsing, viewing, and administration of official USG documents — resolutions, memorandums, reports, and circulars.

It is designed to run in **two modes**:

| Mode               | When to use                   | Backend required? |
| ------------------ | ----------------------------- | ----------------- |
| `"json"` (default) | Demo, offline dev, low budget | No                |
| `"api"`            | Production, full backend      | Yes               |

Switching between modes requires **changing a single line** in one config file. No component, routing, or structural changes are needed.

---

## Folder Structure

```
client/src/
├── config/
│   ├── dataSource.js               ← DATA_SOURCE flag ("json" | "api")
│   ├── api.config.js               ← API base URL & endpoint constants
│   └── index.js                    ← Re-exports all config
│
├── data/
│   └── issuances.json              ← Static demo data (6 sample issuances)
│
├── features/
│   └── issuances/
│       ├── index.js                ← Barrel exports for the entire feature
│       │
│       ├── components/             ← Presentational UI components
│       │   ├── IssuanceCard/
│       │   ├── IssuanceList/
│       │   ├── IssuanceViewer/
│       │   ├── IssuanceFilters/
│       │   ├── CommentList/
│       │   ├── HistoryViewer/
│       │   ├── StatusBadge/
│       │   ├── PriorityBadge/
│       │   ├── StatusSelect/
│       │   ├── PrioritySelect/
│       │   ├── DepartmentSelect/
│       │   └── FileUploadField/
│       │
│       ├── pages/
│       │   └── IssuanceListPage/   ← Public issuance listing page
│       │
│       ├── admin/                  ← Admin CRUD pages
│       │   ├── AdminIssuanceList
│       │   ├── AdminIssuanceForm
│       │   ├── AdminIssuanceEditor
│       │   ├── AdminIssuanceFilters
│       │   └── AdminIssuanceHistory
│       │
│       └── services/               ← ⚡ Data source abstraction layer
│           ├── issuance.service.js          ← Switch file (THE ONLY import for UI)
│           ├── issuance.service.json.js     ← Static JSON implementation
│           ├── issuance.service.api.js      ← Backend API implementation
│           └── index.js                     ← Re-exports services
```

---

## Data Source Abstraction

### Architecture Diagram

```
┌─────────────────────────────┐
│      UI Components          │
│  (pages, admin, components) │
└──────────┬──────────────────┘
           │ import { issuanceService }
           ▼
┌─────────────────────────────┐
│   issuance.service.js       │  ← Switch file
│   reads DATA_SOURCE flag    │
└──────┬───────────┬──────────┘
       │           │
  "json"          "api"
       │           │
       ▼           ▼
┌────────────┐ ┌────────────┐
│  .json.js  │ │  .api.js   │
│ static data│ │ HTTP calls │
└────────────┘ └────────────┘
```

### Rules

| Rule                              | Description                                                     |
| --------------------------------- | --------------------------------------------------------------- |
| ✅ UI imports ONE file            | `import { issuanceService } from "./services/issuance.service"` |
| ✅ One-line switch                | Change `DATA_SOURCE` in `config/dataSource.js`                  |
| ❌ No JSON imports in components  | Components must NEVER import from `data/issuances.json`         |
| ❌ No API calls in components     | Components must NEVER call `api.get(...)` directly              |
| ❌ No data source awareness in UI | Components must not check which mode is active                  |

---

## Service Layer Architecture

### `issuance.service.js` — The Switch File

This is the **only** file that UI components import. It reads the `DATA_SOURCE` flag and re-exports the matching implementation:

```js
import { DATA_SOURCE } from "../../../config/dataSource";
import {
    issuanceServiceJSON,
    commentServiceJSON,
} from "./issuance.service.json";
import { issuanceServiceAPI, commentServiceAPI } from "./issuance.service.api";

export const issuanceService =
    DATA_SOURCE === "api" ? issuanceServiceAPI : issuanceServiceJSON;

export const commentService =
    DATA_SOURCE === "api" ? commentServiceAPI : commentServiceJSON;
```

### `issuance.service.json.js` — JSON Implementation

- Imports data from `client/src/data/issuances.json`
- All methods return `Promise`s to match the API contract
- **Public methods** (`getAll`, `getPublicById`, `getComments`) return real data
- **Admin mutation methods** (`create`, `update`, `delete`, `updateStatus`) are **no-op stubs** that log `console.warn` and return mock objects
- Includes sample inline comments for `iso-001` and `iso-003`

### `issuance.service.api.js` — API Implementation

- Imports `api` (Axios instance) and `ENDPOINTS` from config
- All methods make real HTTP calls to the backend
- Public endpoints → `/api/issuances/*`
- Admin endpoints → `/api/admin/issuances/*`

---

## Switching Data Sources

### To use static JSON (default — no backend needed):

```js
// client/src/config/dataSource.js
export const DATA_SOURCE = "json";
```

### To use the backend API:

```js
// client/src/config/dataSource.js
export const DATA_SOURCE = "api";
```

**That's it.** No other file changes required.

---

## JSON Data File

**Location:** `client/src/data/issuances.json`

Contains 6 sample issuances with the following shape (matching the Mongoose schema):

```json
{
    "_id": "iso-001",
    "title": "Resolution No. 2025-001: ...",
    "type": "RESOLUTION", // RESOLUTION | MEMORANDUM | REPORT | CIRCULAR
    "description": "...",
    "documentUrl": "/documents/...",
    "issuedBy": "University Student Government",
    "issuedDate": "2025-08-15T00:00:00.000Z",
    "status": "PUBLISHED", // DRAFT | PENDING | UNDER_REVIEW | APPROVED | REJECTED | PUBLISHED
    "category": "Finance",
    "priority": "HIGH", // HIGH | MEDIUM | LOW
    "department": "Executive",
    "tags": ["budget", "student-activity-fund"],
    "attachments": [],
    "commentCount": 3,
    "createdAt": "2025-08-10T08:30:00.000Z",
    "updatedAt": "2025-08-15T14:00:00.000Z"
}
```

To add more demo data, append objects to the JSON array following this shape.

---

## Service API Reference

### `issuanceService` Methods

| Method                               | Params             | Returns                                | JSON Mode              | API Mode                                           |
| ------------------------------------ | ------------------ | -------------------------------------- | ---------------------- | -------------------------------------------------- |
| `getAll(params?)`                    | Filter params      | `Issuance[]`                           | Filters by `PUBLISHED` | `GET /api/issuances`                               |
| `getPublicById(id)`                  | Issuance ID        | `Issuance \| null`                     | Finds by `_id`         | `GET /api/issuances/:id`                           |
| `getComments(id, params?)`           | Issuance ID        | `{ comments, pagination }`             | Sample comments        | `GET /api/issuances/:id/comments`                  |
| `addComment(id, content, parentId?)` | Issuance ID, text  | `Comment`                              | No-op stub             | `POST /api/issuances/:id/comments`                 |
| `getCommentCount(id)`                | Issuance ID        | `number`                               | From JSON field        | `GET /api/issuances/:id/comments/count`            |
| `getAllAdmin(params?)`               | Filter params      | `{ issuances, pagination }`            | Returns all            | `GET /api/admin/issuances`                         |
| `getById(id)`                        | Issuance ID        | `Issuance \| null`                     | Finds by `_id`         | `GET /api/admin/issuances/:id`                     |
| `create(data)`                       | Issuance data      | `Issuance`                             | No-op stub             | `POST /api/admin/issuances`                        |
| `update(id, data)`                   | ID, updated data   | `Issuance`                             | No-op stub             | `PUT /api/admin/issuances/:id`                     |
| `delete(id)`                         | Issuance ID        | `{ success }`                          | No-op stub             | `DELETE /api/admin/issuances/:id`                  |
| `updateStatus(id, status, reason?)`  | ID, status, reason | `Issuance`                             | No-op stub             | `PATCH /api/admin/issuances/:id/status`            |
| `getValidStatuses(id)`               | Issuance ID        | `{ currentStatus, validNextStatuses }` | Static response        | `GET /api/admin/issuances/:id/valid-statuses`      |
| `addAttachment(id, attachment)`      | ID, metadata       | `Issuance`                             | No-op stub             | `POST /api/admin/issuances/:id/attachments`        |
| `uploadAttachment(id, file)`         | ID, File           | `Issuance`                             | No-op stub             | `POST /api/admin/issuances/:id/attachments`        |
| `removeAttachment(id, attachmentId)` | ID, attachment ID  | `Issuance`                             | No-op stub             | `DELETE /api/admin/issuances/:id/attachments/:aid` |
| `getStatusHistory(id)`               | Issuance ID        | `History[]`                            | Empty array            | `GET /api/admin/issuances/:id/status-history`      |
| `getVersionHistory(id)`              | Issuance ID        | `History[]`                            | Empty array            | `GET /api/admin/issuances/:id/version-history`     |

### `commentService` Methods

| Method                | Params           | Returns       | JSON Mode  | API Mode                   |
| --------------------- | ---------------- | ------------- | ---------- | -------------------------- |
| `update(id, content)` | Comment ID, text | `Comment`     | No-op stub | `PUT /api/comments/:id`    |
| `delete(id)`          | Comment ID       | `{ success }` | No-op stub | `DELETE /api/comments/:id` |

---

## UI Component Map

### Public-facing

| Component          | Location                      | Role                                              |
| ------------------ | ----------------------------- | ------------------------------------------------- |
| `IssuanceListPage` | `pages/IssuanceListPage/`     | Main public page — fetches and displays issuances |
| `IssuanceList`     | `components/IssuanceList/`    | Renders a list of `IssuanceCard` components       |
| `IssuanceCard`     | `components/IssuanceCard/`    | Single issuance summary card                      |
| `IssuanceViewer`   | `components/IssuanceViewer/`  | Full issuance detail modal/view                   |
| `IssuanceFilters`  | `components/IssuanceFilters/` | Filter controls (type, status, priority)          |
| `CommentList`      | `components/CommentList/`     | Comment thread under an issuance                  |
| `StatusBadge`      | `components/StatusBadge/`     | Colored status label                              |
| `PriorityBadge`    | `components/PriorityBadge/`   | Colored priority label                            |

### Admin-facing

| Component              | Location | Role                             |
| ---------------------- | -------- | -------------------------------- |
| `AdminIssuanceList`    | `admin/` | Admin table with CRUD actions    |
| `AdminIssuanceForm`    | `admin/` | Create/edit issuance form        |
| `AdminIssuanceEditor`  | `admin/` | Full editor with status workflow |
| `AdminIssuanceFilters` | `admin/` | Admin-specific filter controls   |
| `AdminIssuanceHistory` | `admin/` | Status & version history viewer  |

---

## Backend API Endpoints

### Public (no auth required)

| Method | Endpoint                            | Description                     |
| ------ | ----------------------------------- | ------------------------------- |
| `GET`  | `/api/issuances`                    | List all published issuances    |
| `GET`  | `/api/issuances/:id`                | Get a single published issuance |
| `GET`  | `/api/issuances/:id/comments`       | Get comments for an issuance    |
| `GET`  | `/api/issuances/:id/comments/count` | Get comment count               |
| `POST` | `/api/issuances/:id/comments`       | Add comment (requires JWT)      |

### Admin (requires `ADMIN` or `SUPER_ADMIN` role)

| Method   | Endpoint                                    | Description                     |
| -------- | ------------------------------------------- | ------------------------------- |
| `GET`    | `/api/admin/issuances`                      | List all issuances (any status) |
| `GET`    | `/api/admin/issuances/:id`                  | Get issuance by ID              |
| `POST`   | `/api/admin/issuances`                      | Create a new issuance           |
| `PUT`    | `/api/admin/issuances/:id`                  | Update an issuance              |
| `DELETE` | `/api/admin/issuances/:id`                  | Delete an issuance              |
| `PATCH`  | `/api/admin/issuances/:id/status`           | Transition issuance status      |
| `GET`    | `/api/admin/issuances/:id/valid-statuses`   | Get valid next statuses         |
| `POST`   | `/api/admin/issuances/:id/attachments`      | Add/upload attachment           |
| `DELETE` | `/api/admin/issuances/:id/attachments/:aid` | Remove attachment               |
| `GET`    | `/api/admin/issuances/:id/status-history`   | Status transition log           |
| `GET`    | `/api/admin/issuances/:id/version-history`  | Field change log                |

---

## Adding a New Data Source Method

When you need to add a new method (e.g. `getByDepartment`):

1. **Add the method to BOTH implementations** with the same signature:

    ```js
    // issuance.service.json.js
    getByDepartment: async (dept) => {
        return issuances.filter(i => i.department === dept);
    },

    // issuance.service.api.js
    getByDepartment: async (dept) => {
        const res = await api.get(ENDPOINTS.ISSUANCES.BASE, {
            params: { department: dept }
        });
        return res.data?.data?.issuances || [];
    },
    ```

2. **No changes needed** in `issuance.service.js` (the switch file) — it re-exports the entire object.

3. **Use it in UI** as usual:

    ```js
    const data = await issuanceService.getByDepartment("Finance");
    ```

---

## Common Pitfalls

| Pitfall                                                  | Why it's wrong                             | What to do instead                       |
| -------------------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| Importing from `issuance.service.json.js` in a component | Breaks abstraction, won't work in API mode | Always import from `issuance.service.js` |
| Importing from `issuance.service.api.js` in a component  | Same as above                              | Always import from `issuance.service.js` |
| Checking `DATA_SOURCE` in UI code                        | Components should be source-agnostic       | Let the switch file handle it            |
| Adding a method to only one implementation               | Will crash when switching modes            | Add to **both** `.json.js` and `.api.js` |
| Importing `issuances.json` directly in a component       | Bypasses the service layer                 | Use `issuanceService.getAll()` instead   |
| Editing `issuance.service.js` to add business logic      | This file is a switch only                 | Add logic to `.json.js` or `.api.js`     |
