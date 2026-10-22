# GitHub profile

The profile lives in the public `wsims/wsims` repository. `README.md` supplies the content. `assets/` contains the approved social buttons and selected Odyssey illustration as self-contained SVGs. The artwork is the same in both themes; the social buttons adapt to light and dark mode.

## Preview

Run `npm run preview`, then open http://127.0.0.1:4175. The preview includes a light/dark switch. No install step is needed; the scripts use Node's standard library.

## Edit

Edit `README.md` for copy and links. Run `npm run render` to rebuild the artwork wrappers and social buttons. Rendering is offline and deterministic. No contribution data, tokens, scheduled workflows, or external image dependencies are used.

The selected artwork master and built-in image-generation prompt are in [alternatives/odyssey/](alternatives/odyssey/). The optimized production image is `source/odyssey.webp`. The original day/night stoa artwork and prompts remain in [source/art-direction.md](source/art-direction.md), and the original profile layout is preserved in [alternatives/original-stoa/README.md](alternatives/original-stoa/README.md).

## Publish

Create a public repository named `wsims` under the `wsims` account and push this directory's `main` branch. GitHub displays the root README on the account profile. Keep `assets/` with the README. `source/` and `scripts/` allow future artwork edits.

The local preview approximates GitHub's styling. GitHub controls the final Markdown rendering and image caching.
