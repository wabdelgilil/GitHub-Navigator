# Task 01 Plan: Project Scaffolding, Governance & Shell Architecture (Vite + React)

## 1. Objective
Establish the foundational infrastructure for OctoDeck using Vite, React 18/19, TypeScript, Tailwind CSS, Lucide icons, client-side GitHub authentication manager, and global dashboard layout.

## 2. Target File Structure
- `SRS.md`: System Requirements Specification (Completed).
- `package.json`: Project manifest with pinned dependencies and professional author metadata.
- `tsconfig.json` & `tsconfig.node.json`: Strict TypeScript configuration.
- `vite.config.ts`: Vite build configuration.
- `tailwind.config.js` & `postcss.config.js`: Tailwind styling configuration.
- `.gitignore`: Standard Node/Vite ignore definitions.
- `.env.example`: Secure environment template.
- `index.html`: Web application HTML shell.
- `src/main.tsx`: Application entrypoint.
- `src/App.tsx`: Main application shell with tab routing.
- `src/index.css`: Tailwind directives and theme variables.
- `src/lib/storage/token-storage.ts`: Local client-side token manager.
- `src/components/layout/Navbar.tsx`: Top navigation bar with status and token status indicator.
- `src/components/layout/Sidebar.tsx`: Navigation sidebar.

## 3. Step-by-Step Implementation Steps
1. [x] Create `SRS.md` and project governance files.
2. [ ] Scaffold Vite + React + TypeScript configuration and manifests.
3. [ ] Install dependencies (`react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `tailwindcss`, `postcss`, `autoprefixer`, etc.).
4. [ ] Configure styling and base UI theme in `src/index.css` and Tailwind config.
5. [ ] Implement client-side token management utility (`src/lib/storage/token-storage.ts`).
6. [ ] Build responsive shell layout with Navbar and Sidebar.
7. [ ] Verify compilation and execution without errors (`npm run build`).

## 4. Verification Gate (Definition of Done)
- Clean zero-warning compilation.
- Local execution runs on dev server.
- Token prompt loads and persists token securely in browser local storage.
