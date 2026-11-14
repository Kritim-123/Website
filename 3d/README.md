# Raged Lab / 3D

A standalone alternate portfolio served by GitHub Pages at `/3d/`. Every new source file and dependency is contained in this folder. The classic website is unchanged.

Open `index.html` through an HTTP server (ES modules do not load from `file://`). No package installation or build step is needed. For example, serve the repository root with an existing static server, then visit `/3d/`.

- `index.html`: accessible page content, project tabs, and BVI case-study dialog.
- `styles.css`: responsive layouts, layered illustrations, and reduced-motion styles.
- `app.js`: project content, navigation, motion preference, dialogs, and copy-email action.
- `scene.js`: two WebGL scenes with procedurally built models, drag and keyboard controls, visibility-aware animation, and context-loss fallback.
- `vendor/`: pinned Three.js 0.180.0 ES modules and its MIT license, obtained from the published npm package through jsDelivr. No runtime CDN is required for 3D rendering.

The page references the existing portrait and résumé without modifying them. Google Fonts is optional; local system fonts are the fallback. Project visuals are conceptual illustrations, not engineering CAD or research data. The research chart is decorative and is excluded from the accessibility tree.

When WebGL or JavaScript is unavailable, the page retains readable HTML, contact links, and static artwork. Without JavaScript, a link leads to the existing mission archive. Motion follows `prefers-reduced-motion` by default and can be paused explicitly. The preference is stored only in this origin's `ragedlab-3d-motion` localStorage key. Offscreen and background-tab animations stop. Canvas resolution is capped at 1.5 times CSS resolution.

Before publishing: check desktop and narrow layouts; switch all five missions; open and close the BVI dialog; test keyboard model rotation, motion pause, mobile navigation, and contact links. Confirm `git diff --name-only` contains only `3d/` paths. Push to the existing `main` branch and let the repository's existing GitHub Pages deployment publish the folder.
