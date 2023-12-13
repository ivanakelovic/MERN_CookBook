import React,{useState} from "react";
import clsx from 'clsx';
import * as Yup from 'yup';
import {useFormik} from 'formik'

import { showErrorMessage } from "../../message/errorMessage";
import { EvaluationModel } from "../../models/evaluation.model";
import { useAuth } from "../../auth";

const AddComent=({recipe,onCommentSubmit,closeModal})=>{

    const [loading,setLoading]=useState(false);
    const [isFormSubmitted,setFormSubmitted]=useState(false);
    const [error, setError] = useState('');

    const {currentUser,logout}=useAuth();

    const evaluationsSchema=Yup.object().shape({
        rating:Yup.number()
        .positive()
        .min(1,'Minimum rating is 1')
        .max(5,'Maximum rating is 5')
        .required('Rating is required!'),
        comment:Yup.string().required('Comment is required!'),
        recipeId:Yup.string(),
        evaluatedBy:Yup.string()
    });

    const initialValues={
        rating:0,
        comment:''
    };

    const formik=useFormik({
        initialValues,
        validationSchema:evaluationsSchema,
        validateOnBlur:true,
        validateOnChange:true,
        onSubmit:async(values,{setStatus,setSubmitting})=>{
            setLoading(true);
            setError(null);
            setFormSubmitted(true);
            try{
                const newEvaluation=new EvaluationModel({
                    rating:values.rating,
                    comment:values.comment,
                    recipeId:recipe.id,
                    evaluatedBy:currentUser.id

                });

              //  const createdComment=await createEvaluation(newEvaluation);
                //console.log('created comment: ',createdComment);
              //  showSuccessMessage('Comment successfully created!!!');
              onCommentSubmit(newEvaluation);

            }catch(error){
                console.log('error',error);
                setLoading(false);
                showErrorMessage('Failed to create a comment!!!');
            }
        }
    })


    return(
        <div className="d-flex justify-content-center">
            <div className="col-lg-8 col-md-10 col-sm-12 mx-auto">
                <form
                onSubmit={(e)=>{
                    e.preventDefault();
                    formik.handleSubmit();
                }}
                  className="form w-1000"
                  style={{width:"100%"}}
                  noValidate
                  id="add_comment_form"
                >
                
                    <div>
                    <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Rating{<span
                                className="required purple-text"> *</span>}
                                </label>  
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter rating'
                        type='number'
                        {...formik.getFieldProps('rating')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.rating && formik.errors.rating},
                            {
                                'is-valid': formik.touched.rating && !formik.errors.rating,
                            }
                        )}
                    />
                    {formik.touched.rating && formik.errors.rating && (
                        <div className='fv-plugins-message-container text-danger'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.rating}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className='fv-row mb-7'>
                <label className='form-label fs-6 fw-bolder text-dark'>Comment{<span
                                className="required purple-text"> *</span>}
                                </label>  
                                <textarea
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Enter comment'
                        id="comment"
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

              <div className="mt-3 d-flex justify-content-between align-items-center">
              <button
                        type="submit"
                        id='comment_submit'
                        className='btn btn-lg default-button p-2'
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                    Submit
                    </button>
                    <button
                    id='comment_cancel'
                    className="btn btn-lg green-button p-2"
                    onClick={closeModal}>
                        Cancel
                    </button>
              </div>
                  
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddComent;