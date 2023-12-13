import React, { FC,useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage, useAuth } from '../auth';
import { App } from '../App';
import DisplayRecipes from '../pages/DisplayRecipes';
import UserInformation from '../pages/UserInformation';
import Dashboard from '../pages/Dashboard';
import AddMealCategory from '../pages/AddMealCategory';
import AddIngredient from '../pages/AddIngredient';
import AddRecipe from '../pages/AddRecipe';
import DisplayRecipe from '../pages/DisplayRecipe';
import DisplayIngredients from '../pages/DisplayIngredients';
import DisplayFavorites from '../pages/DisplayFavorites';
import Layout from '../layouts/Layout';
import DisplayCategories from '../pages/DisplayCategories';


const { PUBLIC_URL } = process.env;

const AppRoutes: FC = () => {
  const { currentUser } = useAuth();



  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          {/* Define public routes */}
          <Route path="/recipes" element={<DisplayRecipes />} />
          <Route path="/recipe/:recipeId" element={<DisplayRecipe/>}/>
            <Route path="/my-profile" element={<UserInformation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ingredients" element={<DisplayIngredients />} />
          <Route path="/categories" element={<DisplayCategories/>}/>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {currentUser&& currentUser.role=="admin"?(
            <Route>
              <Route path="/add-meal-category" element={<AddMealCategory/>}/>
            <Route path="/add-ingredient" element={<AddIngredient/>}/>
              </Route>

           ):null}

          {currentUser?(
            <Route>
            <Route path="/add-recipe" element={<AddRecipe/>}/>
            <Route path="/favorites" element={<DisplayFavorites/>}/>
              </Route>

          ):null}
         

          {/* Check user authentication and route accordingly */}
          {currentUser ? (
            // If logged in, redirect to the dashboard
            [
              <Route key="private" path="/*" element={<Navigate to="/dashboard" />} />
            ]
          ) : (
            // If not logged in, show public routes
            [
              <Route key="auth" path="/auth/*" element={<AuthPage />} />,
              <Route key="public" path="*" element={<Navigate to="/auth" />} />
            ]
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
