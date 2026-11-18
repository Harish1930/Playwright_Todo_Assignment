import { expect, type Locator, type Page } from '@playwright/test';

export class TodoPage {
  readonly body: Locator;
  readonly heading: Locator;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;

  constructor(readonly page: Page) {
    this.body = page.locator('body');
    this.heading = page.getByRole('heading', { name: 'todos', exact: true });
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
  }

  async goto(): Promise<void> {
    await this.page.goto('/todomvc/');
  }

  async resetTodos(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
    await this.goto();
    await this.newTodoInput.waitFor({ state: 'visible' });
  }

  async addTodos(titles: readonly string[]): Promise<void> {
    for (const title of titles) {
      await this.newTodoInput.fill(title);
      await this.newTodoInput.press('Enter');
    }
  }

  checkboxFor(title: string): Locator {
    return this.todoItems
      .filter({ has: this.page.getByText(title, { exact: true }) })
      .getByRole('checkbox');
  }

  async setCompleted(title: string, completed: boolean): Promise<void> {
    await this.checkboxFor(title).setChecked(completed);
  }

  async expectTodoCount(state: 'all' | 'checked' | 'unchecked', expected: number): Promise<void> {
    // Scope to todo rows so the "toggle all" checkbox is never counted.
    // Counts apply to the current list, including the selected filter.
    const checkboxes = state === 'all'
      ? this.todoItems.getByRole('checkbox')
      : this.todoItems.getByRole('checkbox', { checked: state === 'checked' });

    await expect.soft(checkboxes, `The current list should contain ${expected} ${state} todos`).toHaveCount(expected);
  }

  async filterBy(filter: 'Active' | 'Completed' | 'All'): Promise<void> {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }

  async editTodo(title: string, updatedTitle: string): Promise<void> {
    const item = this.todoItems.filter({ has: this.page.getByText(title, { exact: true }) });
    await item.getByTestId('todo-title').dblclick();
    const editInput = item.getByRole('textbox');
    await editInput.fill(updatedTitle);
    await editInput.press('Enter');
  }

  async clearCompleted(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear completed', exact: true }).click();
  }
}
