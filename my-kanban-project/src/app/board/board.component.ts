import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnComponent } from '../column/column.component';
import { TaskService, Column } from '../services/task.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit, OnDestroy {
  columns: Column[] = [];
  showAddColumn = false;
  newColumnTitle = '';
  selectedColumnId = '';
  private subscription = new Subscription();
  draggedColumnIndex = -1;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.subscription.add(
      combineLatest([
        this.taskService.tasks$,
        this.taskService.columns$,
      ]).subscribe(() => (this.columns = this.taskService.getTasksByColumns()))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addColumn() {
    if (this.newColumnTitle.trim()) {
      this.taskService.addColumn(this.newColumnTitle, this.selectedColumnId);
      this.showAddColumn = false;
      this.newColumnTitle = '';
      this.selectedColumnId = '';
    }
  }

  openAddColumnForm(columnId: string) {
    this.selectedColumnId = columnId;
    this.showAddColumn = true;
    this.newColumnTitle = '';
  }

  cancelAddColumn() {
    this.showAddColumn = false;
    this.newColumnTitle = '';
    this.selectedColumnId = '';
  }

  removeColumn(columnId: string) {
    const success = this.taskService.removeColumn(columnId);
    if (success) {
      this.columns = this.taskService.getTasksByColumns();
    }
  }

  onTasksUpdated() {
    this.columns = this.taskService.getTasksByColumns();
  }

  getTaskStatistics() {
    return {
      todo: this.columns.find((c) => c.id === 'todo')?.tasks.length || 0,
      inprogress:
        this.columns.find((c) => c.id === 'inprogress')?.tasks.length || 0,
      done: this.columns.find((c) => c.id === 'done')?.tasks.length || 0,
      total: this.columns.reduce((sum, col) => sum + col.tasks.length, 0),
    };
  }

  trackColumnById(index: number, column: Column) {
    return column.id;
  }

  updateColumnTitle(event: { columnId: string; newTitle: string }) {
    this.taskService.updateColumnTitle(event.columnId, event.newTitle);
    this.onTasksUpdated();
  }

  onColumnDragStart(event: { event: DragEvent; columnIndex: number }) {
    this.draggedColumnIndex = event.columnIndex;
  }

  onColumnDragOver(event: { event: DragEvent; columnIndex: number }) {
    event.event.preventDefault();
    event.event.dataTransfer!.dropEffect = 'move';
  }

  onColumnDrop(event: { event: DragEvent; columnIndex: number }) {
    event.event.preventDefault();
    const sourceIndex = parseInt(
      event.event.dataTransfer!.getData('application/x-column-index')
    );
    const targetIndex = event.columnIndex;

    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      this.taskService.reorderColumns(sourceIndex, targetIndex);
      this.onTasksUpdated();
    }

    this.draggedColumnIndex = -1;
  }
}
