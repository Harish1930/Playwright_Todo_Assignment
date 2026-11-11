import { test, expect } from '../fixtures/todo.fixture';

const todos = ['Learn Playwright', 'Practice Locators', 'Write Assertions'];

test('opens TodoMVC with the todos heading and new-todo input visible', async ({ todoPage }) => {
  await expect(todoPage.page, 'The page title should contain TodoMVC').toHaveTitle(/TodoMVC/);
  await expect(todoPage.heading, 'The todos heading should be visible').toBeVisible();
  await expect(todoPage.newTodoInput, 'The new-todo input should be visible').toBeVisible();
});

test('adds three todos in the order entered', async ({ todoPage }) => {
  await todoPage.addTodos(todos);

  await expect(todoPage.todoTitles, 'All three todo titles should appear in insertion order').toHaveText(todos);
  await expect(todoPage.todoItems, 'The list should contain exactly three todos').toHaveCount(3);
});

test('completes and reopens Practice Locators while updating the remaining count', async ({ todoPage }) => {
  await todoPage.addTodos(todos);

  await todoPage.setCompleted('Practice Locators', true);
  await expect(todoPage.checkboxFor('Practice Locators'), 'Practice Locators should be checked after completion').toBeChecked();
  await expect(todoPage.remainingCounter, 'Completing one of three todos should leave two items').toHaveText('2 items left');

  await todoPage.setCompleted('Practice Locators', false);
  await expect(todoPage.checkboxFor('Practice Locators'), 'Practice Locators should be unchecked after reopening').not.toBeChecked();
  await expect(todoPage.remainingCounter, 'Reopening the todo should restore three remaining items').toHaveText('3 items left');
});

test('filters todos by Active, Completed, and All', async ({ todoPage }) => {
  await todoPage.addTodos(todos);
  await todoPage.setCompleted('Practice Locators', true);

  await todoPage.filterBy('Active');
  await expect(todoPage.todoTitles, 'Active should show only the two unfinished todos in order').toHaveText([
    'Learn Playwright',
    'Write Assertions',
  ]);
  await expect(todoPage.todoItems, 'Active should contain exactly two todos').toHaveCount(2);

  await todoPage.filterBy('Completed');
  await expect(todoPage.todoTitles, 'Completed should show only Practice Locators').toHaveText(['Practice Locators']);
  await expect(todoPage.todoItems, 'Completed should contain exactly one todo').toHaveCount(1);

  await todoPage.filterBy('All');
  await expect(todoPage.todoTitles, 'All should restore all three todos in their original order').toHaveText(todos);
  await expect(todoPage.todoItems, 'All should contain exactly three todos').toHaveCount(3);
});

test('renames Learn Playwright by double-clicking and saving with Enter', async ({ todoPage }) => {
  await todoPage.addTodos(todos);

  await todoPage.editTodo('Learn Playwright', 'Learn Playwright Basics');

  await expect(todoPage.todoTitles, 'The renamed todo should replace the original title and preserve the list order').toHaveText([
    'Learn Playwright Basics',
    'Practice Locators',
    'Write Assertions',
  ]);
  await expect(
    todoPage.page.getByText('Learn Playwright', { exact: true }),
    'The original exact title should no longer exist after editing',
  ).toHaveCount(0);
});

test('clears completed todos and keeps both unfinished todos', async ({ todoPage }) => {
  await todoPage.addTodos(todos);
  await todoPage.setCompleted('Practice Locators', true);

  await todoPage.clearCompleted();

  await expect(
    todoPage.page.getByText('Practice Locators', { exact: true }),
    'Clear completed should remove Practice Locators',
  ).toHaveCount(0);
  await expect(todoPage.todoTitles, 'Both unfinished todos should remain in their original order').toHaveText([
    'Learn Playwright',
    'Write Assertions',
  ]);
  await expect(todoPage.todoItems, 'Exactly two unfinished todos should remain').toHaveCount(2);
  await expect(todoPage.checkboxFor('Learn Playwright'), 'Learn Playwright should remain unfinished').not.toBeChecked();
  await expect(todoPage.checkboxFor('Write Assertions'), 'Write Assertions should remain unfinished').not.toBeChecked();
});

test('does not add a todo when only spaces are submitted', async ({ todoPage }) => {
  await todoPage.addTodos(['   ']);

  await expect(todoPage.todoItems, 'Submitting only spaces should leave the todo list empty').toHaveCount(0);
});
