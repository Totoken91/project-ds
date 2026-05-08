{
  "_comment": "REFERENCE TEMPLATE — Do not run this directly. Use it to verify dependency versions after Claude Code runs `npm create vite@latest` and installs deps. Versions below are minimums known to work together as of 2026.",
  "name": "tokimemo-proto",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "immer": "^10.1.0",
    "xstate": "^5.19.0",
    "@xstate/react": "^5.0.0",
    "inkjs": "^2.3.0",
    "framer-motion": "^11.15.0",
    "howler": "^2.2.4"
  },
  "devDependencies": {
    "@types/howler": "^2.2.12",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
