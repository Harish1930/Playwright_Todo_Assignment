# Playwright TodoMVC assignment

Implements all seven assignment scenarios: page verification, adding todos in order, completing/reopening a todo with counter checks, filtering, editing, clearing completed todos, and rejecting spaces-only input.

## Run

```sh
npm install
npx playwright install chromium
npm test
```

Run `npm run test:headed` to see the browser, or `npm run typecheck` to check TypeScript.

After running `npm test`, use `npm run report` to open the HTML report generated in `playwright-report/`.

`pages/TodoPage.ts` contains the page object. `fixtures/todo.fixture.ts` supplies it to each test using Playwright's isolated browser context, ensuring fresh local storage and an empty list. Each test sets up its own required todos. Assertions use descriptive messages and Playwright's automatic retries; there are no fixed waits.
