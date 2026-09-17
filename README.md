# Daily Assistant Demo 🎙️

Credit Memo creation interface + Meena meeting notes assistant

## Quick Start

```bash
npm install
npm run dev
```

Ouvre: **http://localhost:5173**

## Features

✅ **Credit Memo Creation** (Split-screen: Editor + AI Chat sidebar)
✅ **Meena** - Meeting notes with voice recording & chat
✅ **Desktop Environment** - Simulated Windows 11 interface
✅ **Floating Windows** - Standalone apps (Daily Assistant + Meena)

## Structure

```
src/
├── components/
│   ├── copilot/          # Credit Memo Creator + Chat
│   ├── meena/            # Meeting notes assistant
│   ├── desktop/          # Desktop environment
│   └── host/             # MyClientDev integration
├── App.tsx               # Main orchestration
└── index.tsx
```

## Build

```bash
npm run build
```

Output: `dist/`

---

Made with ❤️ for platform-rad
