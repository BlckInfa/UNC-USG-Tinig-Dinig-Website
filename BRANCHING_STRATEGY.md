# Git Branching Strategy for USG Tinig Dinig

## Overview
This project uses **Git Flow** branching model optimized for 8 developers working on 7 features.

## Branch Structure

```
main (production)
│
└── develop (integration)
    │
    ├── feature/constitution-bylaws      → Developer 1
    ├── feature/org-chart                → Developer 2
    ├── feature/programs-services        → Developer 3
    ├── feature/accomplishments-announcements → Developer 4
    ├── feature/issuances-reports        → Developer 5
    ├── feature/financial-transactions   → Developer 6
    ├── feature/tinig-dinig              → Developer 7 & 8 (pair)
    │
    └── (hotfix branches when needed)
```

## Branch Descriptions

| Branch | Feature | Developer | Description |
|--------|---------|-----------|-------------|
| `main` | - | - | Production-ready code. Protected branch. |
| `develop` | - | - | Integration branch. All features merge here first. |
| `feature/constitution-bylaws` | USG Constitution and By-Laws | Dev 1 | Display and manage USG constitution documents |
| `feature/org-chart` | Organizational Chart | Dev 2 | Interactive org chart visualization |
| `feature/programs-services` | Programs and Services | Dev 3 | Showcase USG programs and services |
| `feature/accomplishments-announcements` | Accomplishments & Announcements | Dev 4 | News, achievements, and announcements |
| `feature/issuances-reports` | Issuances and Reports | Dev 5 | Official documents and reports |
| `feature/financial-transactions` | Financial Transactions | Dev 6 | Financial transparency dashboard |
| `feature/tinig-dinig` | TINIG DINIG Communication | Dev 7 & 8 | Student communication/ticket system |

## Workflow Rules

### 1. Feature Development
```bash
# Start working on your feature
git checkout develop
git pull origin develop
git checkout feature/your-feature

# Make changes and commit frequently
git add .
git commit -m "feat: description of changes"

# Push your feature branch
git push origin feature/your-feature
```

### 2. Keeping Feature Branch Updated
```bash
# Regularly sync with develop
git checkout develop
git pull origin develop
git checkout feature/your-feature
git merge develop
# Resolve any conflicts
git push origin feature/your-feature
```

### 3. Creating Pull Request
When your feature is complete:
1. Push all changes to your feature branch
2. Create a Pull Request (PR) from `feature/your-feature` → `develop`
3. Request code review from at least 1 team member
4. Address review comments
5. Merge after approval

### 4. Release Process
```bash
# When develop is stable and ready for release
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### 5. Hotfix (Emergency Fixes)
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-bug-fix

# Fix the bug, then merge to both main and develop
git checkout main
git merge hotfix/critical-bug-fix
git checkout develop
git merge hotfix/critical-bug-fix

# Delete hotfix branch
git branch -d hotfix/critical-bug-fix
```

## Commit Message Convention

Use conventional commits:
```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Code refactoring
test:     Adding tests
chore:    Build/config changes
```

Examples:
```bash
git commit -m "feat: add constitution document viewer"
git commit -m "fix: resolve org chart rendering issue"
git commit -m "docs: update API documentation"
```

## Protected Branch Rules (Recommended)

### For `main`:
- Require pull request before merging
- Require at least 2 approvals
- Require status checks to pass
- No direct pushes

### For `develop`:
- Require pull request before merging
- Require at least 1 approval
- Require status checks to pass

## Developer Assignment

| Developer | Feature Branch | Files/Folders to Work On |
|-----------|---------------|--------------------------|
| Developer 1 | `feature/constitution-bylaws` | `client/src/features/constitution/`, `server/models/Constitution.model.js`, `server/routes/constitution.routes.js` |
| Developer 2 | `feature/org-chart` | `client/src/features/org/`, `server/models/OrgMember.model.js`, `server/routes/org.routes.js` |
| Developer 3 | `feature/programs-services` | `client/src/features/programs/`, `server/models/Program.model.js`, `server/routes/program.routes.js` |
| Developer 4 | `feature/accomplishments-announcements` | `client/src/features/announcements/`, `server/models/Announcement.model.js`, `server/routes/announcement.routes.js` |
| Developer 5 | `feature/issuances-reports` | `client/src/features/issuances/`, `server/models/Issuance.model.js`, `server/routes/issuance.routes.js` |
| Developer 6 | `feature/financial-transactions` | `client/src/features/finance/`, `server/models/Transaction.model.js`, `server/routes/finance.routes.js` |
| Developer 7 & 8 | `feature/tinig-dinig` | `client/src/features/tinig/`, `server/models/Ticket.model.js`, `server/routes/ticket.routes.js` |

## Getting Started for Each Developer

```bash
# Clone the repository
git clone https://github.com/BlckInfa/UNC-USG-Tinig-Dinig-Website.git usg-system
cd usg-system

# Fetch all branches
git fetch --all

# Switch to your assigned feature branch
git checkout feature/your-assigned-feature

# Install dependencies
npm run install:all

# Start development
npm run dev:all
```

## Questions?
Contact the team lead or project manager for any branching/workflow questions.
