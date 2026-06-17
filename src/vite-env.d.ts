/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GID_CALLBACK_URI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
