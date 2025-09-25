# Video Tutorial Script: Task Reordering in Kanban Board

## Introduction (00:00 - 00:30)

Hello! In this tutorial, I'll demonstrate how to use the task reordering feature in our Kanban board application. This feature allows you to reorder tasks within a column using drag and drop functionality.

## Setup (00:30 - 01:30)

First, let's start the application:

1. Open PowerShell
2. Navigate to the project directory
3. Run the start-server.ps1 script with the command: `.\start-server.ps1`
4. Wait for the server to start - you'll see a message saying "Server will be available at: http://localhost:4201"
5. Open your web browser and navigate to that URL

## Creating Tasks (01:30 - 02:30)

Let's create a few tasks to demonstrate the reordering functionality:

1. Click the "+" button in the "To Do" column
2. Enter a title: "Research project requirements"
3. Add a description: "Gather all necessary information about the project scope"
4. Set a priority: "High"
5. Click "Add Task"

Let's add a few more tasks:

- "Create project timeline" (Medium priority)
- "Set up development environment" (High priority)
- "Schedule kickoff meeting" (Low priority)

## Basic Task Reordering (02:30 - 04:00)

Now that we have multiple tasks in our "To Do" column, let's reorder them:

1. Click and hold on the "Schedule kickoff meeting" task
2. Notice how it becomes semi-transparent when you start dragging
3. Drag it above "Research project requirements"
4. See how the drop zone between tasks highlights as you hover over it
5. Release the mouse button
6. The task is now at the top of the column

Let's try another example:

1. Grab the "Create project timeline" task
2. Drag it to the bottom of the column
3. Release to drop it
4. It's now the last task in the column

## Persistence Test (04:00 - 05:00)

Let's verify that our changes persist:

1. Refresh the browser page
2. Notice that the tasks remain in the order we arranged them
3. This is because the order is saved in localStorage

## Testing in Different Columns (05:00 - 06:30)

Let's move some tasks to other columns and test reordering there:

1. Drag "Research project requirements" to the "In Progress" column
2. Drag "Set up development environment" to the "In Progress" column
3. Now reorder these tasks within the "In Progress" column
4. Notice the same drag and drop functionality works here too

## Edge Cases (06:30 - 08:00)

Let's test some edge cases:

1. Try dragging a task to its own position - notice nothing changes
2. Drag a task to the top position of an empty column
3. Try dragging quickly between columns - the application handles this correctly

## Visual Indicators (08:00 - 09:00)

Notice the visual feedback during dragging:

1. The task being dragged becomes semi-transparent
2. Drop zones appear between tasks
3. The drop zone highlights when you drag over it
4. The transition is smooth when tasks reorder

## Simple Demo Alternative (09:00 - 09:30)

If you want to see a simpler demonstration of the drag-and-drop functionality:

1. Open the file simple-drag-drop-demo.html directly in your browser
2. This shows the core drag-and-drop mechanism without the full application

## Conclusion (09:30 - 10:00)

That concludes our tutorial on task reordering in the Kanban board. You can now:

- Reorder tasks within any column
- Enjoy smooth visual feedback during dragging
- Trust that your task order will persist between sessions

This feature makes organizing your workflow much more intuitive. Happy organizing!
