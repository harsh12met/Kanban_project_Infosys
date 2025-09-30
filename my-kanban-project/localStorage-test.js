// Paste this code in your browser console to test localStorage functionality

// Function to check localStorage
function checkLocalStorage() {
  console.log('------------- LOCALSTORAGE TEST -------------');
  
  // Check if localStorage exists
  if (typeof(Storage) === "undefined") {
    console.error('❌ localStorage is NOT supported by your browser');
    return;
  }
  
  console.log('✅ localStorage is supported by your browser');
  
  // Check if kanban-tasks exists
  const tasksData = localStorage.getItem('kanban-tasks');
  if (!tasksData) {
    console.log('ℹ️ No kanban tasks found in localStorage');
    return;
  }
  
  try {
    // Parse the tasks
    const tasks = JSON.parse(tasksData);
    console.log(`✅ Found ${tasks.length} tasks in localStorage:`);
    console.table(tasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      created: new Date(t.createdAt).toLocaleString()
    })));
  } catch (e) {
    console.error('❌ Error parsing localStorage data:', e);
  }
}

// Function to clear localStorage
function clearLocalStorage() {
  localStorage.removeItem('kanban-tasks');
  console.log('🧹 localStorage cleared');
  console.log('🔄 Refresh the page to see empty board');
}

// Function to add a test task directly to localStorage
function addTestTask() {
  const tasksData = localStorage.getItem('kanban-tasks');
  let tasks = [];
  
  if (tasksData) {
    tasks = JSON.parse(tasksData);
  }
  
  const newTask = {
    id: Date.now(),
    title: 'Test Task ' + Math.floor(Math.random() * 100),
    description: 'This task was created via console',
    priority: 'Medium',
    status: 'todo',
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  console.log('✅ Test task added to localStorage');
  console.log('🔄 Refresh the page to see the task');
}

// Print available commands
console.log('Available commands:');
console.log('checkLocalStorage() - Check what tasks are in localStorage');
console.log('clearLocalStorage() - Clear all tasks from localStorage');
console.log('addTestTask() - Add a test task to localStorage');

// Run initial check
checkLocalStorage();