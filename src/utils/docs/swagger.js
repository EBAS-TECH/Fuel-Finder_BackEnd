// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fuel Finder API',
      version: '1.0.0',
      description: 'API Documentation for the Fuel Finder App',
    },
    servers: [
      {
        url: 'https://fuel-finder-backend.onrender.com', // Replace with your real domain
      },
    ],
  },
  apis: ['../../routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
