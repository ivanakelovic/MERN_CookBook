import React,{useEffect,useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import { getStats } from "../services/stats.service";
import DashboardCard from "./pageComponents/DashboardCard";
import { useAuth } from "../auth";
import { getRecipe, getRecipes } from "../services/recipe.service";
import { evaluateRecipes } from "./DisplayRecipes";
import { fetchPicture } from "./DisplayRecipes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecipePicture from "./pageComponents/RecipePicture";
import { Card, Modal } from "react-bootstrap";
import "../css/components.css";
import Dice from "./pageComponents/Dice";
import { FaArrowRight } from "react-icons/fa";
import gif from "../logo/Untitled design (1).gif";
import { getCategories } from "../services/category.service";
import StarRatings from 'react-star-ratings';
import ModalComponent from "../modals/ModalComponent";
import CategoryOfMeal from "./pageComponents/CategoryOfMeal";

const Dashboard=()=>{

    const [numberOfRecipes,setNumberOfRecipes]=useState(0);
    const [numberOfUsers,setNumberOfUsers]=useState(0);
    const [numberOfCategories,setNumberOfCategories]=useState(0);
    const [numberOfIngredients,setNumberOfIngredients]=useState(0);
    const [recipes,setRecipes]=useState([]);
    const [recipeAverageRating, setRecipeAverageRating] = useState(new Map());
    const [randomRecipeId,setRandomRecipeId]=useState(null);
    const [randomRecipe,setRandomRecipe]=useState(null);
    const [allRecipes,setAllRecipes]=useState([]);
    const [isHovered,setIsHovered]=useState(false);
    const [categories,setCategories]=useState([]);
     const [showSingleRecipe, setShowSingleRecipe] = useState(false);
     const [isModalOpen,setIsModalOpen]=useState(false);

    const {currentUser,logout}=useAuth();
    const navigate=useNavigate();


    const toggle=()=>setIsModalOpen(!isModalOpen);

    const handleShowingModal=(e)=>{
        e.preventDefault();
       
        setIsModalOpen(true);
        console.log("modal: ",isModalOpen)
    };


    useEffect(()=>{
        fetchData();
        fetchEvaluations();
        fetchRecipes();
        fetchCategories();
    },[]);

    const fetchData=async()=>{
       try{
        await getStats()
        .then(data=>{
            setNumberOfCategories(data.categoriesCount);
            setNumberOfIngredients(data.ingredientsCount);
            setNumberOfRecipes(data.recipesCount);
            setNumberOfUsers(data.usersCount);
        });

       }catch(error) {
        console.log("error occurred while fetching data");
       }
    };

    const fetchEvaluations = async () => {
      try {
        const averageRatings = await evaluateRecipes();
      //  console.log("Raw average ratings data: ", averageRatings);
    
        const fiveStarRecipes = [];
        for (const [recipeId, rating] of averageRatings.entries()) {
          if (Number(rating) >= 5) {
            fiveStarRecipes.push(recipeId);
          }
        }
       // console.log("Recipe IDs with 5-star ratings: ", fiveStarRecipes);
    
        try {
          const detailedRecipes = await Promise.all(
            fiveStarRecipes.map(async (recipeId) => {
              const recipeDetails = await getRecipe(recipeId);
             // console.log("Recipe details for ", recipeId, ": ", recipeDetails);
              return recipeDetails;
            })
          );
    
          setRecipes(detailedRecipes);
        //  console.log("recipes: ", detailedRecipes);
    
          setRecipeAverageRating(averageRatings);
          //console.log("avg rating: ", averageRatings);
        } catch (error) {
          console.log("Error occurred while fetching recipe details:", error);
        }
      } catch (error) {
        console.log("Error occurred while fetching 5-star recipes:", error);
      }
    };
    
    
      useEffect(() => {

       // console.log("Updated recipes: ", recipes);
        //console.log("Updated avg rating: ", recipeAverageRating);
      }, [recipes, recipeAverageRating]);
    

      const navigateToRecipe=(recipe)=>{
        navigate(`/recipe/${recipe.id}`,{state:{recipe}})
       };

       const fetchRecipes = async () => {
        const filters = {
            limit: '9999999'
        };
    
        const [pagination,recipesAll] = await getRecipes(filters);
        console.log("recipes all: ", recipesAll);
        setAllRecipes(recipesAll);
    };

    const fetchCategories = async () => {
      try {
        const defaultFilters = {
          limit: '9999999'
        };
    
    
        const [pagination,categoryList] = await getCategories(defaultFilters);
        setCategories(categoryList);
        console.log('Categories list:', categoryList);
        console.log("categories:",categories);
    
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

      const handleRollDice=async()=>{
        console.log("dice roll")
        setIsModalOpen(true);

       if (allRecipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * allRecipes.length);
        const randomRecipe = allRecipes[randomIndex];

        console.log("Random Recipe: ", randomRecipe);
        setRandomRecipe(randomRecipe);
       
       }else{
        console.log("No recipes available to roll the dice.");
       }
      };

      const handleMouseEnter=()=>{
        setIsHovered(true);
      };

      const handleMouseLeave=()=>{
        setIsHovered(false);
      };

      const handleBackToRecipes = () => {
        setShowSingleRecipe(false);
      };

      return (
        <div style={{ marginTop: "4.9rem" }}>
          <div className="d-flex justify-content-center row row-cols-2 card-group col-lg-10 col-md-10 col-sm-12 mx-auto">
            <DashboardCard pretext="Recipes Posted" number={numberOfRecipes} aftertext="" />
            <DashboardCard pretext="In" number={numberOfCategories} aftertext="categories" />
            <DashboardCard pretext="By" number={numberOfUsers} aftertext="Users" />
            <DashboardCard pretext="Made With" number={numberOfIngredients} aftertext="Ingredients" />
          </div>
      
          <Card className="mb-2 border border-dark">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h5>Get Inspired!</h5>
          <button className="btn btn-md default-button" onClick={handleRollDice}>
            Go
          </button>
        </Card.Body>
      </Card>

          {/* Full-width slider with 3 recipes or Single recipe view */}
          {showSingleRecipe ? (
            <div className="row">
              <div className="col-md-6 d-flex justify-content-center align-items-center">
                
                <RecipePicture 
                src={randomRecipe?.picture} 
                alt={randomRecipe?.title} 
                width="25em"
                height="20em"
                objectFit="cover"/>
                <div className="text-center mt-3">
                  <h5>{randomRecipe?.title}</h5>
                  <button className="btn btn-lg default-button w-150" onClick={handleBackToRecipes}>
                    Back to Recipes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="row mt-3">
              <div className="col-md-12">
                {/* Full-width slider with 3 recipes */}
                <span className="d-flex align-items-center justify-content-center p-1 meal-category-badge">5 STAR RECIPES </span>
                
                <Slider {...sliderSettings}>
                  {recipes.map((recipe) => (
                    <div key={recipe.id} onClick={() => navigateToRecipe(recipe)} style={{ cursor: "pointer" }}>
                      <div className="image-container mx-auto my-auto d-flex align-items-center justify-content-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <RecipePicture 
                        src={recipe.picture} 
                        alt={recipe.title} 
                        width="25em"
                        height="20em"
                        objectFit="cover"/>
                        <div className="image-overlay">
                          <Card.Title className="text-center overlay-text">{recipe.title}</Card.Title>
                        </div>
                        {isHovered && (
                          <div className="overlay-text-click">
                            <Card.Title className="">Click to see full recipe</Card.Title>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
      

      <ModalComponent
            show={isModalOpen}
            onHide={toggle}
            modalTitle="You Should Try This Recipe!!!"
        >
         <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-center">
              </div>
              {randomRecipe ? (
                <div className="">
                  <Card className="p-2">
                  <div className="badge-container">
               <CategoryOfMeal categoryId={randomRecipe.category}/>
               {randomRecipe.dietaryPreferences.vegan===true?(
               <span className="p-1 vegan-bagde">Vegan </span>
               )
                :null}
                {randomRecipe.dietaryPreferences.vegetarian===true?(
                <span className="p-1 vegetarian-badge">Vegetarian </span>)
                :null}
                {randomRecipe.dietaryPreferences.glutenFree===true?(
                <span className="p-1 gluten-free-badge">GlutenFree </span>)
                :null}
                {randomRecipe.dietaryPreferences.kosher===true?(
                <span className="p-1 kosher-badge">Kosher </span>)
                :null}
                {randomRecipe.dietaryPreferences.halal===true?(
                <span className="p-1 halal-badge">
                  Halal </span>)
                :null}
               </div>
                  <div className="image-container d-flex align-items-center justify-content-center">
                  <RecipePicture
  src={randomRecipe.picture}
  alt={randomRecipe.title}
  width="25em"
  height="20em" 
  objectFit="cover" 
/>

  <div className="image-overlay">
                      <Card.Title className="text-center overlay-text">{randomRecipe.title}</Card.Title>
                    </div>
              
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between">
                  <button
                  className="btn btn-md green-button"
                  onClick={() => navigateToRecipe(randomRecipe)}
                  >Check Full Recipe</button>
                    <button
                    className="btn btn-md default-button"
                    onClick={handleRollDice}
                    > Get New Recipe!!</button>
                   
                  </div>
                  </Card>
                </div>
            
              ) : (
                <div></div>
              )}
           
            </div>
          </div>
          </Modal.Body>
          </ModalComponent>
          {/* Random recipe display */}
        {/*  <div className="row mt-3">
            <div className="col-md-6">
              <div className="d-flex justify-content-center mb-3">
                <div className="d-flex flex-column align-items-center">
                  <button className="btn btn-lg default-button w-150" onClick={handleRollDice} style={{ height: "100%" }}>
                    Get inspired!
                  </button>
                </div>
              </div>
              {randomRecipe ? (
                <div className="">
                  <h5 className="d-flex justify-content-center text-dark mt-3">Try this: </h5>
                  <div className="image-container d-flex align-items-center justify-content-center" onClick={() => navigateToRecipe(randomRecipe)} style={{ cursor: "pointer" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <RecipePicture src={randomRecipe.picture} alt={randomRecipe.title} />
                    <div className="image-overlay">
                      <Card.Title className="text-center overlay-text">{randomRecipe.title}</Card.Title>
                      {isHovered && (
                        <div className="overlay-text-click">
                          <Card.Title className="">Click to see full recipe</Card.Title>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
      
              */}
          {/* Category slider at the bottom */}
          <div className="row mt-3">
            <div className="col-md-12">
              <Slider {...categorySliderSettings} className="mb-0">
                {categories.map((category) => (
                  <div key={category.id}>
                    <div className="text-dark bg-white fw-bolder default-border p-2 m-2" style={{ cursor: "pointer" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => navigate(`/recipes?category=${category.id}`)}>
                      {category.name}
                      {isHovered && (
                        <div className="overlay-text-click">
                          <Card.Title className="">Click to see recipes in {category.name}</Card.Title>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      );
      
      
  
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", position: "absolute", left: "0", zIndex: "1",backgroundColor:"purple" }}
      onClick={onClick}
    />
  );
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", position: "absolute", right: "0", zIndex: "1",backgroundColor:"purple"}}
      onClick={onClick}
    />
  );
};



const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,  
  autoplaySpeed: 4000,
  prevArrow: <SamplePrevArrow />,
  nextArrow: <SampleNextArrow />,
  responsive: [
    {
      breakpoint: 768, // Small screens
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 992, // Medium screens
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};


const categorySliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1, 
  slidesToScroll: 1,
  centerMode: true,
  focusOnSelect: true,
  variableWidth: true,
  autoplay: true,           
  autoplaySpeed: 4000,
  prevArrow: <SamplePrevArrow />,
  nextArrow: <SampleNextArrow />,
};



export default Dashboard;