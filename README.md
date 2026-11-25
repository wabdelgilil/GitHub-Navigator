# GitNavigator

An open-source, local-first personal command center and executive dashboard for managing your GitHub repositories, branches, and commit histories with zero latency.

---

## Key Highlights

- **Multiple View Modes**: Default detailed Data Table, Compact List, and Cards Grid with fast switcher.
- **Instant Multi-Vector Search**: Client-side fuzzy searching across repository names, topics, descriptions, and programming languages.
- **Searchable Dropdown Select**: Fast searchable repository combobox in branch tree and commit views.
- **Visual Branch Network**: Interactive SVG Bézier curve branching graph with drag-to-pan, mouse wheel / button zoom in/out, fullscreen canvas, and ahead/behind calculations.
- **Embedded Code & Markdown Viewer**: PrismJS syntax highlighting (Tomorrow Dark) and GitHub Flavored Markdown viewer (`react-markdown` + `remark-gfm`) with line numbers, raw/preview toggle, and one-click copy.
- **Local Sync Hub Companion**: Deep integration with `GitHub-Sync-Hub` companion scripts (`Sync_All_Projects_GUI.bat`, etc.), 1-click batch downloads, single-repo custom sync script generator, and automated Windows Task Scheduler guides.
- **Segmented Catalog**: One-click toggling between Public, Private, Forked, Source, and Archived repositories.
- **Workspace Hygiene Radar**: Identifies repositories inactive for over six months to streamline profile maintenance.
- **Local Custom Labels**: Personal tags and groupings stored in browser local storage without modifying remote repository settings.
- **Local-First Security**: Personal Access Tokens communicate directly from the browser to the GitHub API. No intermediate backend servers or telemetry.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- A GitHub Personal Access Token (classic or fine-grained with `repo` and `read:user` permissions)

### Installation & Local Run
```bash
git clone https://github.com/wabdelgilil/gitnavigator.git
cd gitnavigator
npm install
npm run dev
```

The application will start on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```

---

## Architecture Overview

GitNavigator is built as a pure client-side single-page application using:
- **Vite** for optimized development and bundling
- **React 18** and **TypeScript** (Strict Mode)
- **Tailwind CSS** for layout and dark-mode styling
- **Lucide Icons** for iconography
- **Browser LocalStorage** for token persistence and custom metadata caching
