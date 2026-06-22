/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GID_CLIENT_ID?: string
  readonly VITE_GID_CALLBACK_URI?: string
  readonly VITE_GID_TOKEN_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
