# Raged Lab / 3D

The main portfolio served by GitHub Pages at `/`, with `/3d/` retained as an alias. The previous website is preserved under `/classic/`, with shared images and the résumé still at their original URLs. Existing legacy page URLs also remain available.

Serve the repository root through an HTTP server (ES modules do not load from `file://`), then visit `/` or `/3d/`. No package installation is needed. After editing `3d/index.html`, run `node 3d/sync-homepage.mjs` from the repository root to update the root `index.html`. Both entry points share the assets in `3d/`; root-relative URLs keep their links consistent.

- `index.html`: accessible page content, project tabs, and BVI case-study dialog.
- `sync-homepage.mjs`: copies the page to the root homepage, keeping both entry points identical.
- `styles.css`: responsive layouts, layered illustrations, and reduced-motion styles.
- `app.js`: project content, navigation, motion preference, dialogs, and copy-email action.
- `scene.js`: two WebGL scenes with procedurally built models, drag and keyboard controls, visibility-aware animation, and context-loss fallback.
- `vendor/`: pinned Three.js 0.180.0 ES modules and its MIT license, obtained from the published npm package through jsDelivr. No runtime CDN is required for 3D rendering.

The page references the existing portrait and résumé without modifying them. Google Fonts is optional; local system fonts are the fallback. Project visuals are conceptual illustrations, not engineering CAD or research data. The research chart is decorative and is excluded from the accessibility tree.

When WebGL or JavaScript is unavailable, the page retains readable HTML, contact links, and static artwork. Without JavaScript, a link leads to the existing mission archive. Motion follows `prefers-reduced-motion` by default and can be paused explicitly. The preference is stored only in this origin's `ragedlab-3d-motion` localStorage key. Offscreen and background-tab animations stop. Canvas resolution is capped at 1.5 times CSS resolution.

Before publishing: sync the root homepage, then check `/`, `/3d/`, and the classic-site links. For interactive changes, check desktop and narrow layouts, project switching, the BVI dialog, keyboard model rotation, motion settings, mobile navigation, and contact links. Push to the existing `main` branch and let the repository's existing GitHub Pages deployment publish the site.
