import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from '../services/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskUpdated = new EventEmitter<Task>();

  // Edit mode state
  isEditing = false;
  editTitle = '';
  editDescription = '';
  editPriority: 'Low' | 'Medium' | 'High' = 'Low';

  constructor(private taskService: TaskService) {}

  // Start editing mode
  startEdit(): void {
    this.isEditing = true;
    this.editTitle = this.task.title;
    this.editDescription = this.task.description;
    this.editPriority = this.task.priority;
  }

  // Save changes
  saveEdit(): void {
    if (this.editTitle.trim()) {
      const updates = {
        title: this.editTitle.trim(),
        description: this.editDescription.trim(),
        priority: this.editPriority,
      };

      this.taskService.updateTask(this.task.id, updates);
      this.taskUpdated.emit({ ...this.task, ...updates });
      this.isEditing = false;
    }
  }

  // Cancel editing
  cancelEdit(): void {
    this.isEditing = false;
    this.editTitle = this.task.title;
    this.editDescription = this.task.description;
    this.editPriority = this.task.priority;
  }

  // Delete task
  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id);
      this.taskDeleted.emit(this.task.id);
    }
  }

  // Get priority color class
  getPriorityClass(): string {
    switch (this.task.priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-low';
    }
  }

  // Handle drag start
  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      // Prevent event from bubbling up to column
      event.stopPropagation();

      // Set the data - this must be done first and is most important
      event.dataTransfer.setData('text/plain', this.task.id.toString());
      event.dataTransfer.effectAllowed = 'move';

      // Add visual feedback
      const element = event.currentTarget as HTMLElement;
      element.classList.add('dragging');

      // Handle drag end to remove visual effects
      const handleDragEnd = () => {
        element.classList.remove('dragging');
        window.removeEventListener('dragend', handleDragEnd);
      };

      window.addEventListener('dragend', handleDragEnd);
    }
  }
}
