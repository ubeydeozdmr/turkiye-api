const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const servers = isProduction
  ? [
      {
        url: 'https://turkiyeapi.dev/api/v1/',
        description: 'Production server',
      },
    ]
  : [
      {
        url: 'http://localhost:8181/api/v1/',
        description: 'Development server',
      },
    ];

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Turkiye API',
    version: '1.0.0',
    description: 'REST API for provinces and districts of Turkiye',
    license: {
      name: 'MIT License',
      url: 'https://github.com/ubeydeozdmr/turkiye-api/blob/main/LICENSE',
    },
    contact: {
      name: 'Ubeyde Emir Özdemir',
      url: 'https://ubeyde.me/',
      email: 'ubeydeozdmr@gmail.com',
    },
  },
  servers,
};

const options = {
  swaggerDefinition,
  apis: ['./src/v1/routes.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
