# OctoDeck

An open-source, local-first personal command center and workspace dashboard for managing your GitHub repositories, branches, and commit histories with zero latency.

---

## Key Highlights

- **Instant Multi-Vector Search**: Client-side fuzzy searching across repository names, topics, descriptions, and programming languages.
- **Segmented Catalog**: One-click toggling between Public, Private, Forked, Source, and Archived repositories.
- **Visual Branch Divergence**: Graphical comparison of repository branches against the default branch, displaying exact ahead and behind commit counts.
- **Commit Timeline**: Chronological commit flow with author details, short SHA identifiers, and direct links.
- **Collapsible File Explorer**: Fast in-browser directory browsing and raw source previews without page reloads.
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
git clone https://github.com/your-username/octodeck.git
cd octodeck
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

OctoDeck is built as a pure client-side single-page application using:
- **Vite** for optimized development and bundling
- **React 18** and **TypeScript** (Strict Mode)
- **Tailwind CSS** for layout and dark-mode styling
- **Lucide Icons** for iconography
- **Browser LocalStorage** for token persistence and custom metadata caching
