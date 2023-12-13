import React,{useEffect, useState} from "react";
import { getRecipes,deleteRecipe, updateRecipe, getRecipe } from "../services/recipe.service";
import { useAuth } from "../auth";
import { getFile } from "../services/file.service";
import { Card, Col, Modal, Row } from "react-bootstrap";
import "../css/components.css";
import AuthorOfRecipe from "./pageComponents/AuthorOfRecipe";
import CategoryOfMeal from "./pageComponents/CategoryOfMeal";
import { useNavigate } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import { getEvaluations } from "../services/evaluation.service";
import { Pagination } from "../pagination/pagination";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import EditRecipe from "./pageComponents/EditRecipe";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getCategories } from "../services/category.service";
import clsx from "clsx";
import {FaHeart} from 'react-icons/fa';
import {HiHeart} from 'react-icons/hi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { addToFavorites,removeFromFavorites } from "../services/favorites.service";
import { getUser } from "../services/user.service";
import { getIngredients } from "../services/ingredient.service";
import Select from "react-select";
import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";
import RecipePicture from "./pageComponents/RecipePicture";

export const evaluateRecipes = async (filters = {}) => {
  try {
    const defaultFilters = {
      limit: '9999999'
    };

    const mergedFilters = { ...defaultFilters, ...filters };

    const evaluationModels = await getEvaluations(mergedFilters);

    const recipeRatings = new Map();

    for (const evaluation of evaluationModels) {
      const recipeId = evaluation.recipeId;

      if (!recipeRatings.has(recipeId)) {
        recipeRatings.set(recipeId, {
          sum: 0,
          count: 0
        });
      }

      const ratingInfo = recipeRatings.get(recipeId);
      if (ratingInfo) {
        ratingInfo.sum += evaluation.rating;
        ratingInfo.count++;
      }
    }

    const averageRatings = new Map();

    recipeRatings.forEach((ratingInfo, recipeId) => {
      const averageRating = ratingInfo.count > 0 ? ratingInfo.sum / ratingInfo.count : 0;
      averageRatings.set(recipeId, averageRating);
    });

    return averageRatings;
  } catch (error) {
    console.error(error);
    return new Map();
  }
};


export const fetchPicture=async(pictureId)=>{
  //console.log('fetchpict: id',pictureId);
  const pic=await getFile(pictureId);
  //console.log('pic: getfile',pic);
  const displayPicture=require('../../../server/file/'+pic.fileName);
  return displayPicture;
}

