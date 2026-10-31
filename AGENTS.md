<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Agent Guide

BookNook is a small online library built with the Next.js App Router. Readers can browse books, manage a personal shelf, add books, and track borrows. The UI currently focuses on the marketing home page and authentication flow; most library routes are still to be implemented.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start the dev server (Turbopack)
npm run build     # production build
npm run lint      # ESLint (Next.js core-web-vitals)
npm run start     # serve a production build
```

There is no test suite configured. After changes, run `npm run lint` and `npm run build`; both should pass before handing work back.

## Stack

- **Next.js 16.4.3** — App Router, Turbopack, React Compiler, Cache Components (`cacheComponents`), Partial Prefetching.
- **React 19.3**
- **Tailwind CSS v4** — compiled through `@tailwindcss/turbopack` (see `next.config.mjs`).
- **shadcn/ui** — `base-nova` style, configured in `components.json`; JavaScript (not TypeScript), no RSC-to-client mismatch.
- **Base UI** — primitives used by shadcn components (`src/components/ui/button.jsx`).
- **lucide-react** — icon set.
- **`cn`** — class-name helper. `src/lib/utils.js` re-exports it, although existing components import `cn` from `"cn"` directly.

## Project structure

```
src/
  app/
    layout.js          # root layout: html/body, fonts, global CSS only
    page.js            # home: Navbar + Hero
    globals.css        # Tailwind v4 + shadcn theme variables
    login/page.js      # /login route (server component) -> LoginForm
  components/
    Navbar.jsx         # client; desktop + mobile nav and auth button
    Hero.jsx           # client; auto-rotating hero slider
    LoginForm.jsx      # client; centered login card, validation, demo auth
    ui/button.jsx      # shadcn/base-ui Button
  lib/utils.js
public/                # local brand images, hero images, icons
```

### Routes and known gaps

- Implemented routes: `/` and `/login`.
- `Navbar.jsx` links to `/books`, `/my-books`, `/add-book`, and `/my-borrows`; these pages do not exist yet. Do not assume they are functional.
- The Navbar is rendered per page, not in the root layout. New pages should render `<Navbar />` explicitly unless the layout strategy is intentionally changed.
- `/login` is prerendered as a static route. Keep it static unless there is a strong reason to make it dynamic.

## Next.js 16 notes

- **Read the bundled docs first.** Relevant guides live in `node_modules/next/dist/docs/`. Start with `01-app/01-getting-started/03-layouts-and-pages.md`, `04-linking-and-navigating.md`, and `08-caching.md` when working on routing/pages.
- `next.config.mjs` enables `cacheComponents` and `partialPrefetching`. Routes prerender static shells by default; request-time APIs (`searchParams`, `cookies()`, `headers()`) must be wrapped in `<Suspense>` or moved out of render.
- In server components, `params` and `searchParams` are Promises. Await them.
- Prefer reading query parameters in event handlers when the value is only needed on submit (as `LoginForm` does with `callbackURL`); this avoids pulling the page out of static rendering and avoids the `useSearchParams` Suspense requirement.
- Use `next/link` for internal navigation and `next/image` for local images in `public/`.
- Use `"use client"` only for components that need state, effects, event handlers, or browser APIs. Keep pages as server components where possible.
- Follow Next.js file conventions (`page.js`, `layout.js`); do not create a separate router.

## Code conventions

- **Language:** JavaScript/JSX only — this project is not TypeScript. Match existing style: double quotes, semicolons, 2-space indentation, function declarations for components, and blank lines between major JSX sections.
- **Imports:** use the `@/*` alias from `jsconfig.json` for cross-directory imports in new code (`@/components/...`, `@/lib/...`). Existing files use relative imports in places; either is acceptable, but prefer the alias.
- **Components:** pages are server components by default; interactive UI belongs in client components (`Navbar`, `Hero`, `LoginForm`). Keep form logic and browser APIs inside the client component.
- **Styling:** Tailwind utility classes inline. Global CSS is reserved for theme tokens and base styles in `src/app/globals.css`. No CSS modules are currently used.
- **Design language:** warm, editorial, "quiet library" aesthetic.
  - Cream background: `#F7F4EC`; card surfaces: `#FFFDF8`, `#FFFDF8/95`.
  - Terracotta accent: `#B84E2D`; hover: `#963C23`.
  - Ink text: `#252722`; muted text: `#6B6E63`/`#7A7D72`.
  - Borders: `#E7DED0`, `#E2D8C8`; warm highlights: `#D99A72`, `#E7B58E`.
  - Headings use `font-serif`; body copy uses the default Geist sans. Use italic serif for emphasized words ("back.").
  - Rounded cards, soft shadows, thin borders, subtle background washes. Use motion sparingly and respect `prefers-reduced-motion` (see `Navbar.jsx`).
- **Responsive:** design mobile-first; verify both desktop and small screens. The navbar uses a mobile menu below `lg`.
- **Accessibility:** keep labels tied to inputs, use `aria-invalid`/`aria-describedby` for errors, `role="alert"` for validation messages, and meaningful `aria-label`s on icon-only buttons.

## Authentication behavior

There is no auth backend or provider installed yet. The current flow is a UI preview:

- `Navbar` exposes the intended auth contract: `user`, `authLoading`, and `onLogout` props. Private links redirect unauthenticated users to `/login?callbackURL=<target>`.
- `LoginForm` asks for a name, a valid email, and a 6+ character password.
- "Remember me" stores `{ name, email }` in `localStorage` under `booknook:remembered-profile`, read through `useSyncExternalStore` to avoid hydration mismatches.
- The Google button and email form simulate success, then navigate to the sanitized `callbackURL` (or `/`). They are marked with comments in `LoginForm.jsx`; replace those placeholders with the real auth provider calls.
- Keep redirects same-origin: accept only paths beginning with `/`, and reject `//` and `/\`.
- When real auth is added, wire `Navbar`'s `user`/`onLogout` props (or a shared auth provider) so the header reflects sign-in state.

## Do not

- Do not convert the project to TypeScript or change the shadcn configuration without being asked.
- Do not add a global Navbar to `layout.js` or relocate the existing one as a drive-by refactor.
- Do not remove or edit the generated `nextjs-agent-rules` block at the top of this file.
- Do not add dependencies for features that can be built with the existing stack.
- Do not commit `.next/`, build output, or local environment files.
