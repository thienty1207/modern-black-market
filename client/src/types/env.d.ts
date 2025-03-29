/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  // thêm các biến môi trường khác ở đây
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 