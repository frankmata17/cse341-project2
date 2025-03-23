const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const server = express();

// Connect to database
connectDB();

// Middleware
server.use(cors());
server.use(express.json());

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API for managing tasks and users',
    },
    servers: [
      {
        url: 'http://localhost:5001/api',  // Update this if needed for deployment
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the task',
            },
            description: {
              type: 'string',
              description: 'A detailed description of the task',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'The due date of the task',
            },
            status: {
              type: 'string',
              description: 'The current status of the task',
              enum: ['pending', 'in-progress', 'completed'],
            },
            priority: {
              type: 'string',
              description: 'The priority of the task',
              enum: ['low', 'medium', 'high'],
            },
          },
          required: ['title', 'description', 'dueDate'],
        },
      },
    },
  },
  apis: ['./routes/**/*.js'],  // Path to your route files for Swagger documentation
};

// Initialize Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
server.use('/api/tasks', taskRoutes);  // Ensure '/api/tasks' is correctly mapped to taskRoutes
server.use('/api', userRoutes);  // Ensure '/api' is mapped to userRoutes

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
