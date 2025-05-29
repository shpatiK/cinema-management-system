import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Request, Response } from 'express';

// Define the options
export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cinema Management API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Be more specific about which files to parse
  apis: [
    './src/app.ts',
    './src/modules/routes/authRoutes.ts',
    './src/modules/routes/movieRoutes.ts',
    './src/modules/routes/bookingRoutes.ts',
    './src/modules/routes/showtimeRoutes.ts',
    './src/modules/routes/adminRoutes.ts',
  ],
};

// Create the specs
const specs = swaggerJsdoc(options);

// Export the setup function
export const setupSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/api-docs-json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};