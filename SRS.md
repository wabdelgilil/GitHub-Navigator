# System Requirements Specification (SRS)
## GitNavigator — Personal Command Center & Intelligent Dashboard for GitHub

### 1. Document Control & Metadata
- **Project Name:** GitNavigator
- **Document Version:** v1.1.0
- **Classification:** Public Open-Source Software Specification
- **Architectural Paradigm:** Pure Client-Side Single-Page Application (Vite / React / TypeScript / Tailwind CSS / LocalStorage & IndexedDB)
- **Primary Domain:** Developer Productivity Tools & GitHub Ecosystem Management

---

### 2. Executive Summary & Problem Definition
#### 2.1 Domain Problem
GitHub is the industry-standard code hosting platform, yet its default profile and repository browser interface is primarily designed around linear social feeds and basic repository lists rather than executive workflow management. Developers with tens or hundreds of repositories encounter significant operational frictions:
1. **Inefficient Filtering & Search:** Inability to instantly search across repository names, descriptions, topics, and languages simultaneously without slow page pagination.
2. **Opaque Workspace Hygiene:** Difficulty separating active repositories from stale/abandoned ones, tracking unmerged pull requests, and identifying missing assets (e.g., license, readme).
3. **Absence of Custom Tagging:** GitHub topics are public and repo-bound; developers cannot organize repos into private, personalized groupings (e.g., "Client Work", "Personal Learning", "Archive Candidate").
4. **Coarse Commit & Branch Visibility:** GitHub's commit graphs are buried inside repository sub-tabs with rigid interfaces, lacking interactive visual tree representations of branch divergence and ahead/behind metrics.

#### 2.2 Solution Statement
**OctoDeck** is an open-source, local-first and static-deployable personal command center built with Vite, React, and TypeScript. It interfaces directly with the GitHub REST and GraphQL APIs using user-supplied Personal Access Tokens (PAT) stored exclusively in the client's local secure browser storage. It delivers instantaneous fuzzy search, visual branch/commit tree explorers, custom collection organizers, and repository lifecycle analytics, with zero server overhead and full deployability to GitHub Pages.

---

### 3. Functional Requirements & Capabilities

#### 3.1 Authentication & Token Management (SEC-01)
- **Token Input & Validation:** Secure UI prompt for GitHub Personal Access Token (classic or fine-grained with `repo` and `read:user` scopes).
- **Client-Side Storage:** Zero server-side persistence of tokens; tokens are stored in browser `localStorage` or session-level state, protected from unauthorized exposure.
- **Quota & Rate-Limit Tracking:** Real-time display of remaining GitHub API rate limits (core limit, remaining calls, reset timestamp).
- **Session Revocation:** Instant one-click token purge and cache reset.

#### 3.2 Intelligent Repository Catalog (CAT-01)
- **Multi-Vector Instant Search:** Client-side fuzzy search across repository names, descriptions, programming languages, and assigned tags with zero network latency.
- **Segmented Views:**
  - All Repositories
  - Public Repositories
  - Private Repositories
  - Forked Repositories
  - Archived Repositories
  - Templates
- **Sorting & Filtering:** Sort by last updated date, star count, open issue count, disk size, or alphabetical order.
- **Custom Collections (Tags):** Ability to assign local, non-destructive custom tags to repositories (stored locally in IndexedDB/localStorage) to group projects arbitrarily.

#### 3.3 Interactive Branch & Commit Tree Visualizer (TREE-01)
- **Interactive Visual Tree (Branch Network):** Graphical visualization of repository branches, divergence from the default branch (`main` / `master`), and merge intersections.
- **Ahead/Behind Metrics:** Calculated commit differential indicating how many commits a branch leads or lags behind the default branch.
- **Commit History & Activity Heatmap:** Temporal visualization of commit frequency and latest milestone messages.
- **File Tree Navigator:** Collapsible, instant-access file explorer allowing rapid browsing of repository folder hierarchies without reloading pages.

#### 3.4 Repository Health & Hygiene Radar (RADAR-01)
- **Stale Detection:** Flags repositories inactive for > 6 months.
- **Standard Asset Audit:** Flags repositories lacking essential files (`README.md`, `LICENSE`, `.gitignore`).
- **Open Workload Tracker:** Aggregated overview of open Pull Requests and Issues authored by or assigned to the authenticated user.

#### 3.5 Quick Actions & Developer Shortcuts (ACT-01)
- One-click copy for HTTPS and SSH clone commands.
- Deep-links to local IDEs (`vscode://file/...` or protocol handlers).
- Direct one-click navigation to GitHub settings, releases, and branches.

---

### 4. Non-Functional Requirements & Engineering Standards

#### 4.1 Security & Privacy
- **Zero Third-Party Telemetry:** No user data or analytics transmitted to third-party endpoints.
- **Direct API Communication:** All HTTP requests originate from the user's browser direct to `https://api.github.com`.
- **Environment Isolation:** Zero server dependencies; 100% client-side execution.

#### 4.2 Performance & Responsiveness
- **Search Response Time:** Sub-10 millisecond fuzzy search latency across 500+ repositories.
- **Caching Layer:** Local caching of fetched repository metadata with configurable cache time-to-live (TTL) to avoid redundant API consumption.
- **Responsive Layout:** Responsive design accommodating standard desktop screens (1080p, 1440p, 4K) down to laptop viewports with clean dark/light mode toggle.

#### 4.3 Code Quality & Maintainability
- **Type Safety:** 100% TypeScript with strict mode enabled (`noImplicitAny: true`, `strictNullChecks: true`).
- **Clean Architecture:** Strict separation between presentation components, custom hooks, API clients, and data stores.
- **Zero AI Footprint:** Human-written, idiomatic code adhering to Conventional Commits and standard industry patterns.

---

### 5. Architectural Topology & Component Hierarchy

```text
src/
├── components/           # Reusable UI component library
│   ├── common/           # Base primitives (Button, Modal, Input, Badge, Card)
│   ├── layout/           # Global shell (Navbar, Sidebar, AppLayout)
│   ├── catalog/          # Repository cards, search bar, filter tabs, tag manager
│   ├── tree/             # Branch graph, commit timeline, file tree
│   ├── radar/            # Stale radar, hygiene badges, language distribution
│   └── settings/         # Token configuration, cache controls, export/import
├── context/              # React Context providers (AuthContext, RepoContext, ThemeContext)
├── hooks/                # Custom React hooks (useGitHub, useDebounce, useLocalStorage)
├── lib/                  # Core domain logic and infrastructure
│   ├── api/              # Direct GitHub REST & GraphQL client
│   ├── storage/          # LocalStorage and IndexedDB adapters
│   └── utils/            # String formatters, date calculations, tree transformers
├── types/                # Domain TypeScript declarations
│   ├── github.ts         # GitHub API response interfaces
│   └── app.ts            # Application state, tags, and settings types
├── App.tsx               # Root component with routing / tab views
├── main.tsx              # Application entrypoint
└── index.css             # Tailwind CSS directives and custom styling
```

---

### 6. Verification & Definition of Done (DoD)
1. Application builds successfully (`npm run build`) with zero TypeScript errors and zero lint warnings.
2. Token configuration handles valid tokens, invalid tokens, and rate-limiting gracefully with explicit UI feedback.
3. Repository catalog lists, filters, and searches public and private repositories accurately.
4. Branch and commit visualizer renders git topologies without layout distortion or performance degradation.
5. Project structure strictly adheres to clean root policy and enterprise governance directives.
