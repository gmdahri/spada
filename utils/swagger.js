const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API Documentation',
      version: '1.0.0',
      description: 'Documentation for Auth API',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1', // Change this URL to match your API base URL
      },
    ],
  },
  apis: ['./Controller/AuthController.js'], // Change the path to match the file containing your routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  serveSwagger: swaggerUi.serve,
  setupSwagger: swaggerUi.setup(swaggerSpec),
};
