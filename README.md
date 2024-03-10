# OpeninApp Assignment

This repository contains the implementation of APIs and cron jobs for the OpeninApp project as part of the assignment. Below is the guide to understand the project structure and functionalities.
## Technologies Used:
- JavaScript
- Node.js
- Twilio
- MongoDB


## Getting Started


**1. Clone the repository to your local machine:**

   ```bash
   git clone https://github.com/pankaj1251/OpeninApp-Assignment.git
```
**2. Navigate to the project directory:**

    cd openinapp-assignment

**3. Install dependencies:**

    npm install
    

**4. Set up environment variables:**

    - Create a `.env` file in the root directory.
    
- Define the following environment variables in the `.env` file:
  ```
  PORT=<port_number>
  MONGODB_URI=<mongodb_connection_string>
  JWT_SECRET=<jwt_secret_key>
  ```

**5. Run the application:**
    
    npm start

**6. The server will start running at the specified port, and you can access the APIs using tools like Postman.**



## API Endpoints

- **POST /api/user/register**: Create a new user with phone number and priority.
- **GET /api/user/:id**: Get user details by ID.
- **POST /api/task/create**: Create a new task with title, description, and due date.
- **POST /api/sub-task/create**: Create a subtask for a given task ID.
- **GET /api/task**: Get all user tasks with filtering options.
- **GET /api/sub-task**: Get all user subtasks with filtering options.
- **PUT /api/task/:id**: Update task details such as due date and status.
- **PUT /api/sub-task/:id**: Update subtask status.
- **DELETE /api/task/:id**: Soft delete a task.
- **DELETE /api/sub-task/:id**: Soft delete a subtask.

## Cron Jobs

- **Priority Cron Job**: Updates task priorities based on due dates.
- **Call Due Cron Job**: Initiates voice calls using Twilio for overdue tasks, prioritized by user priority.

## Error Handling

The application handles errors gracefully with user-friendly error messages and proper HTTP status codes.