const DisplayRecipes=()=>{


const navigate=useNavigate();
    
      const navigateToRecipe=(recipe)=>{
       navigate(`/recipe/${recipe.id}`,{state:{recipe}})
      }

      const [recipes,setRecipes]=useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [paginationData, setPaginationData] = useState({});
      const [currentLimit, setCurrentLimit] = useState(10);
      const {currentUser,logout}=useAuth();
      const [recipeAverageRating, setRecipeAverageRating] = useState(new Map());
      const [editModalOpen, setEditModalOpen] = useState(false);
      const [deleteModalOpen, setDeleteModalOpen] = useState(false);
      const [recipeToEdit, setRecipeToEdit] = useState(null);
      const [recipeToDelete, setRecipeToDelete] = useState(null);
      const [refreshData, setRefreshData] = useState(false); 
      const [categories,setCategories]=useState([]);
      const [userFavorites, setUserFavorites] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [ingredients,setIngredients]=useState([]);
    const [selectedIngredients,setSelectedIngredients]=useState([]);   
      const [searchParams,setSearchParams]=useSearchParams();
   
      const recipeSchema=Yup.object().shape({
        category:Yup.string(),
        ingredients:Yup.array()
      });

      const initialValues={
        category:searchParams.has('category')?searchParams.get('category'):'',
        ingredients: searchParams.has('ingredients')
        ?searchParams.get('ingredients').split(',').filter(Boolean):[]
      }
        const fetchRecipes = (filterOptions) => {
          return getRecipes(filterOptions)
            .then(([pagination, allRecipes]) => {
              setRecipes(allRecipes);
              setPaginationData(pagination);
              evaluateRecipes().then((averageRatings)=>{
                setRecipeAverageRating(averageRatings);
              });

              return allRecipes;
            })
            .catch((error) => {
              console.error(error);
              return []; 
            });
        };
        

  
    

    useEffect(()=>{
      fetchCategoriesData();
      fetchIngredientsData();
        fetchRecipes({
          category:searchParams.has('category')?searchParams.get('category'):'',
          ingredients: searchParams.has('ingredients') ? searchParams.get('ingredients').split(',') : null,
            });
      
           console.log('recipes:d',recipes);
    },[refreshData]);


    /*const evaluateRecipes = async () => {
      const filters = {
          rating: 0,
          recipeId: '',
          evaluatedBy: '',
          limit:'9999999'
      };

      const evaluationModels = await getEvaluations(filters);
     // console.log('eval: ', evaluationModels);
      const recipeRatings = new Map();

      for (const evaluation of evaluationModels) {
          const recipeId = evaluation.recipeId;
          //console.log("evaluation: ",evaluation);
          //console.log("evaluationSSSs",evaluationModels);
          //console.log("recipeId:",recipeId);

          if (!recipeRatings.has(recipeId)) {
              recipeRatings.set(recipeId, {
                  sum: 0,
                  count: 0
              });
          }

          const ratingInfo = recipeRatings.get(recipeId);
          if (ratingInfo) {
              ratingInfo.sum += evaluation.rating;
              ratingInfo.count++;
          }
      }

      const averageRatings = new Map();

      recipeRatings.forEach((ratingInfo, recipeId) => {
          const averageRating = ratingInfo.count > 0
              ? ratingInfo.sum / ratingInfo.count
              : 0;

          averageRatings.set(recipeId, averageRating);
      });

      setRecipeAverageRating(averageRatings);
  };*/

  const handlePageChange = async(newPage) => {
    setCurrentPage(newPage);
    //console.log("handlepagechange, newpage: ",newPage);
    fetchRecipes({
        page: newPage,
        limit: currentLimit,
    });
   
};


const handleLimitChange = (newValue) => {
    setCurrentLimit(newValue);
    //console.log("handlelimitchange: new value",newValue);
    fetchRecipes({
        limit: newValue,
        page: 1
    });
};

//handling page change
useEffect(()=>{

  if(searchParams.has('page')){
    handlePageChange(searchParams.get('page'));
  }
  if(searchParams.has('limit')){
    handleLimitChange(searchParams.get('limit'));
  }

},[searchParams]);

const formik = useFormik({
  initialValues,
  validationSchema: recipeSchema,
  validateOnBlur: true, 
  validateOnChange: true,

  onSubmit: async (values, { setStatus, setSubmitting }) => {
    try {
      if (values.category) {
        searchParams.set("category", values.category);
      } else {
        searchParams.delete("category");
      }

console.log("values.ingredients: ",values.ingredients);
      

if (values.ingredients && values.ingredients.length > 0) {
  // Filter out undefined values from the ingredients array
  const selectedIngredients = values.ingredients.filter((ingredient) => ingredient);

  // Extract the values from the selected options
  const ingredientIds = selectedIngredients.map((ingredient) => ingredient);

  // Update the searchParams with the new ingredients
  searchParams.set("ingredients", ingredientIds.join(','));

  // Update the selectedIngredients state
  setSelectedIngredients((prevValues) => [...prevValues, ...ingredientIds]);

  console.log("ingredientIds:", ingredientIds);
  console.log("searchparams: ",searchParams);
} else{
        searchParams.delete("ingredients");
      }
      console.log("searchParams:", searchParams.toString());

      setSearchParams(searchParams);
      fetchRecipes(values);
    } catch (error) {
      console.log(error);
    }
  }
  
});


const openEditModal=(recipe)=>{
  setRecipeToEdit(recipe);
  setEditModalOpen(true);
};

const openDeleteModal=(recipe)=>{
  setRecipeToDelete(recipe);
  setDeleteModalOpen(true);
  //console.log("opendeletemode");
  //.log("recipe in opendeletemodal",recipe);
};

const closeModals=()=>{
  setEditModalOpen(false);
  setDeleteModalOpen(false);
};

const fetchCategoriesData = async () => {
  try {
    const [_, categoryList] = await getCategories();
    setCategories(categoryList);
   // console.log('Categories list:', categoryList);

  } catch (error) {
    console.error("Error fetching categories", error);
  }
};


const fetchIngredientsData = async () => {
  try {
   
    const [_, ingredientList] = await getIngredients();
    setIngredients(ingredientList);
    //console.log('Ingredients list:', ingredientList);

  } catch (error) {
    console.error("Error fetching ingredients", error);
  }
};

const ingredientOptions = ingredients.map((ingredient) => ({
  value: ingredient.id,
  label: ingredient.name,
  key:ingredient.id
}));


const saveEditedRecipe=async()=>{
  if(recipeToEdit){
    //await updateRecipe();
    setRefreshData(!refreshData);
    navigate('/recipes');
  }
};

const handleDeleting=async()=>{
  if (recipeToDelete) {
    const recipeId = recipeToDelete.id;
    await deleteRecipe(recipeId);
    //console.log("recipeid in handle deleting", recipeId);
    setRefreshData(!refreshData);
    navigate('/recipes');
  }
};

const handleSearch = () => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set("search", searchTerm);
 
  navigate(`?${newSearchParams.toString()}`);
  
  fetchRecipes({ title: searchTerm });
};



    
      useEffect(() => {
        if (currentUser && currentUser.favorites) {
         // console.log("currentuser: ", currentUser);
          //console.log("userfavorites: ", currentUser.favorites);
          const favoritesArray = Object.keys(currentUser.favorites);
          setUserFavorites(favoritesArray);
          //console.log("userfavorites useeffect",userFavorites);
        }
        
      }, [currentUser?.favorites]);
   
  



