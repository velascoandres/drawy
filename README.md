
# Drawy

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A small desktop application made with Tauri to save excalidraw whiteboards locally

![Cover](https://github.com/velascoandres/drawy/assets/12194462/94d9a8dc-5809-4006-8719-9bc44bf964ad)



## Used technologies
- Tauri.js
- Zustand
- Chakra UI
- Vite and Vitest
- Diesel
- Typescript
- React-Query
- Eslint
- React Hook Form
- Yup form validator


## Roadmap
- [x] Manage whiteboards (CRUD)
- [x] Search by name or description
- [x] Export to: png, svg and json
- [x] Toggle to dark mode or grid view through custom buttons
- [ ] Import from a json file through a custom UI.
- [ ] Load libraries through a custom UI  

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
diesel run migration
```

Run Tauri app
```
pnpm tauri dev
```

