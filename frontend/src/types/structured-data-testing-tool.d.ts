declare module "structured-data-testing-tool" {
  import { Readable } from "node:stream";

  interface TestResult {
    schemas: string[];
    passed: unknown[];
    failed: unknown[];
    warnings: unknown[];
  }

  interface TestOptions {
    schemas?: string[];
    presets?: unknown[];
    tests?: unknown[];
  }

  export function structuredDataTest(
    input: string | Buffer | Readable,
    options?: TestOptions,
  ): Promise<TestResult>;
}
