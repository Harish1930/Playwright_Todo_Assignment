import { test as base, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    // The built-in page fixture uses a new browser context for each test,
    // so TodoMVC local storage starts empty without relying on prior tests.
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },
});

export { expect };
