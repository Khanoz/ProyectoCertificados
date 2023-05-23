module.exports = function SwaggerSetuo(app) { // Swagger
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Eventus API',
            version: '1.0.0',
            description: 'REST API made for Eventus clients app.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html'
            },
            contact: {
                name: 'JSONPlaceholder',
                url: 'https://jsonplaceholder.typicode.com'
            }
        },
        servers: [
            {
                url: 'http://127.0.0.1:8000',
                description: 'Development server'
            },
        ]
    };

    const options = {
        swaggerDefinition,
        // Paths to files containing OpenAPI definitions
        apis: ['./routes/*.js'],
    };

    const swaggerSpec = swaggerJSDoc(options);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
