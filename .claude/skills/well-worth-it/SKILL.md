```markdown
# well-worth-it Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `well-worth-it` JavaScript repository. It covers file naming, import/export styles, commit patterns, and testing conventions. While no specific framework is detected, this guide provides a comprehensive reference for contributing to or maintaining the codebase.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.js`, `calculateTotal.js`

### Import Style
- Use **absolute imports** rather than relative paths.
  - Example:
    ```javascript
    import { calculateTotal } from 'utils/calculateTotal';
    ```

### Export Style
- Use **named exports** for functions, constants, and objects.
  - Example:
    ```javascript
    // In calculateTotal.js
    export function calculateTotal(items) {
      // ...
    }
    ```

    ```javascript
    // In another file
    import { calculateTotal } from 'utils/calculateTotal';
    ```

### Commit Patterns
- Commit messages are **freeform** (no strict prefixes).
- Average commit message length: **42 characters**.
  - Example:  
    ```
    Add logic for calculating discounts
    ```

## Workflows

### Code Contribution
**Trigger:** When adding new features or fixing bugs  
**Command:** `/contribute`

1. Create a new file using camelCase naming.
2. Use absolute imports for dependencies.
3. Export new functions or constants using named exports.
4. Write or update corresponding test files (`*.test.*`).
5. Commit changes with a clear, concise message.

### Testing
**Trigger:** When verifying code correctness  
**Command:** `/test`

1. Locate or create a test file matching `*.test.*` pattern.
2. Write tests for new or modified functions.
3. Run the test suite using the project's test runner (framework unknown; refer to project documentation or scripts).
4. Ensure all tests pass before committing.

## Testing Patterns

- Test files follow the `*.test.*` naming convention.
  - Example: `calculateTotal.test.js`
- Testing framework is **unknown**; check project scripts or documentation for details.
- Place tests alongside or in a dedicated test directory as per project structure.

  Example test file:
  ```javascript
  import { calculateTotal } from 'utils/calculateTotal';

  test('calculates total for items', () => {
    const items = [{ price: 10 }, { price: 15 }];
    expect(calculateTotal(items)).toBe(25);
  });
  ```

## Commands
| Command      | Purpose                                 |
|--------------|-----------------------------------------|
| /contribute  | Start the code contribution workflow    |
| /test        | Run or write tests for the codebase     |
```
