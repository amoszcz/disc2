import { defineConfig } from "@playwright/test";

const isCi = Boolean((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.CI);

export default defineConfig({
  testDir: "./tests/acceptance",
  retries: isCi ? 1 : 0,
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: true,
    timeout: 120000
  }
});
