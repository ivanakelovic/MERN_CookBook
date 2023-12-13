import React,{useState} from "react";
import clsx from 'clsx';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {createCategory} from "../services/category.service";
import { CategoryModel } from "../models/category.model";
import ModalComponent from "../modals/ModalComponent";
import { showErrorMessage } from "../message/errorMessage";
import { showSuccessMessage } from "../message/successMessage";

const AddMealCategory=()=>{

    const [isModalOpen,setIsModalOpen]=useState(false);

    const toggle=()=>setIsModalOpen(!isModalOpen);

    const handleShowingModal=(e)=>{
        e.preventDefault();
        setIsModalOpen(true);
    };

    const manageCategoriesSchema=Yup.object().shape({
        name:Yup.string().required('Name is required!'),
        description:Yup.string().required('Description is required!')
    });

    const initialValues={
        name:'',
        description:''
    };

    const [loading,setLoading]=useState(false);
    const [isFormSubmitted,setFormSubmitted]=useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema: manageCategoriesSchema,
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
            const newCategory=new CategoryModel(formik.values);
            const createdCategory=await createCategory(newCategory);
            console.log('created category data: ',createdCategory);
            setIsModalOpen(false);
            formik.resetForm();
            showSuccessMessage('Meal category successfully created!');
        } catch(error){
            console.log(error);
            setLoading(false);
            showErrorMessage('Failed to create meal category!!!');
        }
    }
    

    return(
        <div className="d-flex align-items-center justify-content-center">
            <div className="col-lg-10 col-md-10 col-sm-12"
             >
                <form
                style={{marginTop:"10rem"}}
                  className="form w-100 default-border p-3 bg-white"
                noValidate
                onSubmit={handleShowingModal}
                id="cooke_category_form"
                >
                <h1 className="text-center text-dark">
                    Add Meal Category
                </h1>

                <div>
                <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Name{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter name'
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('name')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.name && formik.errors.name},
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
                <label className='form-label fs-6 fw-bolder text-dark'>Description{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter description'
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('description')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.description && formik.errors.description},
                            {
                                'is-valid': formik.touched.description && !formik.errors.description,
                            }
                        )}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.description}</span>
                            </div>
                        </div>
                    )}
                </div>
                        <br/>
                <div className='text-center'>
                    <button
                        type="submit"
                        id='cooke_add_category_submit'
                        className='btn btn-lg default-button w-100  mb-2'
                        disabled={formik.isSubmitting || !formik.isValid}
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
                    <p>
                        Are you sure you want to save meal data?
                    </p>
                    <div className='d-flex align-items-center justify-content-center'>
                      <button
                        type='button'
                        onClick={saveData}
                        id='cooke_category_modal_submit'
                        className='btn btn-lg default-button w-100'
                      >
                        Submit
                      </button>
                      <button
                        type='button'
                        id='cooke_category_modal_cancel'
                        className='btn btn-lg w-100'
                      >
                        Cancel
                      </button>
                    </div>
                  
            
               
                </ModalComponent>
        </div>
    );
};

export default AddMealCategory;