const recipeService=require("../services/recipe.service");
const categoryService=require("../services/category.service");
const ingredientService=require("../services/ingredient.service");
const userService=require("../services/user.service");

const getStats=async()=>{
const recipesCount=await recipeService.getNumberOfRecipes();
const categoriesCount=await categoryService.getNumberOfCategories();
const ingredientsCount=await ingredientService.getNumberOfIngredients();
const usersCount=await userService.getNumberOfUsers();

return{
    "recipesCount":recipesCount,
    "categoriesCount":categoriesCount,
    "ingredientsCount":ingredientsCount,
    "usersCount":usersCount
};

};

module.exports={
    getStats
}