const [favorites, setFavorites] = useState(new Set());

useEffect(() => {
  const fetchUserFavorites = async () => {
    try {
      if (currentUser && currentUser.favorites) {
        const favoritesArray = Object.keys(currentUser.favorites);
        setFavorites(new Set(favoritesArray));
       // console.log("userfavorites useeffect", favoritesArray);
      }
    } catch (error) {
      console.error('Error fetching user favorites', error);
    }

    if(currentUser){
      fetchUserFavorites();
    }
  };

}, [currentUser]);

const handleClearIngredients = () => {
  // Clear the selected ingredients in the state
  setSelectedIngredients([]);

  // Clear the selected ingredients in Formik's state
  formik.setFieldValue("ingredients", []);
};


const toggleFavorite = async (recipeId) => {
  try {
    const isFavorite = favorites.has(recipeId);

    if (isFavorite) {
      await removeFromFavorites(currentUser.id.toLocaleString(), recipeId);
    } else {
      await addToFavorites(currentUser.id, recipeId);
    }

    setUserFavorites((prevFavorites) => {
      if (isFavorite) {
        return prevFavorites.filter((id) => id !== recipeId);
      } else {
        return [...prevFavorites, recipeId];
      }
    });

  
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (isFavorite) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  } catch (error) {
    console.error('Error toggling favorite', error);
  }
};



    return(
      <React.Fragment>
        <form
         style={{ marginTop: '8rem' ,marginLeft:"1%",marginRight:"1%"}} 
         className="form default-border p-3 bg-white"
          noValidate 
          onSubmit={formik.handleSubmit} >
            <div className="row">
              <div className="col-md-4">
              <div className='fv-row mb-7 d-flex align-items-center'>
                    <select
  {...formik.getFieldProps('category')}
  className='form-select form-select-md mx-1 my-1'
>
  <option value="">Choose category</option> 
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>

                
                </div>
              </div>

              <div className="col-md-4">
              <div className="fv-row  d-flex align-items-center">
               
               <Select
              
 className="w-100 text-dark mx-1 my-1"
 options={ingredientOptions}
 {...formik.getFieldProps("ingredients")}
 placeholder="Search or select ingredients"
 isMulti
 onMenuClose={() => handleClearIngredients()}
 onChange={(selectedOptions) => {
   // Extracting values from selected options
   const selectedValues = selectedOptions
   ? selectedOptions.map((option) => option.value).filter(Boolean)
   : [];

   // Update the selectedIngredients state using the functional form
   setSelectedIngredients((prevValues) => [...prevValues, ...selectedValues]);

   // Update the formik field value using the spread operator
   formik.setFieldValue("ingredients", [...formik.values.ingredients, ...selectedValues]);

   // Additional logic if needed
   console.log("Selected Ingredients:", selectedValues);
 }}
/>        
        

              </div>

             
              
          </div>
          <div className="col-md-4  d-flex align-items-center">
                  <button
                  className="btn btn-md default-button p-2 mx-1 my-1"
                  type="submit">Filter Recipes</button>
                </div>


              </div>
          

                <div>
                <input
          type="text"
          className="form-control form-control-md mx-1 my-1"
          placeholder="Search recipes"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(); 
          }}
        />
       
        <button
        className="btn btn-md green-button mx-1 my-1 p-2" 
        type="button"
         onClick={handleSearch}>Search</button>
                </div>

        </form>
        <div  style={{ marginTop: '5%' }}>
            <Row className="">
            {recipes.length > 0 ? (
         recipes.map((recipe) => (
          <Col className="my-2" key={recipe.id} xs={12} md={6}>
            <Card
            className="p-3 default-border mt-10 "
            style={{ marginTop: '1%',marginLeft:'1%',marginRight:'1%'}}>
            
              <Card.Body>
                {currentUser?(
                 <div className="d-flex justify-content-end align-items-end">
                <button onClick={() => toggleFavorite(recipe.id)}>
  {userFavorites.includes(recipe.id) ? (
    <FontAwesomeIcon icon={faHeart} color="red" fontSize={20} cursor="pointer" />
  ) : (
    <FontAwesomeIcon icon={faHeart} color="dark" fontSize={20} cursor="pointer" />
  )}
</button>



                 </div>
                 ):null}
              {currentUser &&currentUser.role=="admin"?(
                 <React.Fragment>
                   <div className="d-flex justify-content-between align-items-center">
                  <button 
                  onClick={()=>openEditModal(recipe)}
                  className="btn btn-lg default-button"
                  >
                    Edit
                  </button>
                  <button 
                  onClick={()=>openDeleteModal(recipe)}
                  className="btn btn-lg green-button"
                  >
                    Delete
                  </button>
                </div>
                {deleteModalOpen&&(
                  <DeleteConfirmationModal
                  item={recipe}
                  closeModal={closeModals}
                  onDelete={()=>{handleDeleting()}}
                  onShow={deleteModalOpen}
                  />
                )}
                {editModalOpen&&(
                  <EditRecipe
                  recipe={recipe}
                  onRecipeSubmit={saveEditedRecipe}
                  onCancel={closeModals}
                  />
                )}
                  </React.Fragment>
              ):null}
              <div className="image-container  d-flex align-items-center justify-content-center">
              <RecipePicture 
              src={recipe.picture} 
              alt={recipe.title} 
              width="25em"
              height="20em"
              objectFit="cover"/>
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

       ):(<p>No recipes available</p>)}

      </Row>
      <Pagination
                paginationData={paginationData}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
            
        </div>
        </React.Fragment>
    );
};

export default DisplayRecipes;



