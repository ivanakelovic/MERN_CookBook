const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

let server;

//povezivanje sa bazom podataka
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    console.log("Connected to MongoDB");
   //pokretanje servera
    server = app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`);
    });
});

//obrada zatvaranja servera i procesa
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

//obrada neocekivanih gresaka
const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

//obrada signala SIGTERM
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});
