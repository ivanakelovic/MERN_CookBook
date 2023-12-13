import React,{useState,useEffect} from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { createRecipe } from "../services/recipe.service";
import { useAuth } from "../auth";
import ModalComponent from "../modals/ModalComponent";
import { showErrorMessage } from "../message/errorMessage";
import { showSuccessMessage } from "../message/successMessage";
import "../css/components.css";
import { RecipeModel } from "../models/recipe.model";
import { getCategories } from "../services/category.service";
import { getIngredients } from "../services/ingredient.service";
import IngredientRow from "./pageComponents/IngredientRow";
import { createFile, getFiles } from "../services/file.service";

const AddRecipe=()=>{

    const [isModalOpen,setIsModalOpen]=useState(false);
    const [categories,setCategories]=useState([]);
    const [ingredientsList,setIngredientsList]=useState([]);
    const [ingredientRows, setIngredientRows] = useState([{ ingredient: "", measure: "" }]);
    const [loading,setLoading]=useState(false);
    const [isFormSubmitted,setFormSubmitted]=useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState("");

    const [picture,setPicture]=useState('');
    const {currentUser,logout}=useAuth();


    const addIngredientRow = () => {
      setIngredientRows([...ingredientRows, { ingredient: "", measure: "" }]);
      formik.setFieldValue('ingredients', [
        ...formik.values.ingredients,
        { ingredient: "", measure: "" }
      ]);
    };
    
    
    
      
      const removeIngredientRow = (index) => {
        const updatedRows = [...ingredientRows];
        updatedRows.splice(index, 1);
        setIngredientRows(updatedRows);
      };
      
     
      const handleIngredientChange = (index, ingredient) => {
        const updatedIngredients = [...formik.values.ingredients];
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          ingredient: ingredient.toString(), 
        };
        formik.setFieldValue('ingredients', updatedIngredients);
      };
      
      
      
      const handleMeasureChange = (index, measure) => {
        const updatedIngredients = [...formik.values.ingredients];
        updatedIngredients[index] = {
          ...updatedIngredients[index], 
          measure: measure,
        };
        formik.setFieldValue('ingredients', updatedIngredients);
      };
      
      
      
       

      useEffect(() => {
        fetchIngredientsData();
        fetchCategoriesData();
      }, []);

      const fetchIngredientsData = async () => {
        try {
          const filter={
            limit:999999
          }
         
          const [_, ingredientList] = await getIngredients(filter);
          setIngredientsList(ingredientList);
          //console.log('Ingredients list:', ingredientList);
    
        } catch (error) {
          console.error("Error fetching ingredients", error);
        }
      };

      const fetchCategoriesData = async () => {
        try {
          const filter={
          limit:9999999
          }
          const [_, categoryList] = await getCategories(filter);
          setCategories(categoryList);
          //console.log('Categories list:', categoryList);
    
        } catch (error) {
          console.error("Error fetching categories", error);
        }
      };
      
      

    const toggle=()=>setIsModalOpen(!isModalOpen);

    const handleShowingModal=(e)=>{
        e.preventDefault();
        setIsModalOpen(true);
    };

    const filteredIngredients = ingredientsList.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const manageRecipesSchema = Yup.object().shape({
        title: Yup.string().required("Title is required!"),
        category: Yup.string().required("Category is required!"),
        preparationMethod: Yup.string().required('Preparation method is required!'),
        preparationTime: Yup.number().positive().required('Preparation time is required!'),
        portionsNumber: Yup.number().required('Portions number is required!'),
        picture: Yup.mixed().required("Picture is required!"),
        comment: Yup.string(),
        ingredients: Yup.array().of(
          Yup.string().required("Ingredient is required!")
      ),
      
      });
      


    const initialValues={
        title:'',
        ingredients: [],
        category:'',
        preparationMethod:'',
        preparationTime:'0',
        portionsNumber:'0',
        picture:null,
        comment:''
    };

    const formik = useFormik({
        initialValues,
        validationSchema: manageRecipesSchema,
        validateOnBlur: true, // Enable validation on blur
        validateOnChange: true,

        onSubmit: async (values, {setStatus, setSubmitting}) => {
           
        }
    });


   


    const saveData=async(e)=>{
      e.preventDefault();
        setLoading(true);
        setError(null);
        setFormSubmitted(true);
        try {
          console.log("ingredients formik: ",formik.values.ingredients);
          //setIsModalOpen(false);
          const formData=new FormData();
          formData.append('picture',formik.values.picture);
          //console.log('uploaded picture: ',formik.values.picture);

          formData.append('createdBy',currentUser.id.toString());
          const savedFile=await createFile(formData);

         // console.log('funckija createfile: ',await createFile(formData));
          console.log('saved file: ',savedFile);
          const files=await getFiles();

          const lastUploadedFile=files[files.length-1];
          //console.log('Last Uploaded File:', lastUploadedFile);
            //    console.log('last id ', lastUploadedFile.id);
        
              // console.log("values: ",formik.values);
           if(lastUploadedFile){
            const newRecipe=new RecipeModel(
              {
                title:formik.values.title,
                ingredients: formik.values.ingredients.map((ingredient) => ({
                  ingredient: ingredient.ingredient,
                  measure: ingredient.measure,
                })),
              postedBy:currentUser.id,
              category:formik.values.category,
              preparationMethod:formik.values.preparationMethod,
              preparationTime:formik.values.preparationTime,
              portionsNumber:formik.values.portionsNumber,
              picture:lastUploadedFile.id,
              comment:formik.values.comment
              });
              console.log("formik values: ",formik.values.ingredients);
              console.log("new recipe model: ",newRecipe);
            const createdRecipe=await createRecipe(newRecipe);
           
            console.log('created recipe data: ',createdRecipe);
            console.log("new recipe model: ",newRecipe);
            console.log("xoxxixixi");
            if (createdRecipe) {
              setIsModalOpen(false);
              formik.resetForm();
              showSuccessMessage('Recipe successfully created!');
            } else {
              // Handle error case
              setLoading(false);
              showErrorMessage('Failed to create recipe!!!');
            }
            
            //showSuccessMessage('Recipe successfully created!');
           // setIsModalOpen(false);
            //formik.resetForm();
            //showSuccessMessage('Recipe successfully created!');
           }
        } catch(error){
            console.log(error);
            setLoading(false);
            showErrorMessage('Failed to  create recipe!!!');
        }
    }

    return(
        <div className="d-flex justify-content-center align-items-center">
           <div className="col-lg-10 col-md-10 col-sm-12 mx-auto">
           <form 
           style={{ marginTop: '6rem' }} 
           className="form default-border p-3 mt-sm-10 mt-6 mt-md-7 bg-white"
            noValidate 
            onSubmit={saveData} 
           id="cooke_recipe_form"
           encType='multipart/form-data'
           >
             <h1 className="text-center text-dark">Add Recipe</h1>
          
            <div className="row">
              <div className="col-md-6">
              <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Title{<span
                                className="required purple-text"> *</span>}
                                </label>  
                                <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter title'
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('title')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.title && formik.errors.title},
                            {
                                'is-valid': formik.touched.title && !formik.errors.title,
                            }
                        )}
                    />
                    {formik.touched.title && formik.errors.title && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.title}</span>
                            </div>
                        </div>
                    )}
                </div>
                </div>
                <div className="col-md-6">
                <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Category{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <select
  {...formik.getFieldProps('category')}
  className={clsx(
    'form-select form-select-lg',
    {
      'is-invalid': formik.touched.category && formik.errors.category,
    },
    {
      'is-valid': formik.touched.category && !formik.errors.category,
    }
  )}
>
  <option value="">Select a category</option> {/* Initial placeholder */}
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>

{formik.touched.category && formik.errors.category && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.category}</span>
                            </div>
                        </div>
                    )}

                </div>
                </div>
            </div>

            <div className="row">
              <div className="col-md-12">
              <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Ingredients{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    {ingredientRows.map((ingredientRow, index) => (
  <IngredientRow
  key={index}
  index={index}
  ingredients={filteredIngredients}
  formik={formik}
  onIngredientChange={(ingredient) => handleIngredientChange(index, ingredient)}
  onMeasureChange={(measure) => handleMeasureChange(index, measure)}
  onRemove={() => removeIngredientRow(index)}
/>

))}
<button 
type="button"
className="btn btn-md green-button"
onClick={addIngredientRow}
>Add Ingredient</button>



                 </div>
              </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Preparation Time{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter preparation time'
                        type='number'
                        autoComplete='off'
                        {...formik.getFieldProps('preparationTime')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.preparationTime && formik.errors.preparationTime},
                            {
                                'is-valid': formik.touched.preparationTime && !formik.errors.preparationTime,
                            }
                        )}
                    />
                    {formik.touched.preparationTime && formik.errors.preparationTime && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.preparationTime}</span>
                            </div>
                        </div>
                    )}
                </div>
                </div>

                <div className="col-md-6">
                <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Portions Number{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter portionsNumber'
                        type='number'
                        autoComplete='off'
                        {...formik.getFieldProps('portionsNumber')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.portionsNumber && formik.errors.portionsNumber},
                            {
                                'is-valid': formik.touched.portionsNumber && !formik.errors.portionsNumber,
                            }
                        )}
                    />
                    {formik.touched.portionsNumber && formik.errors.portionsNumber && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.portionsNumber}</span>
                            </div>
                        </div>
                    )}
                </div>

                </div>
              </div>
               

                      <div className="row">
                        <div className="col-md-12">
                            
                <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Preparation Method{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <textarea
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter preparation method'
                        id="preparationMethod"
                        autoComplete='off'
                        {...formik.getFieldProps('preparationMethod')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.preparationMethod && formik.errors.preparationMethod},
                            {
                                'is-valid': formik.touched.preparationMethod && !formik.errors.preparationMethod,
                            }
                        )}
                    />
                    {formik.touched.preparationMethod && formik.errors.preparationMethod && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.preparationMethod}</span>
                            </div>
                        </div>
                    )}
                </div>

                        </div>
                        </div>

                        <div className="row">
                          <div className="col-md-12">
                          <div className=' fv-row mb-10'>

