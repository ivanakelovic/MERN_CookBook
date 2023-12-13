import React,{useState} from "react";
import clsx from 'clsx';
import * as Yup from 'yup';
import {useFormik} from 'formik'
import { RecipeModel } from "../../models/recipe.model";
import { useAuth } from "../../auth";
import { showErrorMessage } from "../../message/errorMessage";

const EditRecipe=({recipe,onRecipeSubmit,onCancel})=>{

    const [loading,setLoading]=useState(false);
    const [isFormSubmitted,setFormSubmitted]=useState(false);
    const [error, setError] = useState('');

    const {currentUser,logout}=useAuth();

    const manageRecipesSchema = Yup.object().shape({
        title: Yup.string().required("Title is required!"),
        category: Yup.string().required("Category is required!"),
        preparationMethod: Yup.string().required('Preparation method is required!'),
        preparationTime: Yup.number().positive().required('Preparation time is required!'),
        portionsNumber: Yup.number().required('Portions number is required!'),
        picture: Yup.mixed().required("Picture is required!"),
        comment: Yup.string(),
        ingredients: Yup.array().of(
          Yup.object().shape({
            ingredientId: Yup.string().required("Ingredient is required!"),
            measure: Yup.string().required("Measure is required!"),
          }),
        ),
      });
      


    const initialValues={
        title:'',
        ingredients:'',
        category:'',
        preparationMethod:'',
        preparationTime:'0',
        portionsNumber:'0',
        picture:'',
        comment:''
    };

    const formik = useFormik({
        initialValues,
        validationSchema: manageRecipesSchema,
        validateOnBlur: true, // Enable validation on blur
        validateOnChange: true,

        onSubmit: async (values, {setStatus, setSubmitting}) => {
           
          setLoading(true);
          setError(null);
          setFormSubmitted(true);
          try {
  
            console.log('onsubmit');
            const formData = new FormData();
            formData.append('picture', values.picture);
            
                console.log('uploaded doc', values.picture);

                formData.append('createdBy', currentUser.id.toString());

                for (var key of formData.entries()) {
                  console.log(key[0] + ", " + key[1]);
              }
             
           
  
             
          } catch(error){
              console.log(error);
              setLoading(false);
              showErrorMessage("Failed to update a recipe!!!");
          }
        }
    });


    return(
        <div>

        </div>
    );
};

export default EditRecipe;