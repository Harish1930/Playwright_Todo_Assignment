# Playwright TodoMVC assignment

Implements all seven assignment scenarios: page verification, adding todos in order, completing/reopening a todo with counter checks, filtering, editing, clearing completed todos, and rejecting spaces-only input.

## Run

```sh
npm install
npx playwright install chromium
npm test
```

Choose the browser mode when running tests:

```sh
npm run test:headless # Run without a visible browser (also the default for npm test)
npm run test:headed   # Run with a visible browser
```

Run `npm run typecheck` to check TypeScript.

After running `npm test`, use `npm run report` to open the HTML report generated in `playwright-report/`.

`pages/TodoPage.ts` contains the page object. `fixtures/todo.fixture.ts` supplies it using Playwright's isolated browser context. One test runs all seven scenarios in named `test.step` sections, sharing the todos through the workflow and resetting the list before whitespace validation. The setup verifies the default ARIA snapshot using `toMatchAriaSnapshot()`. Assertions use descriptive messages and Playwright's automatic retries; there are no fixed waits.
