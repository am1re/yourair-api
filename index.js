import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
var cors = require('cors');
import { connect } from "mongoose"

import indexRouter from './routes/index'

import { serve, setup } from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
const openapiSpecification = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'YourAir API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js']
})

connect("mongodb+srv://dbUser:Lw0wwRiysffGOams@cluster0.vxgoq.mongodb.net/yourairdb1?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const app = express()
        
        app.use(cors());
        app.use(logger('dev'))
        app.use(json())
        app.use(urlencoded({ extended: false }))
        app.use(cookieParser())

        app.use('/', indexRouter)
        app.use('/api-docs', serve, setup(openapiSpecification))

        app.use(function (err, req, res, next) {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server has started!")
        })
    })
