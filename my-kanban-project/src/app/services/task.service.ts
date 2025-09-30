import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: string;
  createdAt: Date;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  order: number;
}

@Injectable({ providedIn: "root" })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private columnsSubject = new BehaviorSubject<Column[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  public columns$ = this.columnsSubject.asObservable();
  private nextTaskId = 1;
  private nextColumnId = 1;

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Load tasks
    const tasks = JSON.parse(localStorage.getItem("kanban-tasks") || "[]").map(
      (t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        order: t.order || 0,
      })
    );
    this.tasksSubject.next(tasks);
    this.nextTaskId = tasks.length
      ? Math.max(...tasks.map((t: Task) => t.id)) + 1
      : 1;

    // Load columns
    const columns = JSON.parse(
      localStorage.getItem("kanban-columns") || "null"
    ) || [
      { id: "todo", title: "To Do", tasks: [], order: 0 },
      { id: "inprogress", title: "In Progress", tasks: [], order: 1 },
      { id: "done", title: "Done", tasks: [], order: 2 },
    ];
    this.columnsSubject.next(columns);
    this.nextColumnId = columns.length
      ? Math.max(
          ...columns.map((c: Column) => parseInt(c.id.replace("col", "")) || 0)
        ) + 1
      : 1;
    this.saveColumns();
  }

  private saveTasks() {
    localStorage.setItem(
      "kanban-tasks",
      JSON.stringify(this.tasksSubject.value)
    );
  }
  private saveColumns() {
    localStorage.setItem(
      "kanban-columns",
      JSON.stringify(this.columnsSubject.value)
    );
  }

  getTasks() {
    return this.tasksSubject.value;
  }
  getColumns() {
    return this.columnsSubject.value;
  }

  getTasksByColumns(): Column[] {
    const tasks = this.getTasks();
    return this.getColumns()
      .map((col) => ({
        ...col,
        tasks: tasks
          .filter((t) => t.status === col.id)
          .sort((a, b) => a.order - b.order),
      }))
      .sort((a, b) => a.order - b.order);
  }

  addColumn(title: string, afterColumnId?: string) {
    const columns = this.getColumns();
    const newId = `col${this.nextColumnId++}`;
    let order = columns.length;

    if (afterColumnId) {
      const afterCol = columns.find((c) => c.id === afterColumnId);
      if (afterCol) {
        columns
          .filter((c) => c.order > afterCol.order)
          .forEach((c) => c.order++);
        order = afterCol.order + 1;
      }
    }

    this.columnsSubject.next(
      [...columns, { id: newId, title: title.trim(), tasks: [], order }].sort(
        (a, b) => a.order - b.order
      )
    );
    this.saveColumns();
  }

  addTask(
    title: string,
    description: string,
    priority: "Low" | "Medium" | "High",
    status = "todo"
  ) {
    const tasks = this.getTasks();
    const maxOrder = Math.max(
      ...tasks.filter((t) => t.status === status).map((t) => t.order),
      -1
    );
    const newTask: Task = {
      id: this.nextTaskId++,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      createdAt: new Date(),
      order: maxOrder + 1,
    };
    this.tasksSubject.next([...tasks, newTask]);
    this.saveTasks();
  }

  updateTask(taskId: number, updates: Partial<Task>) {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.tasksSubject.next([...tasks]);
      this.saveTasks();
    }
  }

  deleteTask(taskId: number) {
    this.tasksSubject.next(this.getTasks().filter((t) => t.id !== taskId));
    this.saveTasks();
  }

  moveTask(taskId: number, newStatus: string) {
    this.updateTask(taskId, { status: newStatus });
  }

  getTaskById(taskId: number) {
    return this.getTasks().find((t) => t.id === taskId);
  }

  reorderTasksInColumn(
    columnId: string,
    draggedTaskId: number,
    targetIndex: number
  ) {
    const tasks = this.getTasks();
    const columnTasks = tasks
      .filter((t) => t.status === columnId)
      .sort((a, b) => a.order - b.order);
    const draggedTask = columnTasks.find((t) => t.id === draggedTaskId);
    if (
      !draggedTask ||
      columnTasks.findIndex((t) => t.id === draggedTaskId) === targetIndex
    )
      return;

    const reordered = columnTasks.filter((t) => t.id !== draggedTaskId);
    reordered.splice(Math.min(targetIndex, reordered.length), 0, draggedTask);
    reordered.forEach((task, i) => (task.order = i));

    this.tasksSubject.next(
      tasks.map((t) =>
        t.status === columnId ? reordered.find((rt) => rt.id === t.id) || t : t
      )
    );
    this.saveTasks();
  }

  removeColumn(columnId: string): boolean {
    const columns = this.getColumns();

    // Don't remove if it's a default column or the last remaining column
    if (this.isDefaultColumn(columnId) || columns.length <= 1) {
      return false;
    }

    // Get the first available column as fallback for tasks
    const fallbackColumn = columns.find((c) => c.id !== columnId);
    if (!fallbackColumn) return false;

    // Move all tasks from this column to the fallback column
    const tasks = this.getTasks();
    const updatedTasks = tasks.map((task) =>
      task.status === columnId ? { ...task, status: fallbackColumn.id } : task
    );

    // Remove the column and update order of remaining columns
    const updatedColumns = columns
      .filter((c) => c.id !== columnId)
      .map((col, idx) => ({ ...col, order: idx }));

    // Update the state
    this.columnsSubject.next(updatedColumns);
    this.tasksSubject.next(updatedTasks);

    // Save changes
    this.saveColumns();
    this.saveTasks();

    return true;
  }

  isDefaultColumn(columnId: string): boolean {
    return ["todo", "inprogress", "done"].includes(columnId);
  }

  updateColumnTitle(columnId: string, newTitle: string) {
    const columns = this.getColumns();
    const columnIndex = columns.findIndex(c => c.id === columnId);
    if (columnIndex !== -1) {
      columns[columnIndex] = { ...columns[columnIndex], title: newTitle.trim() };
      this.columnsSubject.next([...columns]);
      this.saveColumns();
    }
  }

  reorderColumns(fromIndex: number, toIndex: number) {
    const columns = this.getColumns();
    if (fromIndex < 0 || fromIndex >= columns.length || toIndex < 0 || toIndex >= columns.length) {
      return;
    }

    // Remove the column from its current position
    const [movedColumn] = columns.splice(fromIndex, 1);
    
    // Insert it at the target position
    columns.splice(toIndex, 0, movedColumn);
    
    // Update order values
    columns.forEach((col, index) => {
      col.order = index;
    });

    this.columnsSubject.next([...columns]);
    this.saveColumns();
  }
}
