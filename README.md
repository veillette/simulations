OpenStax Simulations
===========

A collection of web-based physics simulations embedded in OpenStax textbooks, built with [Vite](https://vitejs.dev/), [Backbone.js](https://backbonejs.org/), and [PixiJS v7](https://pixijs.com/).

[Demo here](http://veillette.github.io/simulations/)

## Requirements

- [Node.js](https://nodejs.org/) 18 or later and npm

## Building

### Build all simulations

From the repository root:

```sh
npm install          # install root tooling and all per-sim dependencies
npm run build:all    # build every sim into its own dist/ folder
```

### Build only changed simulations

```sh
npm run build        # builds sims with uncommitted changes (same as npm run dist)
```

### Build a single simulation

```sh
cd wave-interference
npm run build        # outputs to wave-interference/dist/
```

## Development

Each simulation has its own Vite dev server with hot-module replacement.

```sh
cd wave-interference
npm run dev          # starts at http://localhost:5173
```

To browse an index of all simulations without a dev server:

```sh
npm run dev          # from the repository root — serves static files at http://localhost:8080
```

## Linting

```sh
npm run lint              # lint all sims
npm run lint:fix          # auto-fix all sims
npm run lint:changed      # lint only changed sims
npm run lint:changed:fix  # auto-fix only changed sims
```

## Deploying

```sh
npm run deploy    # build all sims and publish to GitHub Pages
```

## Repository Structure

```
simulations/
├── common/               # shared utilities, views, and styles
├── <sim-name>/
│   ├── src/
│   │   ├── index.html    # Vite entry point
│   │   ├── js/           # ES module source
│   │   │   └── main.js
│   │   ├── styles/       # Less stylesheets
│   │   └── templates/    # Underscore HTML templates
│   ├── vite.config.js    # per-sim Vite configuration
│   ├── package.json
│   └── dist/             # built output (git-ignored)
└── scripts/              # root-level build/deploy helpers
```

## Tech Stack

| Layer | Library |
|-------|---------|
| Module bundler | Vite 8 + Rolldown |
| Rendering | PixiJS 7 |
| MVC | Backbone.js + Underscore |
| DOM / AJAX | jQuery |
| Styles | Less → LightningCSS |
| UI components | Bootstrap 5 |

## License

This software is subject to the provisions of the GNU Affero General Public License Version 3.0 (AGPL). See license.txt for details. Copyright (c) 2013 Rice University.
