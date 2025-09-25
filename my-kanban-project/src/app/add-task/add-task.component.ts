import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  @Input() columnStatus = 'todo';
  @Output() taskAdded = new EventEmitter<void>();

  isFormVisible = false;
  taskTitle = '';
  taskDescription = '';
  taskPriority: 'Low' | 'Medium' | 'High' = 'Medium';

  constructor(private taskService: TaskService) {}

  showForm() {
    this.isFormVisible = true;
    setTimeout(
      () =>
        (
          document.querySelector('.add-task-title') as HTMLInputElement
        )?.focus(),
      0
    );
  }

  hideForm() {
    this.isFormVisible = false;
    this.taskTitle = '';
    this.taskDescription = '';
    this.taskPriority = 'Medium';
  }

  submitTask() {
    if (this.taskTitle.trim()) {
      this.taskService.addTask(
        this.taskTitle.trim(),
        this.taskDescription.trim(),
        this.taskPriority,
        this.columnStatus
      );
      this.taskAdded.emit();
      this.hideForm();
    }
  }

  onFormSubmit() {
    this.submitTask();
  }
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.hideForm();
  }
}