<label className='form-label fs-6 fw-bolder text-dark'>Picture:{<span
    className="required"></span>}</label>
<input
    type="file"
    name='picture'
    id="picture"
    
    multiple={false}
    onChange={(event) => {
      formik.setFieldValue('picture', event.currentTarget.files[0]);
    }}
    onBlur={formik.handleBlur}
    className={clsx(
        'form-control form-control-lg form-control-solid',

        {'is-invalid border border-danger': (formik.touched.picture || isFormSubmitted) && formik.errors.picture},
        {'is-valid border border-success': (formik.touched.picture || isFormSubmitted) && !formik.errors.picture}
    )}
/>
{formik.touched.picture && formik.errors.picture && (
    <div className='fv-plugins-message-container'>
<span className='text-danger' role='alert'>

</span>
    </div>
)}
</div>

                          </div>

                        </div>

                      <div className="row">
                        <div className="col-md-12">
                        <div className='fv-row mb-7'>
                    <label className='form-label fw-bolder text-dark fs-6 mt-100'>
                        Comment {<span
                                className="required"></span>}
                    </label>
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter comment'
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('comment')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.comment && formik.errors.comment},
                            {
                                'is-valid': formik.touched.comment && !formik.errors.comment,
                            }
                        )}
                    />
                    {formik.touched.comment && formik.errors.comment && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.comment}</span>
                            </div>
                        </div>
                    )}
                </div>
                        </div>
                      </div>



                      <div className="row">
                      <div className='text-center'>
              <button
                type="submit"
                id='cooke_add_recipe_submit'
                className='btn btn-lg mt-2 default-button w-100  mb-2'
               
              >
                Submit
              </button>
            </div>
                        </div>


            </form>
            </div>

            <ModalComponent
          show={isModalOpen}
          onHide={toggle}
          modalTitle="Confirmation"
        >
          <p>Are you sure you want to save this recipe?</p>
          <div className='d-flex align-items-center justify-content-center'>
            <button
              type='button'
              onClick={saveData}
              id='cooke_recipe_modal_submit'
              className='btn btn-lg default-button w-100'
            >
              Submit
            </button>
            <button
              type='button'
              id='cooke_recipe_modal_cancel'
              className='btn btn-lg w-100'
              onClick={toggle}
            >
              Cancel
            </button>
          </div>
        </ModalComponent>
        </div>
    );
};

export default AddRecipe; 