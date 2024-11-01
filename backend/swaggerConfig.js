import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuration options for Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Specifies OpenAPI version 3.0.0
        info: {
            title: 'Post-Apocalypse Trade Hub API', // Title for the API documentation
            version: '1.0.0', // Version of the API
            description: 'API documentation for the Post-Apocalypse Trade Hub', // Short description of the API
        },
        servers: [
            {
                url: 'http://localhost:5000', // Base URL of the API server
            },
        ],
    },
    apis: ['./routes.js'], // Path to the route files with Swagger comments
};

// Generate API documentation from the configuration options
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Export Swagger UI and generated docs for use in the app
export { swaggerUi, swaggerDocs };
