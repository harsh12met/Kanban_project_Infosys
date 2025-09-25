# Troubleshooting Guide: Task Reordering in Kanban Board

This guide addresses common issues that might occur with the drag and drop task reordering functionality in our Kanban board application.

## Common Issues and Solutions

### Issue: Drag and Drop Not Working At All

**Symptoms:**

- Nothing happens when you try to drag a task
- No visual feedback when dragging
- Tasks won't drop in new positions

**Possible Solutions:**

1. **Check Browser Compatibility**

   - Ensure you're using a modern browser (Chrome, Firefox, Edge, or Safari)
   - HTML5 Drag and Drop API is supported in all modern browsers

2. **Clear Browser Cache**

   ```
   In Chrome: Ctrl+Shift+Delete > Select "Cached images and files" > Clear data
   In Firefox: Ctrl+Shift+Delete > Select "Cache" > Clear
   ```

3. **Inspect Browser Console for Errors**

   - Open browser dev tools (F12)
   - Check the console tab for any JavaScript errors
   - Look for errors related to drag events or task reordering

4. **Try the Simple Demo**
   - Open `simple-drag-drop-demo.html` directly in your browser
   - If this works but the main app doesn't, it's likely an application-specific issue

### Issue: Tasks Move Between Columns But Won't Reorder Within Column

**Symptoms:**

- Can drag tasks between columns
- Cannot reorder tasks in the same column

**Possible Solutions:**

1. **Verify Task Service Implementation**

   - Check that the `reorderTasksInColumn` method in `task.service.ts` is correctly implemented
   - Ensure the method is being called when dropping tasks

2. **Check Event Handling**

   - Verify that `onDropAtIndex` in `column.component.ts` is being triggered
   - Add console logs to troubleshoot: `console.log('Drop at index:', targetIndex);`

3. **Inspect localStorage**

   - Check if task order is being saved correctly:

   ```javascript
   // Run in browser console
   console.log(JSON.parse(localStorage.getItem("kanban-tasks")));
   ```

4. **Try Clearing localStorage**
   - This will reset all tasks but can fix corrupted data:
   ```javascript
   // Run in browser console
   localStorage.removeItem("kanban-tasks");
   // Then refresh the page
   ```

### Issue: Visual Feedback Missing During Drag

**Symptoms:**

- Tasks can be dragged but there's no visual indication
- Hard to tell where tasks will be dropped

**Possible Solutions:**

1. **Check CSS Implementation**

   - Verify that the `.dragging` class in `task.component.css` is properly styled
   - Check that `.drop-zone` and `.active-drop-zone` in `column.component.css` are styled correctly

2. **Check Task Component**

   - Ensure the `onDragStart` method in `task.component.ts` adds the `dragging` class
   - Verify the drag end event handler removes the class

3. **Inspect Column Component**
   - Confirm that `dragOverIndex` is being set correctly in `onDragOverAtIndex`
   - Check that the template correctly applies the `.active-drop-zone` class

### Issue: Tasks Jump to Incorrect Positions

**Symptoms:**

- Tasks move to unexpected positions when reordering
- Order seems inconsistent after drag operations

**Possible Solutions:**

1. **Check Order Calculation**

   - Verify that the `reorderTasksInColumn` method correctly recalculates task orders
   - Ensure tasks are being sorted by order in `getTasksByColumns`

2. **Check Index Calculation**

   - Make sure the drop target index is calculated correctly in `onDropAtIndex`
   - Add debugging logs to track the index values during drag operations

3. **Inspect Task Array**

   - Log the tasks array before and after reordering to spot any inconsistencies

   ```typescript
   console.log("Before reordering:", JSON.stringify(columnTasks));
   // After reordering
   console.log("After reordering:", JSON.stringify(reorderedTasks));
   ```

4. **Reset All Task Orders**

   - If the order values are corrupted, you can run this in the console:

   ```javascript
   // Get all tasks
   const tasks = JSON.parse(localStorage.getItem("kanban-tasks"));

   // Group by status
   const todoTasks = tasks.filter((t) => t.status === "todo");
   const inProgressTasks = tasks.filter((t) => t.status === "inprogress");
   const doneTasks = tasks.filter((t) => t.status === "done");

   // Reset order values
   todoTasks.forEach((t, i) => (t.order = i));
   inProgressTasks.forEach((t, i) => (t.order = i));
   doneTasks.forEach((t, i) => (t.order = i));

   // Save back
   localStorage.setItem(
     "kanban-tasks",
     JSON.stringify([...todoTasks, ...inProgressTasks, ...doneTasks])
   );

   // Refresh page
   location.reload();
   ```

### Issue: Task Flicker During Drag Operations

**Symptoms:**

- Tasks flicker or jump around when dragging
- Visual glitches during drag operations

**Possible Solutions:**

1. **Check Event Handling**

   - Make sure you're preventing default behavior in drag events
   - Check that `event.preventDefault()` and `event.stopPropagation()` are called

2. **Check CSS Transitions**

   - If transitions are causing issues, try temporarily disabling them:

   ```css
   .task-card {
     transition: none !important;
   }
   ```

3. **Simplify Drop Zones**
   - Adjust the size/padding of drop zones to make them easier to target
   - Make sure drop zones don't overlap or conflict

### Issue: Task Order Not Persisting After Page Refresh

**Symptoms:**

- Tasks reordering works but reverts after page reload
- Task order is inconsistent between sessions

**Possible Solutions:**

1. **Check localStorage Saving**

   - Verify that `saveTasksToStorage` is being called after reordering
   - Inspect localStorage content to see if order values are saved

2. **Check Order Initialization**

   - Ensure order property is properly initialized when loading tasks
   - Check that default order is assigned to tasks that don't have one

3. **Clear Browser Cache**
   - Sometimes localStorage can get into an inconsistent state
   - Try clearing browser storage for the site

## Advanced Troubleshooting

If the issues persist after trying the solutions above, you can try these more advanced steps:

1. **Fully Reset the Application**

   ```javascript
   // Run in browser console to completely reset the app state
   localStorage.clear();
   location.reload();
   ```

2. **Manually Add Test Tasks**

   ```javascript
   // Run in browser console to add test tasks with explicit order
   const testTasks = [
     {
       id: 1,
       title: "Test Task 1",
       description: "Description 1",
       priority: "High",
       status: "todo",
       createdAt: new Date().toISOString(),
       order: 0,
     },
     {
       id: 2,
       title: "Test Task 2",
       description: "Description 2",
       priority: "Medium",
       status: "todo",
       createdAt: new Date().toISOString(),
       order: 1,
     },
     {
       id: 3,
       title: "Test Task 3",
       description: "Description 3",
       priority: "Low",
       status: "todo",
       createdAt: new Date().toISOString(),
       order: 2,
     },
   ];

   localStorage.setItem("kanban-tasks", JSON.stringify(testTasks));
   location.reload();
   ```

3. **Check for Browser Extensions**

   - Some extensions might interfere with drag and drop functionality
   - Try disabling extensions or testing in incognito mode

4. **Check for Event Conflicts**
   - Make sure no other event handlers are conflicting with the drag events
   - Look for multiple event listeners that might be canceling each other out

## If All Else Fails

If none of the above solutions work:

1. View the `simple-drag-drop-demo.html` file to understand the core drag and drop implementation
2. Consider refreshing your application by running the start-server.ps1 script again
3. Check the browser's compatibility with HTML5 Drag and Drop API
4. Consider updating your browser to the latest version

For any persistent issues, refer to the official Angular documentation on event handling and component interaction.
