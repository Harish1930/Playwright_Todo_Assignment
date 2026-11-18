import { test, expect } from '../fixtures/todo.fixture';

const todos = ['Learn Playwright', 'Practice Locators', 'Write Assertions'];

test.describe('TodoMVC', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto();
    await expect.soft(todoPage.newTodoInput, 'The default new-todo input should be ready').toBeVisible();
    await todoPage.expectTodoCount('all', 0);
  });

  test.afterEach(async ({ todoPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus && !todoPage.page.isClosed()) {
      await testInfo.attach('failure-screenshot', {
        body: await todoPage.page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }
  });

  test('verifies the default TodoMVC ARIA snapshot', async ({ todoPage }) => {
    await expect.soft(todoPage.body, 'The default page should expose the todos heading and new-todo input').toMatchAriaSnapshot(`
      - heading "todos" [level=1]
      - textbox "What needs to be done?"
    `);
  });

  test('completes the TodoMVC workflow and rejects spaces-only input', async ({ todoPage }) => {
    await test.step('opens TodoMVC with the todos heading and new-todo input visible', async () => {
      await expect.soft(todoPage.page, 'The page title should contain TodoMVC').toHaveTitle(/TodoMVC/);
      await expect.soft(todoPage.heading, 'The todos heading should be visible').toBeVisible();
      await expect.soft(todoPage.newTodoInput, 'The new-todo input should be visible').toBeVisible();
    });

    await test.step('adds three todos in the order entered', async () => {
      await todoPage.addTodos(todos);

      await expect.soft(todoPage.todoTitles, 'All three todo titles should appear in insertion order').toHaveText(todos);
      await todoPage.expectTodoCount('all', 3);
    });

    await test.step('completes and reopens Practice Locators while verifying checkbox counts', async () => {
      await todoPage.setCompleted('Practice Locators', true);
      await expect.soft(todoPage.checkboxFor('Practice Locators'), 'Practice Locators should be checked after completion').toBeChecked();
      await todoPage.expectTodoCount('checked', 1);
      await todoPage.expectTodoCount('unchecked', 2);
      await todoPage.expectTodoCount('all', 3);

      await todoPage.setCompleted('Practice Locators', false);
      await expect.soft(todoPage.checkboxFor('Practice Locators'), 'Practice Locators should be unchecked after reopening').not.toBeChecked();
      await todoPage.expectTodoCount('checked', 0);
      await todoPage.expectTodoCount('unchecked', 3);
      await todoPage.expectTodoCount('all', 3);
    });

    await test.step('filters todos by Active, Completed, and All', async () => {
      await todoPage.setCompleted('Practice Locators', true);

      await todoPage.filterBy('Active');
      await expect.soft(todoPage.todoTitles, 'Active should show only the two unfinished todos in order').toHaveText([
        'Learn Playwright',
        'Write Assertions',
      ]);
      await todoPage.expectTodoCount('all', 2);
      await todoPage.expectTodoCount('unchecked', 2);
      await todoPage.expectTodoCount('checked', 0);

      await todoPage.filterBy('Completed');
      await expect.soft(todoPage.todoTitles, 'Completed should show only Practice Locators').toHaveText(['Practice Locators']);
      await todoPage.expectTodoCount('all', 1);
      await todoPage.expectTodoCount('checked', 1);
      await todoPage.expectTodoCount('unchecked', 0);

      await todoPage.filterBy('All');
      await expect.soft(todoPage.todoTitles, 'All should restore all three todos in their original order').toHaveText(todos);
      await todoPage.expectTodoCount('all', 3);
    });

    await test.step('renames Learn Playwright by double-clicking and saving with Enter', async () => {
      await todoPage.editTodo('Learn Playwright', 'Learn Playwright Basics');

      await expect.soft(todoPage.todoTitles, 'The renamed todo should replace the original title and preserve the list order').toHaveText([
        'Learn Playwright Basics',
        'Practice Locators',
        'Write Assertions',
      ]);
      await expect.soft(
        todoPage.page.getByText('Learn Playwright', { exact: true }),
        'The original exact title should no longer exist after editing',
      ).toHaveCount(0);
    });

    await test.step('clears completed todos and keeps both unfinished todos', async () => {
      await todoPage.clearCompleted();

      await expect.soft(
        todoPage.page.getByText('Practice Locators', { exact: true }),
        'Clear completed should remove Practice Locators',
      ).toHaveCount(0);
      await expect.soft(todoPage.todoTitles, 'Both unfinished todos should remain in their original order').toHaveText([
        'Learn Playwright Basics',
        'Write Assertions',
      ]);
      await todoPage.expectTodoCount('all', 2);
      await todoPage.expectTodoCount('unchecked', 2);
      await todoPage.expectTodoCount('checked', 0);
      await expect.soft(todoPage.checkboxFor('Learn Playwright Basics'), 'Learn Playwright Basics should remain unfinished').not.toBeChecked();
      await expect.soft(todoPage.checkboxFor('Write Assertions'), 'Write Assertions should remain unfinished').not.toBeChecked();
    });

    await test.step('does not add a todo when only spaces are submitted', async () => {
      await todoPage.resetTodos();
      await todoPage.expectTodoCount('all', 0);
      await todoPage.addTodos(['   ']);

      await todoPage.expectTodoCount('all', 0);
    });
  });
});
