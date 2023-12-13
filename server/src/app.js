const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const {jwtStrategy} = require('./config/passport');
const passport = require('passport');
const routes = require('./routes/v1');

//kreiranje instance express aplikacije
const app = express();

//parsiranje JSON tijela zahtjeva
app.use(express.json());

//parsiranje urlencoded tijela zahtjeva
app.use(express.urlencoded({extended: true}));

//omogućavanje CORS-a (Cross-Origin Resource Sharing)
app.use(cors());
app.options('*', cors());

//konfiguracija JWT autentikacije
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//dodavanje ruta za v1 API
app.use('/v1', routes);

module.exports = app;
