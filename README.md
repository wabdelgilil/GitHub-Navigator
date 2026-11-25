# GitHub-Navigator

An open-source, local-first personal command center and executive dashboard for managing your GitHub repositories, branches, and commit histories with zero latency.

> 🚀 **Official Desktop Companion:** Pair GitHub-Navigator with [GitHub-Sync-Hub](https://github.com/wabdelgilil/GitHub-Sync-Hub) — standalone single-file portable Windows utilities (Dark Mode WPF + System Tray + ANSI CLI) for automated two-way synchronization across your workspaces!

---

## 🔄 Official Companion: GitHub-Sync-Hub

GitHub-Navigator is designed to work hand-in-hand with [GitHub-Sync-Hub](https://github.com/wabdelgilil/GitHub-Sync-Hub), an open-source suite of zero-dependency Windows launchers for safe two-way Git synchronization (`pull --rebase --autostash`, `commit`, and `push`).

### Direct Standalone Downloads (No Git Clone Required)

| Utility | Interface | Direct 1-Click Download | Description |
| :--- | :--- | :--- | :--- |
| **`Sync_All_Projects_GUI.bat`** | Modern Dark Mode WPF + System Tray | [⬇️ Download `Sync_All_Projects_GUI.bat`](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/Sync_All_Projects_GUI.bat) | Multi-repo dashboard with live checkboxes, runtime folder browser, and native Windows notifications |
| **`Sync_All_Projects.bat`** | ANSI Terminal + Spinners | [⬇️ Download `Sync_All_Projects.bat`](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/Sync_All_Projects.bat) | Keyboard-driven bulk sync & unattended `--auto` Task Scheduler automation |
| **`sync_github_gui.bat`** | Compact Dark Mode WPF | [⬇️ Download `sync_github_gui.bat`](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/sync_github_gui.bat) | Visual single-repo status overview & 1-click sync |
| **`sync_github.bat`** | Lightweight Terminal | [⬇️ Download `sync_github.bat`](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/sync_github.bat) | Double-click or CLI single-repo sync |

> **Browser Download Tip:** Right-click any download link above and choose **Save link as...** to save the `.bat` file directly into your projects folder.

### 100% Portable Directory Resolution

The utilities automatically adapt to any environment using a deterministic three-tier priority flow:
1. **Command-line Argument:** `Sync_All_Projects.bat "C:\Users\<user>\Projects"` or `--dir "%USERPROFILE%\Projects"`
2. **Interactive Folder Picker:** In GUI mode, launching without arguments opens a native Windows `FolderBrowserDialog`.
3. **Fallback Script Location:** Defaults to `%~dp0` (the folder where the script is located).

```text
  Target Workspace Directory / (e.g. %USERPROFILE%\Projects\)
  ├── Project-Alpha/
  │   └── .git/               --> [DETECTED] Syncs branch origin/main
  ├── Project-Beta/
  │   └── .git/               --> [DETECTED] Syncs branch origin/dev
  ├── Documentation/          --> [SKIPPED]  No .git folder
  └── Sync_All_Projects_GUI.bat
```

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
git clone https://github.com/wabdelgilil/GitHub-Navigator.git
cd GitHub-Navigator
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

GitHub-Navigator is built as a pure client-side single-page application using:
- **Vite** for optimized development and bundling
- **React 18** and **TypeScript** (Strict Mode)
- **Tailwind CSS** for layout and dark-mode styling
- **Lucide Icons** for iconography
- **Browser LocalStorage** for token persistence and custom metadata caching
