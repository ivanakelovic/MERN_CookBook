import React, { useEffect, useState } from "react";
import { deleteRecipe, getRecipe } from "../services/recipe.service";
import { useAuth } from "../auth";
import { getFile } from "../services/file.service";
import { Card, Col, Modal, Row } from "react-bootstrap";
import "../css/components.css";
import AuthorOfRecipe from "./pageComponents/AuthorOfRecipe";
import CategoryOfMeal from "./pageComponents/CategoryOfMeal";
import { Link, useNavigate } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import { getEvaluations } from "../services/evaluation.service";
import { fetchPicture } from "./DisplayRecipes";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { removeFromFavorites } from "../services/favorites.service";
import RecipePicture from "./pageComponents/RecipePicture";

const DisplayFavorites = () => {

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const { currentUser, logout } = useAuth();
  const [recipeAverageRating, setRecipeAverageRating] = useState(new Map());
  const [refreshData, setRefreshData] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    console.log("currentuser: ", currentUser);
    fetchFavoriteRecipes();
  }, [currentUser]);

  const fetchFavoriteRecipes = async () => {
    if (currentUser && currentUser.favorites) {
      const favoriteRecipesIds = Object.keys(currentUser.favorites);
      Promise.all(favoriteRecipesIds.map(id => getRecipe(id)))
        .then(fetchedRecipes => {
          setFavoriteRecipes(fetchedRecipes)
          console.log(favoriteRecipes);
        })
        .catch(error => {
          console.error('Error fetching favorite recipes:', error);
        });
    }
  };

  const openDeleteModal = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteModalOpen(true);
    console.log("opendeletemode");
    console.log("recipe in opendeletemodal", recipe);
  };

  const handleDeleting = async () => {
    if (recipeToDelete) {
      const recipeId = recipeToDelete.id;
      await removeFromFavorites(currentUser.id.toLocaleString(), recipeId);
      console.log("recipeid in handle deleting", recipeId);
      setRefreshData(!refreshData);

      setFavoriteRecipes((prevFavoriteRecipes) =>
      prevFavoriteRecipes.filter((recipe) => recipe.id !== recipeId)
    );
    }
  };

  const closeModal = () => {
    setDeleteModalOpen(false);
  };





    const navigateToRecipe = (recipe) => {
      navigate(`/recipe/${recipe.id}`, { state: { recipe } })
    }


   

    return (
        <div  style={{ marginTop: '5%' }}>
        <Row className="">
        {favoriteRecipes.length > 0 ? (
     favoriteRecipes.map((recipe) => (
      <Col className="my-2" key={recipe.id} xs={12} md={6}>
        <Card
        className="p-3 default-border mt-10"
        style={{ marginTop: '5%',marginLeft:'1%',marginRight:'1%'}}>
        
          <Card.Body>
          
             <React.Fragment>
               <div className="d-flex justify-content-end align-items-center">
              
             
              <button 
              onClick={()=>openDeleteModal(recipe)}
              className=""
              >
                <FontAwesomeIcon icon={faTimes} color="red" fontSize={30} cursor="pointer" />
              </button>
            </div>
              <DeleteConfirmationModal
              item={recipe}
              closeModal={closeModal}
              onDelete={()=>{handleDeleting()}}
              onShow={deleteModalOpen}
              />
            
              </React.Fragment>
          
          <div className="image-container d-flex align-items-center justify-content-center">
          <RecipePicture
          src={recipe.picture}
          alt="could not load picture"
          width="25em"
          height="20em"
          objectFit="cover"
          />
          <div className="image-overlay">
        <Card.Title className="text-center overlay-text">{recipe.title}</Card.Title>
      </div>
            </div>
          
           <div className="badge-container">
           <CategoryOfMeal categoryId={recipe.category}/>
           {recipe.dietaryPreferences.vegan===true?(
           <span className="p-1 vegan-bagde">Vegan </span>
           )
            :null}
            {recipe.dietaryPreferences.vegetarian===true?(
            <span className="p-1 vegetarian-badge">Vegetarian </span>)
            :null}
            {recipe.dietaryPreferences.glutenFree===true?(
            <span className="p-1 gluten-free-badge">GlutenFree </span>)
            :null}
            {recipe.dietaryPreferences.kosher===true?(
            <span className="p-1 kosher-badge">Kosher </span>)
            :null}
            {recipe.dietaryPreferences.halal===true?(
            <span className="p-1 halal-badge">
              Halal </span>)
            :null}
           </div>
           <div className="d-flex align-items-center justify-content-center"> 
           <StarRatings
rating={recipeAverageRating.get(recipe.id) || 0}
starRatedColor="#7f3068"
numberOfStars={5}
starDimension="20px"
starSpacing="2px"
name={`average-rating-${recipe.id}`}
readonly

/>
           </div>
            <label className='form-label fs-6 fw-bolder text-dark'>Posted By:</label>  
            <AuthorOfRecipe userId={recipe.postedBy}/>
            <button
            onClick={() => {
              navigateToRecipe(recipe);
          }}
            className="btn btn-large bg-dark text-white text-center w-100">Open</button>
          </Card.Body>
        </Card>

        
      </Col>
    ))

   ):(
    <div className='text-dark-400  mt-4 fw-bold fs-4 card bg-white d-flex align-items-center justify-content-center p-3 border border-dark border-500'>
    No recipes were added to favorites.
    <Link to='/recipes' className=' fw-bolder purple-text' style={{marginLeft: '5px'}}>
        Add some Now!
    </Link>
 </div>
   )}

  </Row>
    </div>
    );
  };
export default DisplayFavorites;
