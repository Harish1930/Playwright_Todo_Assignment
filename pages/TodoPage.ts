import type { Locator, Page } from '@playwright/test';

export class TodoPage {
  readonly heading: Locator;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly remainingCounter: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'todos', exact: true });
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.remainingCounter = page.getByTestId('todo-count');
  }

  async goto(): Promise<void> {
    await this.page.goto('/todomvc/');
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
