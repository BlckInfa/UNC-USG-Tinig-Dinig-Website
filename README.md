# UNC-USG Tinig Dinig System

The official digital archive and transparency portal for the UNC University Student Government.

## Project Structure

```
/usg-system
│
├── /client                 # Frontend: React (Vite)
│   ├── /public
│   ├── /src
│   │   ├── /assets         # Static images, global styles
│   │   ├── /components     # SHARED dumb components (Buttons, Inputs, Cards)
│   │   ├── /config         # API base URLs, environmental configs
│   │   ├── /context        # Global State (AuthContext, ThemeContext)
│   │   ├── /features       # DOMAIN-SPECIFIC Business Logic
│   │   │   ├── /auth       # Login/Register forms
│   │   │   ├── /finance    # Financial transaction tables/charts
│   │   │   ├── /tinig      # Chat/Ticket UI for TINIG DINIG
│   │   │   └── /org        # Org chart visualizations
│   │   ├── /hooks          # Custom hooks (useAuth, useFetch)
│   │   ├── /layouts        # DashboardLayout, PublicLayout
│   │   ├── /pages          # Route views (Home, Dashboard, Reports)
│   │   ├── /services       # API connection logic (Axios/Fetch calls)
│   │   └── /utils          # Helpers (date formatters, currency formatters)
│   ├── .env
│   └── package.json
│
├── /server                 # Backend: Express + MVC
│   ├── /config             # DB connection, Environment variables, Cors options
│   ├── /controllers        # The "C" in MVC - Handles Request/Response ONLY
│   ├── /middlewares        # Auth checks, Input validation, Error handling
│   ├── /models             # The "M" in MVC - Database Schemas (ORM definitions)
│   ├── /routes             # API Endpoint definitions
│   ├── /services           # BUSINESS LOGIC LAYER (The brain of your app)
│   ├── /utils              # Logger, Encryption helpers
│   ├── .env
│   ├── app.js              # Express App setup
│   └── server.js           # Server entry point
│
├── /shared                 # Shared logic between client and server
│   └── constants.js        # e.g., STATUS_TYPES = ['PENDING', 'APPROVED']
│
├── .gitignore
├── README.md
└── package.json            # Root scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BlckInfa/UNC-USG-Tinig-Dinig-Website.git usg-system
cd usg-system
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `/client` and `/server` directories
   - Update the values as needed

### Running the Application

**Development mode (both client and server):**
```bash
npm run dev:all
```

**Run client only:**
```bash
npm run dev:client
```

**Run server only:**
```bash
npm run dev:server
```

**Production build:**
```bash
npm run build:client
npm run start:all
```

## Architecture

### Frontend (React + Vite)
- **Component/Feature separation** pattern
- Domain-specific features in `/features`
- Shared components in `/components`
- API calls centralized in `/services`

### Backend (Express + MVC)
- **Strict MVC pattern** enforcement
- Controllers handle HTTP only
- Business logic in `/services`
- Database schemas in `/models`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
