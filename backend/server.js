const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);

// OpenAPI spec for Swagger UI
app.get('/api/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.3',
    info: {
      title: 'API Testing Dashboard',
      description: 'Simplified Postman alternative for sending HTTP requests and viewing responses.',
      version: '1.0.0',
    },
    servers: [{ url: '/api', description: 'API Server' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        ApiRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
            url: { type: 'string', format: 'uri' },
            headers: { type: 'object' },
            body: { type: 'object', nullable: true },
            status_code: { type: 'integer' },
            response_data: {},
            response_time_ms: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', minLength: 6, example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Current user info', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/request/send': {
        post: {
          tags: ['Requests'],
          summary: 'Send an HTTP request',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['method', 'url'],
                  properties: {
                    method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], example: 'GET' },
                    url: { type: 'string', format: 'uri', example: 'https://jsonplaceholder.typicode.com/posts/1' },
                    headers: { type: 'object', example: { 'Content-Type': 'application/json' } },
                    body: { type: 'object', nullable: true, example: null },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Request result', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiRequest' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/request/history': {
        get: {
          tags: ['Requests'],
          summary: 'Get request history',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'List of past requests',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ApiRequest' } } } },
            },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/request/history/update': {
        post: {
          tags: ['Requests'],
          summary: 'Update a saved request',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id', 'method', 'url'],
                  properties: {
                    id: { type: 'integer', example: 1 },
                    method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
                    url: { type: 'string', format: 'uri' },
                    headers: { type: 'object' },
                    body: { type: 'object', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated request', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiRequest' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/request/history/delete': {
        post: {
          tags: ['Requests'],
          summary: 'Delete a saved request',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id'],
                  properties: {
                    id: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Deletion confirmation', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  });
});

// Serve frontend static files in production
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuild));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
