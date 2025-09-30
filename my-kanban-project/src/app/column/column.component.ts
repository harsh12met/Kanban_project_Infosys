import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TaskComponent } from "../task/task.component";
import { AddTaskComponent } from "../add-task/add-task.component";
import { Task, TaskService } from "../services/task.service";

@Component({
  selector: "app-column",
  standalone: true,
  imports: [CommonModule, FormsModule, TaskComponent, AddTaskComponent],
  templateUrl: "./column.component.html",
  styleUrl: "./column.component.css",
})
export class ColumnComponent {
  @Input() columnId!: string;
  @Input() title!: string;
  @Input() tasks: Task[] = [];
  @Input() columnIndex!: number;
  @Output() tasksUpdated = new EventEmitter<void>();
  @Output() addColumnRequested = new EventEmitter<string>();
  @Output() removeColumnRequested = new EventEmitter<string>();
  @Output() columnTitleUpdated = new EventEmitter<{columnId: string, newTitle: string}>();
  @Output() columnDragStart = new EventEmitter<{event: DragEvent, columnIndex: number}>();
  @Output() columnDragOver = new EventEmitter<{event: DragEvent, columnIndex: number}>();
  @Output() columnDrop = new EventEmitter<{event: DragEvent, columnIndex: number}>();
  @ViewChild('titleInput') titleInput!: ElementRef;

  isDragOver = false;
  dragOverIndex = -1;
  isEditingTitle = false;
  editTitleValue = '';
  isColumnDragOver = false;

  constructor(private taskService: TaskService) {}

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
    this.isDragOver = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
    this.dragOverIndex = -1;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
    this.dragOverIndex = -1;
    const taskId = parseInt(e.dataTransfer!.getData("text/plain"));
    const task = this.taskService.getTaskById(taskId);
    if (task && task.status !== this.columnId) {
      this.taskService.moveTask(taskId, this.columnId);
      this.tasksUpdated.emit();
    }
  }

  onDragOverAtIndex(e: DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = "move";
    this.dragOverIndex = index;
    this.isDragOver = true;
  }

  onDropAtIndex(e: DragEvent, targetIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = false;
    this.dragOverIndex = -1;

    const taskId = parseInt(e.dataTransfer!.getData("text/plain"));
    if (isNaN(taskId)) return;
    const task = this.taskService.getTaskById(taskId);
    if (!task) return;

    if (task.status === this.columnId) {
      const currentIndex = this.tasks.findIndex((t) => t.id === taskId);
      if (currentIndex !== targetIndex && currentIndex + 1 !== targetIndex) {
        this.taskService.reorderTasksInColumn(
          this.columnId,
          taskId,
          targetIndex
        );
        this.tasksUpdated.emit();
      }
    } else {
      this.taskService.moveTask(taskId, this.columnId);
      this.tasksUpdated.emit();
    }
  }

  onTaskAdded() {
    this.tasksUpdated.emit();
  }
  onTaskUpdated() {
    this.tasksUpdated.emit();
  }
  onTaskDeleted() {
    this.tasksUpdated.emit();
  }
  getColumnClass() {
    let classes = "kanban-column";
    if (this.isDragOver) classes += " drag-over";
    if (this.isColumnDragOver) classes += " column-drag-over";
    return classes;
  }
  shouldShowAddButton() {
    return true; // Show add button for all columns
  }
  requestAddColumn() {
    this.addColumnRequested.emit(this.columnId);
  }

  requestRemoveColumn() {
    if (this.canRemoveColumn()) {
      const confirmDelete = confirm(
        `Are you sure you want to delete the "${this.title}" column? All tasks will be moved to another column.`
      );
      if (confirmDelete) {
        this.removeColumnRequested.emit(this.columnId);
      }
    }
  }

  canRemoveColumn(): boolean {
    return !this.isDefaultColumn();
  }

  isDefaultColumn(): boolean {
    return ["todo", "inprogress", "done"].includes(this.columnId);
  }

  trackTaskById(index: number, task: Task) {
    return task.id;
  }

  startEditTitle() {
    this.isEditingTitle = true;
    this.editTitleValue = this.title;
    // Focus the input after view update
    setTimeout(() => {
      if (this.titleInput) {
        this.titleInput.nativeElement.focus();
        this.titleInput.nativeElement.select();
      }
    });
  }

  saveTitle() {
    if (this.editTitleValue.trim() && this.editTitleValue.trim() !== this.title) {
      this.columnTitleUpdated.emit({
        columnId: this.columnId,
        newTitle: this.editTitleValue.trim()
      });
    }
    this.cancelEditTitle();
  }

  cancelEditTitle() {
    this.isEditingTitle = false;
    this.editTitleValue = '';
  }

  // Column drag and drop methods
  onColumnDragStart(e: DragEvent) {
    e.stopPropagation();
    this.columnDragStart.emit({event: e, columnIndex: this.columnIndex});
  }

  onColumnDragOver(e: DragEvent) {
    // Only handle column drops, not task drops
    const data = e.dataTransfer?.getData('text/plain');
    if (data && !isNaN(parseInt(data)) && parseInt(data) < 100) { // Column indices are small numbers
      e.preventDefault();
      e.stopPropagation();
      this.isColumnDragOver = true;
      this.columnDragOver.emit({event: e, columnIndex: this.columnIndex});
    }
  }

  onColumnDragLeave(e: DragEvent) {
    e.stopPropagation();
    this.isColumnDragOver = false;
  }

  onColumnDrop(e: DragEvent) {
    const data = e.dataTransfer?.getData('text/plain');
    if (data && !isNaN(parseInt(data)) && parseInt(data) < 100) { // Column indices are small numbers
      e.preventDefault();
      e.stopPropagation();
      this.isColumnDragOver = false;
      this.columnDrop.emit({event: e, columnIndex: this.columnIndex});
    }
  }

  // Task drag and drop methods (renamed to avoid conflicts)
  onTaskDragOver(e: DragEvent) {
    const data = e.dataTransfer?.getData('text/plain');
    if (data && !isNaN(parseInt(data)) && parseInt(data) > 100) { // Task IDs are larger numbers
      e.preventDefault();
      e.dataTransfer!.dropEffect = "move";
      this.isDragOver = true;
    }
  }

  onTaskDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
    this.dragOverIndex = -1;
  }

  onTaskDrop(e: DragEvent) {
    const data = e.dataTransfer?.getData('text/plain');
    if (data && !isNaN(parseInt(data)) && parseInt(data) > 100) { // Task IDs are larger numbers
      e.preventDefault();
      this.isDragOver = false;
      this.dragOverIndex = -1;
      const taskId = parseInt(data);
      const task = this.taskService.getTaskById(taskId);
      if (task && task.status !== this.columnId) {
        this.taskService.moveTask(taskId, this.columnId);
        this.tasksUpdated.emit();
      }
    }
  }
}
