
# Drawy

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A small desktop application made with Tauri to save whiteboards made with excalidraw locally


## Used technologies
- Tauri.js
- Zustand
- Chakra UI
- Vite and Vitest
- Diesel
- Typescript
- React-Query
- Eslint

## Setup

Install diesel 

```
cargo install diesel_cli --no-default-features --features sqlite
```

Install dependencies
```
pnpm i
```

Run diesel migrations
```
diesel run migrations
```

Run Tauri app
```
pnpm tauri dev
```
