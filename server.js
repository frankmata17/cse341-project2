const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const session = require('express-session');
const { Strategy: GitHubStrategy } = require('passport-github2');

dotenv.config();
const server = express();

// Connect to database
connectDB();

// Middleware
server.use(cors());
server.use(express.json());

// Session middleware
server.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
server.use(passport.initialize());
server.use(passport.session());

// Define GitHub Strategy inline
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Here, find or create your user based on the GitHub profile
      // For example:
      // let user = await User.findOne({ githubId: profile.id });
      // if (!user) {
      //   user = new User({ githubId: profile.id, username: profile.username, ... });
      //   await user.save();
      // }
      // return done(null, user);

      return done(null, profile); // Temporary placeholder
    } catch (error) {
      return done(error, null);
    }
  }
));

// For session-based serialization
passport.serializeUser((user, done) => {
  // In a real app, you’d typically serialize the user’s ID
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // And here you’d find the user by ID in the database
  done(null, obj);
});

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
        url: 'http://localhost:5001/',
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
  apis: ['./routes/**/*.js'],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

server.use('/', taskRoutes);
server.use('/', userRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});