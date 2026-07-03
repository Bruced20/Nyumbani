# Nyumbani Developer Contribution Guide

Welcome to the Nyumbani development team! Follow these guidelines to keep code quality high and maintain operational reliability.

---

## 🛠️ Developer Workflow

1.  **Strict Type Safety:** Ensure TypeScript strict mode compiles without any exceptions:
    ```bash
    npx tsc --noEmit
    ```
2.  **Linting & Style Checks:** Verify style constraints using ESLint and Prettier:
    ```bash
    npm run lint
    ```
3.  **Run Unit Tests:** Run the complete test suite locally:
    ```bash
    npm run test
    ```
4.  **Production Verification:** Ensure Next.js builds successfully before submitting pull requests:
    ```bash
    npm run build
    ```

---

## 🧪 Testing Guidelines

- We use **Vitest** for testing.
- Unit tests live inside `.test.ts` files adjacent to their source files (e.g. `properties.test.ts`).
- Mock database responses using `vi.mock` rather than calling active endpoints.
- When querying cached functions, mock `next/cache`:
  ```typescript
  vi.mock('next/cache', () => ({
    unstable_cache: (cb: any) => cb,
    revalidateTag: vi.fn(),
  }))
  ```

---

## 📝 Commit Directives

Follow Conventional Commits guidelines:

- `feat:` New user-facing features or major components.
- `fix:` Bug fixes.
- `infra:` CI workflows, linting setups, or developer scripts.
- `docs:` Documentation files.
- `test:` Adding or modifying unit tests.
