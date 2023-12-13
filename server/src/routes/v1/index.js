const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const fileRoute = require('./file.route');
const categoryRoute = require('./category.route');
const ingredientRoute = require('./ingredient.route');
const recipeRoute = require('./recipe.route');
const evaluationRoute=require('./evaluation.route');
const favoritesRoute=require('./favorites.route');
const statsRoute=require('./stats.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/files',
        route: fileRoute
    },
    {
        path: '/categories',
        route: categoryRoute
    },
    {
        path: '/ingredients',
        route: ingredientRoute
    },
    {
        path: '/recipes',
        route: recipeRoute
    },
    {
        path:'/evaluations',
        route:evaluationRoute
    },
    {
        path:'/favorites',
        route:favoritesRoute
    },
    {
        path:'/stats',
        route:statsRoute
    }

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


module.exports = router;