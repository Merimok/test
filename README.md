# FactCheck AI

This repository contains the browser extension **FactCheck AI – Free Online**.
The add-on highlights factual claims on web pages and verifies them using only
open sources and a user’s own ChatGPT session. See
[TECH_SPEC_RU.md](TECH_SPEC_RU.md) for the full Russian specification. A basic
UI mock is available in [DESIGN_RU.md](DESIGN_RU.md).

## Structure

```
extension/    # Browser extension (Manifest V3)
```

## Quick start

Install the Node dependencies and compile the TypeScript sources:

```bash
npm install
npm run build
```

Load the `extension/` folder as an unpacked extension in your browser. The
compiled scripts are output to `extension/dist/` and referenced in the manifest.

## Build the extension

The TypeScript sources are compiled with `npm run build` which runs `tsc` under
the hood. The compiled scripts appear in `extension/dist/` and are referenced by
`extension/manifest.json`.
