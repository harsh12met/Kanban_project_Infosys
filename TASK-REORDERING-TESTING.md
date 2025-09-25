# Task Reordering Feature - Testing Instructions

## Overview

This document provides step-by-step instructions for testing the task reordering feature within the same column using drag and drop functionality in our Kanban board application.

## Testing Environment

- **Application URL:** http://localhost:4201
- **Server Script:** `start-server.ps1`

## Prerequisites

1. Ensure you have Node.js and Angular CLI installed on your system
2. The project has been downloaded to your local machine

## Starting the Application

1. Open PowerShell
2. Navigate to the project directory
3. Run the provided `start-server.ps1` script:
   ```
   .\start-server.ps1
   ```
4. Wait for the message "Server will be available at: http://localhost:4201"
5. Open your web browser and navigate to http://localhost:4201

## Testing Task Reordering

### Step 1: Add Multiple Tasks

1. When the application loads, you'll see the Kanban board with three columns: "To Do", "In Progress", and "Done"
2. In the "To Do" column, use the + button to create at least 3-4 tasks with different titles, descriptions, and priorities
3. This will give you multiple tasks to reorder

### Step 2: Test Same-Column Reordering

1. Click and hold on a task in the "To Do" column
2. Drag the task up or down within the same column
3. Notice that drop zones appear between tasks, showing where you can place the task
4. Release the mouse button when the drop zone is highlighted
5. The task should move to the new position

### Step 3: Verify Order Persistence

1. After reordering tasks, refresh the page
2. Verify that the new task order persists (it's saved in localStorage)
3. The tasks should remain in the order you arranged them

### Step 4: Test in Other Columns

1. Move some tasks to the "In Progress" column by dragging them there
2. Test reordering tasks within the "In Progress" column
3. Move some tasks to the "Done" column
4. Test reordering tasks within the "Done" column

### Step 5: Test Edge Cases

1. Try dragging a task to the top position
2. Try dragging a task to the bottom position
3. Try dropping a task at its original position (no change should occur)

## Troubleshooting

If you encounter any issues:

1. Ensure the server is running correctly on port 4201
2. Try opening the simple demonstration page at `simple-drag-drop-demo.html` to verify your browser supports drag and drop
3. Clear your browser cache and reload the page
4. Check browser console for any JavaScript errors

## Visual Cues

While testing, you should notice:

1. The task being dragged has a visual indication (opacity change)
2. Drop zones appear between tasks when dragging
3. Drop zones highlight when you drag over them
4. Tasks smoothly animate to their new positions

## Expected Behavior

- Tasks should maintain their order within columns after reordering
- The order should persist after page refresh
- All existing features (task editing, deletion, moving between columns) should continue to work
- Visual feedback should be provided during drag operations

## Simple Demo

For a simpler demonstration of the drag and drop reordering functionality, you can open the `simple-drag-drop-demo.html` file directly in your browser.
