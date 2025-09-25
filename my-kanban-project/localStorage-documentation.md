# Kanban Task Manager: localStorage Implementation

## Overview

This document explains how our Kanban Task Manager uses localStorage to persistently store tasks in the user's browser, allowing tasks to remain even when the browser is closed and reopened.

## What is localStorage?

- A built-in browser feature that lets web applications store data directly in the user's browser
- Data is saved as key-value pairs (both must be strings)
- Each website has its own separate localStorage (data is not shared between sites)
- Provides approximately 5MB of storage per domain

## Implementation in Our App

### Core Functionality

In our `TaskService` class:

1. We define a consistent key for storage: `private readonly STORAGE_KEY = 'kanban-tasks'`
2. Tasks are loaded from localStorage when the app starts
3. Tasks are saved to localStorage whenever they change (add, update, delete, move)

### Key Methods

#### Saving Tasks to localStorage

```typescript
private saveTasksToStorage(): void {
  const currentTasks = this.tasksSubject.value;
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentTasks));
}
```

#### Loading Tasks from localStorage

```typescript
private loadTasksFromStorage(): void {
  const storedTasks = localStorage.getItem(this.STORAGE_KEY);

  if (storedTasks) {
    // Parse JSON and fix date objects
    const parsedTasks: Task[] = JSON.parse(storedTasks);
    const tasksWithDates = parsedTasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));

    // Update tasks list
    this.tasksSubject.next(tasksWithDates);

    // Set next ID
    this.nextId = tasksWithDates.length > 0
      ? Math.max(...tasksWithDates.map(t => t.id)) + 1
      : 1;
  } else {
    // No saved tasks, start empty
    this.tasksSubject.next([]);
    this.nextId = 1;
  }
}
```

### When Tasks Are Saved

Tasks are saved to localStorage in the following scenarios:

1. When a new task is added (`addTask()` method)
2. When a task is updated (`updateTask()` method)
3. When a task is deleted (`deleteTask()` method)
4. When a task is moved between columns (`moveTask()` method)

## Data Flow

1. **When app starts:**

   - App checks localStorage for saved tasks
   - If found, loads tasks and updates the UI
   - If not found, starts with an empty board

2. **During user interactions:**
   - User actions trigger service methods
   - Service updates BehaviorSubject with new task state
   - Service saves updated tasks to localStorage
   - Components react to BehaviorSubject changes and update UI

## Testing localStorage Functionality

### Manual Browser Testing

1. Open your browser's Developer Tools (F12)
2. Go to the "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Select "Local Storage" in the sidebar
4. Find your app's domain
5. Look for the `kanban-tasks` key
6. View the JSON data of all saved tasks

### Console Test Functions

We've included helper functions in `localStorage-test.js` that you can run in the browser console:

- `checkLocalStorage()` - View all tasks currently in localStorage
- `clearLocalStorage()` - Delete all tasks from localStorage
- `addTestTask()` - Add a test task directly to localStorage

### Testing Scenarios

1. **Persistence Test**

   - Add, edit, or delete tasks
   - Refresh the page
   - Verify that changes persist after refresh

2. **CRUD Operations Test**
   - Create: Add a new task and refresh
   - Read: Verify tasks load on page refresh
   - Update: Edit a task, refresh, and verify changes remain
   - Delete: Remove a task, refresh, and verify it stays deleted

## Key Benefits of Our Approach

1. **Persistence**: Tasks remain saved between browser sessions
2. **No Backend Required**: Fully functional without server-side code
3. **Performance**: Instant operations without network delays
4. **Offline Capability**: App works without internet connection
5. **User Privacy**: Data stays on the user's device

## Limitations

1. **Storage Capacity**: Limited to approximately 5MB per domain
2. **Local Only**: Data doesn't sync between devices
3. **User Control**: Users can clear browser data and erase tasks

## Code Architecture

The localStorage functionality is seamlessly integrated with our reactive patterns:

1. BehaviorSubject provides real-time UI updates
2. localStorage provides data persistence
3. Components remain decoupled from storage implementation
4. TypeScript interfaces ensure data integrity

This approach creates a responsive, persistent task manager without requiring a backend server.
