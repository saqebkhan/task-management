# task-management

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


**`task-management`** 
**`Task Management App`**
- This project is a Task Management application designed to help users organize and manage their tasks efficiently. It features a user-friendly interface and multiple features that enhance the task management experience. The app supports multiple task stages and offers powerful features like task editing, deletion, and drag-and-drop functionality.

- Key features of the application include:

- User Authentication:

- Login and Registration functionality for users, allowing them to securely access their personalized task dashboard.
Users can register for a new account or log in to an existing one using Firebase Authentication.
- Dashboard:

- Provides an overview of the user’s tasks with important statistics such as the total number of pending and completed tasks, as well as a percentage completion.

- Task Management Page:

- Users can view and manage their tasks across different stages of completion: Backlog, To-Do, In Progress, and Done.
Each task can be edited, deleted, and moved between stages.
Drag-and-drop functionality allows users to easily move tasks between columns representing different stages of the task lifecycle.
Elegant User Interface:

- The app features a clean and visually appealing design, ensuring that users can interact with it comfortably.
- The design is fully responsive, and Tailwind CSS is used to provide a modern look and feel with minimal effort.
### Reusable Components:

- Throughout the app, reusable components like modals, loading spinners, and toast notifications ensure consistent design and a smoother user experience.
- With these features, the Task Management App helps users stay organized, track their progress, and keep their tasks on schedule. Whether for personal use or team collaborations, this app is an excellent tool to manage tasks and monitor productivity.


### Tech Stack Used
 This project is built using the following technologies and libraries:



### Frontend
1. Vue 3: The latest version of Vue.js for building reactive user interfaces.

2. Composition API: Vue 3's Composition API is used for managing state and logic within components for better code organization and readability.

3. Vue CLI (Webpack): Used for project setup and bundling. We chose Webpack over Vite for now due to the need for more configuration control and compatibility with existing plugins. Although Vite is faster, Webpack offers broader community support and more flexibility for complex projects.

4. JavaScript: Chosen for its quick development time and small project size. While TypeScript provides more type safety, JavaScript is preferred here for a fast, agile development process, especially for smaller projects.

4. ESLint: Ensures code quality by detecting errors and maintaining a consistent coding style.

5. Prettier: Used for code formatting to maintain clean and consistent code style throughout the project.



### Backend
1. Node.js: Used to run the backend server, handling API requests and interactions with MongoDB.

2. MongoDB: The database used for storing application data. It's flexible and scalable, making it a perfect choice for this project.

3. Firebase Authentication: Provides authentication services, ensuring a secure and seamless user login and registration experience.

4. Vercel: Deployed the backend server on Vercel for easy deployment and scalability.



### UI and Styling
1. Tailwind CSS: A utility-first CSS framework used for styling the application. Tailwind allows for fast and responsive design development without writing custom CSS rules.

2. Headless Heroicons: A set of free, MIT-licensed high-quality icons, used throughout the project for a clean and modern UI.



### State Management and Routing
1. Pinia: The state management library used to store and manage the application state, replacing Vuex.

2. Vue Router: Manages routing and navigation within the Vue.js application, enabling single-page navigation and dynamic route handling.



### Utility Libraries
1. Axios: Used for making API calls to the backend, enabling communication between the frontend and backend services.



### Key Features
1. Reusable Components: The project uses a component-based architecture with reusable components (like loading spinners, toast messages, dialog modals, etc.) to ensure code reusability and maintainability.



2. Consistent Design: Throughout the project, a consistent design language is maintained, leveraging Tailwind CSS for styling and reusable components for UI consistency.

3. Dynamic and Consistent Route Names: Routes are named dynamically to avoid future naming conflicts and hardcoded values, ensuring better maintainability and scalability.



### Best Practices and Guidelines
1. Maintain Consistency: The code and design should follow a consistent structure across the entire application. This includes naming conventions, component structures, and design elements.

2. Avoid Unnecessary Console Logs: Console logs should be used for debugging purposes only and removed before committing code to avoid cluttering the console in production.

3. No Unnecessary Comments: Avoid leaving unnecessary comments in the code. Comments should be used sparingly and only when explaining complex or non-intuitive logic.

4. Use @ to Target the Root Directory for src: In import statements, use @ to target the src folder to simplify the directory structure and avoid relative path issues.

5. Dynamically Use Route Names: Always use RouteNames dynamically instead of hardcoding paths to ensure consistency and avoid name conflicts in the future.

6. Reusable Components and Utilities: Where possible, create reusable components and utilities (such as functions for data formatting, API calls, etc.) to reduce code duplication and improve maintainability.


