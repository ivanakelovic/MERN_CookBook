const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {userService} = require('../services');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['firstName', 'lastName', 'role','favorites']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  

    const result = await userService.queryUsers(filter, options);
    
    res.send(result);




});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
});

const addFavorite=async(req,res)=>{
    const {userId}=req.body;
    const {recipeId}=req.params;

    console.log("addfavorite controller",userId,recipeId);
    console.log("req.boyd",req.body);
    
    try{
        await userService.addRecipeToFavorites(userId,recipeId);
        return res.status(200).json({message:'Recipe added to favorites successfully'});
    }catch(error){
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const removeFavorite=async(req,res)=>{
    const {userId}=req.body;
    const {recipeId}=req.params;

    console.log("remove favorite");
    console.log("userId")

    try{
        await userService.removeRecipeFromFavorites(userId,recipeId);

        return res.status(200).json({ message: 'Recipe removed from favorites successfully' });
    }catch(error){
        return res.status(500).json({ error: 'Internal server error' });
    }

};

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    addFavorite,
    removeFavorite
};
