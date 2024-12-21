const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Charitan Microservices API',
      version: '1.0.0',
      description: 'API documentation for Charitan microservices',
    },
    servers: [
      {
        url: 'http://localhost:8000', 
      },
    ],
  },
  apis: [
    path.resolve(__dirname, './Routers/AuthRouter.js'),
    path.resolve(__dirname, './Routers/ProjectRouter.js'),
    path.resolve(__dirname, './Routers/CharityRouter.js'),
    path.resolve(__dirname, './Routers/DonationRouter.js'),
  ], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
