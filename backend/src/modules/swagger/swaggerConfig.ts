export const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Cinema Management API',
        version: '1.0.0',
        description: 'API for managing movies, metadata, and user authentication',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
    apis: [
      './src/modules/routes/*.ts',
      './src/modules/controllers/*.ts',
      './src/modules/schemas/*.ts',
      './src/app.ts'
    ],
  };