import React,{useState} from "react";
import clsx from 'clsx';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import { createIngredient } from "../services/ingredient.service";
import { IngredientModel } from "../models/ingredient.model";
import { useAuth } from "../auth";
import ModalComponent from "../modals/ModalComponent";
import { showErrorMessage } from "../message/errorMessage";
import { showSuccessMessage } from "../message/successMessage";
import "../css/components.css";

const AddIngredient=()=>{

    const [isModalOpen,setIsModalOpen]=useState(false);

    const toggle=()=>setIsModalOpen(!isModalOpen);

    const handleShowingModal=(e)=>{
        e.preventDefault();
        setIsModalOpen(true);
    };


    const manageIngredientsSchema=Yup.object().shape({
        name:Yup.string().required('Name is required!'),
        calories:Yup.number().required("Calories required!"),
        vegan:Yup.boolean().required('You must choose whether this ingredient is vegan or not!'),
        glutenFree:Yup.boolean().required('You must choose whether this ingredient is gluten free or not!'),
        vegetarian:Yup.boolean().required('You must choose whether this ingredient is vegetarian or not!'),
        halal:Yup.boolean().required('You must choose whether this ingredient is halal or not.'),
        kosher:Yup.boolean().required('You must choose whether this ingredient is kosher or not.')
    });

    const initialValues={
        name:'',
        calories:'0',
        vegan:null,
        glutenFree:null,
        vegetarian:null,
        halal:null,
        kosher:null
    };

    const [loading,setLoading]=useState(false);
    const [isFormSubmitted,setFormSubmitted]=useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema: manageIngredientsSchema,
        validateOnBlur: true, // Enable validation on blur
        validateOnChange: true,

        onSubmit: async (values, {setStatus, setSubmitting}) => {
           
        }
    })

    const saveData=async()=>{
        setLoading(true);
        setError(null);
        setFormSubmitted(true);
        try {
            const newIngredient=new IngredientModel(formik.values);
            const createdIngredient=await createIngredient(newIngredient);
            console.log('created ingredient data: ',createdIngredient);
            setIsModalOpen(false);
            formik.resetForm();
            showSuccessMessage('Ingredient successfully created!');
            
        } catch(error){
            console.log(error);
            setLoading(false);
            showErrorMessage('Failed to create ingredient!!!');
        }
    }
    

    return(
        <div className="d-flex justify-content-center align-items-center">
        <div className="col-lg-8 col-md-10 col-sm-12 mx-auto ">
          <form
            style={{marginTop:"7rem"}} 
           className="form  default-border p-3 bg-white" 
           noValidate 
           onSubmit={handleShowingModal} 
           id="cooke_ingredient_form">
            <h1 className="text-center text-dark">Add Ingredient</h1>
            <div className='fv-row mb-7'>
            <label className='form-label fs-6 fw-bolder text-dark'>Name{<span
                                className="required purple-text"> *</span>}
                                </label>  
              <input
                placeholder='Enter name'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('name')}
                className={clsx(
                  'form-control form-control-lg',
                  { 'is-invalid': formik.touched.name && formik.errors.name },
                  {
                    'is-valid': formik.touched.name && !formik.errors.name,
                  }
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <div className='fv-plugins-message-container text-danger'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className='fv-row mb-7'>
            <label className='form-label fs-6 fw-bolder text-dark'>Calories (per 100g){<span
                                className="required purple-text"> *</span>}
                                </label>  
              <input
                placeholder='Enter calories'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('calories')}
                className={clsx(
                  'form-control form-control-lg',
                  { 'is-invalid': formik.touched.calories && formik.errors.calories },
                  {
                    'is-valid': formik.touched.calories && !formik.errors.calories,
                  }
                )}
              />
              {formik.touched.calories && formik.errors.calories && (
                <div className='fv-plugins-message-container text-danger'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.calories}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="fv-row mb-7">
            <label className='form-label fs-6 fw-bolder text-dark'>Vegan{<span
                                className="required purple-text"> *</span>}
                                </label>  
  <div className="d-flex justify-content-between">
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="vegan"
        value="true"
        checked={formik.values.vegan === true}
        onChange={() => formik.setFieldValue('vegan', true)}
      />
      <label className="form-check-label">Yes</label>
    </div>
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="vegan"
        value="false"
        checked={formik.values.vegan === false}
        onChange={() => formik.setFieldValue('vegan', false)}
      />
      <label className="form-check-label">No</label>
    </div>
  </div>
  {formik.touched.vegan && formik.errors.vegan && (
    <div className="fv-plugins-message-container text-danger">
      <div className="fv-help-block">
        <span role="alert">
          {formik.values.vegan === null ? (
            <p>You must choose whether this ingredient is vegan or not!</p>
          ) : null}
        </span>
      </div>
    </div>
  )}
</div>

<div className="fv-row mb-7">
<label className='form-label fs-6 fw-bolder text-dark'>Gluten Free{<span
                                className="required purple-text"> *</span>}
                                </label>  
  <div className="d-flex justify-content-between">
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="glutenFree"
        value="true"
        checked={formik.values.glutenFree === true}
        onChange={() => formik.setFieldValue('glutenFree', true)}
      />
      <label className="form-check-label">Yes</label>
    </div>
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="glutenFree"
        value="false"
        checked={formik.values.glutenFree === false}
        onChange={() => formik.setFieldValue('glutenFree', false)}
      />
      <label className="form-check-label">No</label>
    </div>
  </div>
  {formik.touched.glutenFree && formik.errors.glutenFree && (
    <div className="fv-plugins-message-container text-danger">
      <div className="fv-help-block">
        <span role="alert">
          {formik.values.glutenFree === null ? (
            <p>You must choose whether this ingredient is gluten free or not!</p>
          ) : null}
        </span>
      </div>
    </div>
  )}
</div>

<div className="fv-row mb-7">
<label className='form-label fs-6 fw-bolder text-dark'>Vegetarian{<span
                                className="required purple-text"> *</span>}
                                </label>  
  <div className="d-flex justify-content-between">
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="vegetarian"
        value="true"
        checked={formik.values.vegetarian === true}
        onChange={() => formik.setFieldValue('vegetarian', true)}
      />
      <label className="form-check-label">Yes</label>
    </div>
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="vegetarian"
        value="false"
        checked={formik.values.vegetarian === false}
        onChange={() => formik.setFieldValue('vegetarian', false)}
      />
      <label className="form-check-label">No</label>
    </div>
  </div>
  {formik.touched.vegetarian && formik.errors.vegetarian && (
    <div className="fv-plugins-message-container text-danger">
      <div className="fv-help-block">
        <span role="alert">
          {formik.values.vegetarian === null ? (
            <p>You must choose whether this ingredient is vegetarian or not!</p>
          ) : null}
        </span>
      </div>
    </div>
  )}
</div>

<div className="fv-row mb-7">
<label className='form-label fs-6 fw-bolder text-dark'>Halal{<span
                                className="required purple-text"> *</span>}
                                </label>  
  <div className="d-flex justify-content-between">
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="halal"
        value="true"
        checked={formik.values.halal === true}
        onChange={() => formik.setFieldValue('halal', true)}
      />
      <label className="form-check-label">Yes</label>
    </div>
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="halal"
        value="false"
        checked={formik.values.halal === false}
        onChange={() => formik.setFieldValue('halal', false)}
      />
      <label className="form-check-label">No</label>
    </div>
  </div>
  {formik.touched.halal && formik.errors.halal && (
    <div className="fv-plugins-message-container text-danger">
      <div className="fv-help-block">
        <span role="alert">
          {formik.values.halal === null ? (
            <p>You must choose whether this ingredient is halal or not!</p>
          ) : null}
        </span>
      </div>
    </div>
  )}
</div>

<div className="fv-row mb-7">
<label className='form-label fs-6 fw-bolder text-dark'>Kosher{<span
                                className="required purple-text"> *</span>}
                                </label>  
  <div className="d-flex justify-content-between">
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="kosher"
        value="true"
        checked={formik.values.kosher === true}
        onChange={() => formik.setFieldValue('kosher', true)}
      />
      <label className="form-check-label">Yes</label>
    </div>
    <div className="form-check form-check-inline">
      <input
        type="radio"
        className="form-check-input"
        name="kosher"
        value="false"
        checked={formik.values.kosher === false}
        onChange={() => formik.setFieldValue('kosher', false)}
      />
      <label className="form-check-label">No</label>
    </div>
  </div>
  {formik.touched.kosher && formik.errors.kosher && (
    <div className="fv-plugins-message-container text-danger">
      <div className="fv-help-block">
        <span role="alert">
          {formik.values.kosher === null ? (
            <p>You must choose whether this ingredient is kosher or not!</p>
          ) : null}
        </span>
      </div>
    </div>
  )}
</div>

<br/>
            <div className='text-center'>
              <button
                type="submit"
                id='cooke_add_ingredient_submit'
                className='btn btn-lg default-button w-100  mb-2'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <ModalComponent
          show={isModalOpen}
          onHide={toggle}
          modalTitle="Confirmation"
        >
          <p>Are you sure you want to save meal data?</p>
          <div className='d-flex align-items-center justify-content-center'>
            <button
              type='button'
              onClick={saveData}
              id='cooke_ingredient_modal_submit'
              className='btn btn-lg default-button w-100'
            >
              Submit
            </button>
            <button
              type='button'
              id='cooke_ingredient_modal_cancel'
              className='btn btn-lg w-100'
            >
              Cancel
            </button>
          </div>
        </ModalComponent>
      </div>
      
    );
};

export default AddIngredient;