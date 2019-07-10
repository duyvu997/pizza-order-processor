require('dotenv').config();
const Hapi = require('@hapi/hapi');
var Joi = require('@hapi/joi');
var consumer = require('./consumer');
var producer = require('./producer');
Joi.objectId = require('joi-objectid')(Joi);

const init = async () => {
   
    const server = Hapi.server({
        // host: 'localhost',
        port: process.env.PORT || 3000
    });
    server.route({
        method:'GET',
        path: '/',
        handler : (res, h)=>{
            return 'Welcome to PizzaOrder Processor  :)'
        }
    });
    server.route({
        method:'GET',
        path: '/favicon.ico',
        handler : (res, h)=>{
            return 'favicon.ico'
        }
    });

    server.route({
        method: 'POST',
        path: '/orders/{id}',
        handler:  producer.sendMessage,            
        
        options: {           
            validate : producer.validatePayload
        }
    });
    
    await server.start()
    console.log(`Server running at: ${server.info.uri}`);
    consumer;
}
   

 



process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();