import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task, TaskService } from '../services/task.service';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, TaskComponent, AddTaskComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css',
})
export class ColumnComponent {
  @Input() columnId!: string;
  @Input() title!: string;
  @Input() tasks: Task[] = [];
  @Output() tasksUpdated = new EventEmitter<void>();
  @Output() addColumnRequested = new EventEmitter<string>();

  isDragOver = false;
  dragOverIndex = -1;

  constructor(private taskService: TaskService) {}

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
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
    const taskId = parseInt(e.dataTransfer!.getData('text/plain'));
    const task = this.taskService.getTaskById(taskId);
    if (task && task.status !== this.columnId) {
      this.taskService.moveTask(taskId, this.columnId);
      this.tasksUpdated.emit();
    }
  }

  onDragOverAtIndex(e: DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = 'move';
    this.dragOverIndex = index;
    this.isDragOver = true;
  }

  onDropAtIndex(e: DragEvent, targetIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = false;
    this.dragOverIndex = -1;

    const taskId = parseInt(e.dataTransfer!.getData('text/plain'));
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
    return 'kanban-column' + (this.isDragOver ? ' drag-over' : '');
  }
  shouldShowAddButton() {
    return this.columnId === 'todo';
  }
  requestAddColumn() {
    this.addColumnRequested.emit(this.columnId);
  }
  trackTaskById(index: number, task: Task) {
    return task.id;
  }
}
