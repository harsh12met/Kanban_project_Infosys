# Adding New Columns Feature Documentation

## Overview

This document explains how to use the new feature that allows you to add custom columns to your Kanban board. Each column will have a "+" button in the upper right corner that lets you add a new column immediately after it.

## Features

1. **Add New Columns**: Create additional columns beyond the default "To Do," "In Progress," and "Done" columns
2. **Custom Naming**: Give your new columns descriptive names like "Testing," "Blocked," "Code Review," etc.
3. **Proper Positioning**: New columns are added after the column you click on, preserving your intended workflow
4. **Full Functionality**: All new columns support drag and drop task reordering, just like the default columns
5. **Persistent Storage**: Custom columns are saved to localStorage and will persist between sessions

## How to Add a New Column

1. Look for the "+" button in the top-right corner of any column header
2. Click the "+" button on the column after which you want to add a new column
3. A modal dialog will appear asking for the column name
4. Enter a descriptive name for your new column (e.g., "Testing," "Blocked," etc.)
5. Click "Add Column" to create the new column

## Use Cases

### Development Workflow Enhancement

Add columns for specific stages in your development process:

- "Code Review"
- "QA Testing"
- "User Acceptance"
- "Ready for Deployment"

### Project Management

Add columns for different project phases:

- "Planning"
- "Research"
- "Implementation"
- "Evaluation"

### Personal Task Management

Add columns for different priority levels:

- "Today"
- "This Week"
- "Next Week"
- "Someday"

## Best Practices

1. **Use Clear Names**: Give columns descriptive names that clearly indicate their purpose
2. **Maintain Flow**: Arrange columns in a logical sequence from left to right
3. **Limit Column Count**: While you can add many columns, consider limiting to 5-7 for better visibility
4. **Consider Screen Size**: On smaller screens, having too many columns can make each one too narrow

## Technical Details

- Column data is stored in localStorage under the key `kanban-columns`
- Each column has a unique ID, title, order value, and tasks array
- Tasks maintain their relationship to columns via the `status` property, which matches the column's ID
- Order values ensure columns appear in the correct sequence

## Troubleshooting

If you encounter any issues with the column feature:

1. **Columns Not Saving**: Try clearing your browser cache and localStorage
2. **Add Column Dialog Not Appearing**: Refresh the page and try again
3. **Tasks Not Appearing in New Columns**: Ensure you've moved tasks to the new column by dragging them there
4. **Visual Glitches**: If columns don't appear correctly, try refreshing the page

## Feedback and Support

We welcome your feedback on this new feature. If you encounter any issues or have suggestions for improvements, please contact the development team.
