# Kanban Task Manager - Project Structure

This document outlines the simplified project structure of the Kanban Task Manager application.

## Root Project Structure

```
my-kanban-project/
├── .angular/                  # Angular cache and temporary files
├── .vscode/                   # VS Code configuration
├── node_modules/              # Third-party dependencies
├── public/                    # Public assets
├── src/                       # Source code (main application)
├── .editorconfig              # Editor configuration
├── .gitignore                 # Git ignore rules
├── angular.json               # Angular project configuration
├── localStorage-documentation.md   # Documentation for localStorage implementation
├── localStorage-test.js       # Helper script for testing localStorage
├── package-lock.json          # NPM dependency lock file
├── package.json               # Project dependencies and scripts
├── README.md                  # Project overview
├── tsconfig.app.json          # TypeScript config for app
├── tsconfig.json              # Main TypeScript configuration
└── tsconfig.spec.json         # TypeScript config for tests
```

## Source Code Structure (`src/`)

```
src/
├── app/                       # Application components and services
│   ├── add-task/              # Add task component
│   │   ├── add-task.component.css
│   │   ├── add-task.component.html
│   │   ├── add-task.component.spec.ts
│   │   └── add-task.component.ts
│   ├── board/                 # Board component (main container)
│   │   ├── board.component.css
│   │   ├── board.component.html
│   │   ├── board.component.spec.ts
│   │   └── board.component.ts
│   ├── column/                # Column component
│   │   ├── column.component.css
│   │   ├── column.component.html
│   │   ├── column.component.spec.ts
│   │   └── column.component.ts
│   ├── header/                # Header component
│   │   ├── header.component.css
│   │   ├── header.component.html
│   │   ├── header.component.spec.ts
│   │   └── header.component.ts
│   ├── services/              # Application services
│   │   ├── task.service.spec.ts
│   │   └── task.service.ts    # Main service for task management
│   ├── task/                  # Task component
│   │   ├── task.component.css
│   │   ├── task.component.html
│   │   ├── task.component.spec.ts
│   │   └── task.component.ts
│   ├── app.component.css      # Root component styles
│   ├── app.component.html     # Root component template
│   ├── app.component.spec.ts  # Root component tests
│   ├── app.component.ts       # Root component
│   ├── app.config.ts          # App configuration
│   └── app.routes.ts          # Routing configuration
├── index.html                 # Main HTML file
├── main.ts                    # Application entry point
└── styles.css                 # Global styles
```

## Key Components

1. **Board Component**: Main container that displays all columns
2. **Column Component**: Represents a task status column (Todo, In Progress, Done)
3. **Task Component**: Individual task card with title, description, and actions
4. **Add Task Component**: Form for creating new tasks
5. **Header Component**: Application header with title and stats

## Key Service

**TaskService**: Central service that manages all task operations with:

1. Task state management using BehaviorSubject
2. localStorage persistence for tasks
3. CRUD operations for tasks
4. Column organization logic

## Simplified File Structure Improvements

The following improvements were made to simplify the project structure:

1. **Consolidated Documentation**: Combined multiple localStorage documentation files into a single comprehensive file (`localStorage-documentation.md`)

2. **Removed Duplicate Files**: Eliminated redundant test and documentation files to reduce confusion

3. **Service Organization**: Ensured the task service is properly organized in a single location

4. **Clean Import Paths**: Updated all components to use consistent import paths for the service

This structure provides a clean, organized codebase that follows Angular best practices while remaining easy to understand and maintain.
