# GitHub-Navigator

<div align="center">

![GitHub-Navigator Logo](public/favicon.svg)

### Personal Command Center & Executive Dashboard for GitHub

An open-source, local-first web application designed to navigate, search, and visualize your GitHub repositories, diverging branches, and commit histories with zero latency.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://wabdelgilil.github.io/GitHub-Navigator/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[**Explore Live Web App »**](https://wabdelgilil.github.io/GitHub-Navigator/)

</div>

---

## 🎯 Overview

GitHub’s default web interface is structured around single-repository deep dives and social timelines. For developers, leads, and organizations managing dozens or hundreds of repositories, finding projects, auditing branch divergence, or inspecting files across repositories often feels fragmented and slow.

**GitHub-Navigator** bridges this gap. It acts as your personal command bridge:
- Runs **100% inside your browser** (Pure Single-Page Application).
- Direct, secure communication with GitHub’s REST and GraphQL APIs.
- Your Personal Access Token stays strictly in browser local storage—**zero intermediate servers, zero analytics, zero data leakage**.

---

## ✨ Key Features

### 📊 Multi-Mode Repository Catalog (Default Data Table)
- **Detailed Data Table (Default View):** High-density tabular layout displaying stars, forks, open issues, primary language, disk size, and update timestamps.
- **Alternative View Modes:** Switch in one click to **Compact List** or **Rich Cards Grid**.
- **Instant Multi-Vector Search:** Fuzzy filtering across repository names, descriptions, programming languages, and assigned tags with zero network lag.
- **Segmented Categories:** Filter instantly by Public, Private, Source, Forks, and Archived repositories.

### 🌳 Interactive Visual Branch Network
- **SVG Bézier Divergence Curves:** Clear visual graph mapping branches diverging from `main` or `master`.
- **Ahead / Behind Differential:** Real-time computation of how many commits each branch is ahead or behind.
- **Canvas Navigation Controls:**
  - Mouse drag-to-pan across the network.
  - Interactive mouse-wheel zoom and dedicated `+` / `-` / Reset zoom buttons.
  - Fullscreen canvas mode for comprehensive workflow review.
- **Searchable Repository Combobox:** Real-time search dropdown allowing instant switching between repositories.

### 📄 Embedded Code Syntax Highlighter & Markdown Reader
- **Code Viewer:** Syntax highlighting powered by **PrismJS** with Tomorrow Dark theme and line numbering.
- **Markdown Viewer:** Full **GitHub Flavored Markdown (GFM)** rendering with tables, checklists, and formatted callouts via `react-markdown` and `remark-gfm`.
- **Developer Utilities:** Raw text vs. formatted preview toggle, line count badge, and one-click clipboard copying.

### 🧹 Workspace Hygiene Radar
- **Stale Repository Detection:** Automatically highlights inactive repositories (> 6 months) for routine cleanup or archiving.
- **Language Composition Breakdown:** Aggregates and visualizes tech stack distribution across your entire profile.

### 🏷️ Local Custom Collections & Tags
- Assign personal, non-destructive labels (e.g. *"Client Project"*, *"Core Engine"*, *"Archive Candidate"*) saved exclusively in your browser without altering upstream GitHub metadata.

### 🔄 Integrated Local Sync Hub
- Built-in companion center that interfaces with [GitHub-Sync-Hub](https://github.com/wabdelgilil/GitHub-Sync-Hub) to generate repository-tailored batch scripts (`.bat`) and PowerShell one-liners for safe local automated two-way synchronization.

---

## 🔒 Security & Privacy First

- **Direct Client-to-API:** Requests flow directly from your browser to `api.github.com`.
- **No Backend Infrastructure:** Hosted as a static bundle on GitHub Pages. There are no tracking scripts, third-party databases, or proxy servers.
- **Token Isolation:** Your GitHub Personal Access Token (PAT) is stored exclusively in `localStorage` and can be purged with a single click at any time.

---

## 🚀 Quick Start

### Live Web Version
No installation required. Open the live deployment directly in any modern browser:
👉 **[https://wabdelgilil.github.io/GitHub-Navigator/](https://wabdelgilil.github.io/GitHub-Navigator/)**

### Running Locally

#### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or pnpm
- A GitHub Personal Access Token (classic or fine-grained with `repo` and `read:user` permissions)

#### Installation
```bash
# Clone the repository
git clone https://github.com/wabdelgilil/GitHub-Navigator.git
cd GitHub-Navigator

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

#### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Bundler** | Vite 5 |
| **UI Framework** | React 18 |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS 3 |
| **Iconography** | Lucide React |
| **Syntax Highlighting** | PrismJS |
| **Markdown Parsing** | react-markdown, remark-gfm |
| **State & Persistence** | React Hooks + Browser LocalStorage |
| **Hosting & CI/CD** | GitHub Pages + GitHub Actions |

---

## 🤝 Official Desktop Companion: GitHub-Sync-Hub

For local Windows desktop automation, pair **GitHub-Navigator** with [GitHub-Sync-Hub](https://github.com/wabdelgilil/GitHub-Sync-Hub) — a zero-dependency suite of portable batch and PowerShell utilities for automated two-way Git synchronization (`pull --rebase --autostash`, `commit`, and `push`).

### Standalone 1-Click Downloads (No Git Clone Required)

| Tool | Interface | Direct Download | Best For |
| :--- | :--- | :---: | :--- |
| **`Sync_All_Projects_GUI.bat`** | Modern Dark WPF + System Tray | [⬇️ **Download GUI**](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/Sync_All_Projects_GUI.bat) | Multi-repo dashboard, live folder browser, and notifications |
| **`Sync_All_Projects.bat`** | ANSI Terminal + Spinners | [⬇️ **Download CLI**](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/Sync_All_Projects.bat) | Bulk terminal sync & headless `--auto` Task Scheduler |
| **`sync_github_gui.bat`** | Compact Dark WPF | [⬇️ **Download Single-GUI**](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/sync_github_gui.bat) | Visual single-repo status & 1-click push |
| **`sync_github.bat`** | Lightweight Terminal | [⬇️ **Download Single-CLI**](https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/sync_github.bat) | Double-click or CLI single-repo sync |

```powershell
# Instant PowerShell download to current directory:
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/wabdelgilil/GitHub-Sync-Hub/main/tools/Sync_All_Projects_GUI.bat" -OutFile "Sync_All_Projects_GUI.bat"
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
