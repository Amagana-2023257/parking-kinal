import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const swaggerOptions = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title: "coperex API",
            version:"1.0.0",
            description: "API de gestor de api coperex",
            contact:{
                name: "Angel Magaña",
                email: "amagana-2023257@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/coperex/v1"
            }
        ]
    },
    apis:[
        "./src/auth/*.js",
        "./src/user/*.js",
    ]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

export { swaggerDocs, swaggerUi }