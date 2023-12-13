import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { fetchPicture } from "./DisplayRecipes"; 
import RecipeIngredients from "./pageComponents/RecipeIngredients";
import AuthorOfRecipe from "./pageComponents/AuthorOfRecipe";
import CategoryOfMeal from "./pageComponents/CategoryOfMeal";
import { getEvaluations,createEvaluation } from "../services/evaluation.service";
import StarRatings from 'react-star-ratings';
import { useAuth } from "../auth";
import "../css/components.css";
import ModalComponent from "../modals/ModalComponent";
import AddComent from "./pageComponents/AddComent";
import { showSuccessMessage } from "../message/successMessage";
import { showErrorMessage } from "../message/errorMessage";
import { getUser } from "../services/user.service";
import RecipePicture from "./pageComponents/RecipePicture";
import logo from "../logo/cookE_logo.png"

const DisplayRecipe = () => {

  const location = useLocation();
  const { recipe } = location.state || {};
  const {currentUser,logout}=useAuth();

  const [picture, setPicture] = useState(null);
  const [evaluations,setEvaluations]=useState([]);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [users,setUsers]=useState({});

  const toggle=()=>setIsModalOpen(!isModalOpen);

  const handleShowingModal=(e)=>{
      e.preventDefault();
      console.log("handleshowingmodal");
      setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPicture(recipe.picture)
      .then((pictureDisplay) => {
        setPicture(pictureDisplay);
      });
      fetchComments();

      if (evaluations.length > 0) {
        fetchUserInformation();
      }
  }, [evaluations,recipe.picture]);

  const fetchComments=async()=>{
    const filters={
      recipeId: recipe.id,
      limit:'9999999'
  };
    const fetchedComments=await getEvaluations(filters);
    console.log("all comments: ",fetchedComments);
    setEvaluations(fetchedComments);
  }

  const handleCommentSubmission =async(newComment)=>{
    try{
      const createdComment=await createEvaluation(newComment);
      console.log('comment created: ',createdComment);
      showSuccessMessage('Comment successfully created!');

      setEvaluations([...evaluations,createdComment]);

      toggle();
    }catch(error){
      console.log('error', error);
      showErrorMessage('Failed to create a comment!!!');
    }
   
  };

  const fetchUserInformation=async()=>{
    const userInformation={};
    for (const evaluation of evaluations){
      if(!users[evaluation.evaluatedBy]){
        const user=await getUser(evaluation.evaluatedBy);
        if(user){
          userInformation[evaluation.evaluatedBy]=user;
        }
      }
    }

    setUsers({...users,...userInformation});

  }


  return (
    <React.Fragment>
      <Card
  className="p-1 default-border"
  style={{ marginTop: "6rem", marginLeft: "2%", marginRight: "2%" }}
>
  <div className="row">


    {/* First Column: Image, Badges, and Title */}
    <div className="col-md-4">
      <div className="image-container">
        {picture && (
          <img
            src={picture}
            className="p-3 mx-auto d-block recipe-photo"
            style={{ width: "100%" }}
            alt="img"
          />
        )}
        <div className="image-overlay">
          <Card.Title className="text-center overlay-text">{recipe.title}</Card.Title>
        </div>
      </div>

      <div className="badge-container">
        <CategoryOfMeal categoryId={recipe.category} />
        {recipe.dietaryPreferences.vegan === true ? (
          <span className="p-1 vegan-bagde">Vegan </span>
        ) : null}
        {recipe.dietaryPreferences.vegetarian === true ? (
          <span className="p-1 vegetarian-badge">Vegetarian </span>
        ) : null}
        {recipe.dietaryPreferences.glutenFree === true ? (
          <span className="p-1 gluten-free-badge">GlutenFree </span>
        ) : null}
        {recipe.dietaryPreferences.kosher === true ? (
          <span className="p-1 kosher-badge">Kosher </span>
        ) : null}
        {recipe.dietaryPreferences.halal === true ? (
          <span className="p-1 halal-badge">Halal </span>
        ) : null}
      </div>
    </div>

     {/* Third Column: Ingredients, Portions, and Preparation Time */}
     <div className="col-md-4 d-flex align-items-center justify-content-center">
      <div className="preparation-method">
        <label className="form-label fs-6 fw-bolder text-dark">Ingredients</label><br />
        <label className="form-label fs-10 fw-bold text-dark">(For {recipe.portionsNumber} people)</label>
        <RecipeIngredients ingredients={recipe.ingredients} />
        <label className="form-label fs-6 fw-bolder text-dark">Preparation Time:</label>
          <Card.Text>{recipe.preparationTime} minutes</Card.Text>
      </div>
    </div>


    {/* Second Column: Preparation Method and Posted By */}
    <div className="col-md-4 d-flex align-items-center justify-content-center preparation-method">
      <div className="preparation-method">
        <div>
          <label className="form-label fs-6 fw-bolder text-dark ">Preparation Method:</label>
          <Card.Text>{recipe.preparationMethod}</Card.Text>
          <label className="form-label fs-6 fw-bolder text-dark">Posted By:</label>
          <span className="italic-text">
            <AuthorOfRecipe userId={recipe.postedBy} />
          </span>
        </div>
      </div>
    </div>

  
  </div>
</Card>

     {/*Comment */}
     
      <div className="container bg-white p-2 mt-2">
      <div className="d-flex justify-content-between align-items-center mt-3">
                    <h4 className="text-dark">Comments</h4>
                    <div>
                     {currentUser?(
                       <button
                       onClick={handleShowingModal}
                        className="btn btn-md default-button"
                        >Write A Comment
                        </button>
                     ):null}
                    </div>
                    </div>
                    <br/>
            {evaluations.length>0?(
              evaluations.map((evaluation,index)=>(
               <div>
                 <div key={index} className="comment d-flex align-items-center justify-content-between">
                 
                 <div>
                
                {users[evaluation.evaluatedBy]?(
                <>
 {users[evaluation.evaluatedBy].picture ? (
  
                      <RecipePicture
                        src={users[evaluation.evaluatedBy].picture}
                        alt="Could not load picture"
                        width="2em"
                        height="2em"
                        objectFit="cover"
                      />
                    ) : (
                      <img
                        src={logo} 
                        alt="Default user picture"
                      />
                    )}

                 <div className="bold-text">
                 {users[evaluation.evaluatedBy].firstName} {users[evaluation.evaluatedBy].lastName}
               </div>
               </>
                ):null}
                  <small className="text-muted">{new Date(evaluation.createdAt).toLocaleString()}</small>
                   <div className=""> 
                    {evaluation.comment}
                  </div>
                  </div>
                 <div>
                 <StarRatings
                    rating={evaluation.rating}
                    starRatedColor="#7f3068"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name={`average-rating-${evaluation.id}`}
                    readonly
                  />
                  </div>
                </div>
                <hr/>
                </div>
                
              ))
            ):null}
      </div>
      <ModalComponent
    show={isModalOpen}
    onHide={toggle}
    modalTitle="Write A Comment"

  >
    <AddComent recipe={recipe} 
    onCommentSubmit={handleCommentSubmission } 
    closeModal={()=>{setIsModalOpen(false)}}/>

    </ModalComponent>
  
    </React.Fragment>
  );
};

export default DisplayRecipe;
