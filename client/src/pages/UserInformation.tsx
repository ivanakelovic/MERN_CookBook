import React,{useState,useEffect} from "react";
import { useAuth } from "../auth";
import { updateUser } from "../services/user.service";
import {useFormik} from "formik";
import * as Yup from 'yup';
import clsx from 'clsx';
import { getFile,getFiles,createFile } from "../services/file.service";
import "../css/components.css";
import RecipePicture from "./pageComponents/RecipePicture";
import { showSuccessMessage } from "../message/successMessage";
import { showErrorMessage } from "../message/errorMessage";

const UserInformation=()=>{
    const [isEditMode,setIsEditMode]=useState(false);
    const [uploadedPicture,setUploadedPicture]=useState(null);
    const [picture, setPicture] = useState(null);

    const {currentUser,logout}=useAuth();

    const userSchema=Yup.object().shape({
        firstName: Yup.string(),
        lastName: Yup.string(),
        email: Yup.string()
            .email('Wrong email format')
            .min(3, 'Minimum 3 symbols')
            .max(50, 'Maximum 50 symbols'),
        password: Yup.string()
            .min(3, 'Minimum 3 symbols')
            .max(50, 'Maximum 50 symbols')
            .optional(),
            changePassword: Yup.string()
            .test('passwords-match', 'Password and Confirm Password must match', function (value) {
                const password = this.parent.password; // Access the 'password' field
                if (password && password.length > 0) {
                    return value === password;
                }
                return true; // If 'password' is empty, no validation is applied
            }),
        role: Yup.string(),
        //isEmailVerified: Yup.boolean(),
        picture: Yup.mixed()
    });

    const initialValues={
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: currentUser.password,
        role: currentUser.role,
        picture: currentUser.picture,
        changePassword:''

    };

    const handlePictureChange = (event) => {
        const file = event.target.files[0];
        setUploadedPicture(file);
        console.log('file', file);
        const imageURL = URL.createObjectURL(file);
        setPicture(imageURL);
      
    };

    const formik=useFormik({
        initialValues,
        validationSchema:userSchema,
        onSubmit:async(values,{setSubmitting})=>{
            try{
                console.log("onsubmit: uploaded picture: ",uploadedPicture)
                if(uploadedPicture){
                    const formData=new FormData();
                    formData.append('picture',uploadedPicture);
                    formData.append('createdBy',currentUser.id.toString());

                    await createFile(formData);

                    setPicture(URL.createObjectURL(uploadedPicture));

                    const files=await getFiles();
                    const lastUploadedFile = files[files.length - 1];

                    values.picture = lastUploadedFile.id;

                }

                await updateUser(currentUser.id.toString(),{
                    firstName:values.firstName,
                    lastName:values.lastName,
                    email:values.email,
                    password:values.password,
                    picture:values.picture
                });

                setIsEditMode(false);
                showSuccessMessage("Successfully updated data!");
            }catch(error){
                console.log("error: ",error);
                showErrorMessage("Error occurred while updating data!!!");
            }
        }
    });

    return (
        <div className="p-3 d-flex align-items-center justify-content-center col-sm-12 col-md-12 col-lg-12">
            <form 
            onSubmit={formik.handleSubmit}
            className="form w-100 p-3 default-border fv-plugins-bootstrap5 fv-plugins-framework bg-white"
            style={{ marginTop: "5rem",height:"100%" }}>
                <div className="row justify-content-end">
                <button
                    type="button"
                    className="btn btn-lg w-50 default-button mr-0"
                    onClick={() => setIsEditMode(true)}
                >
                    Edit
                </button>
            </div>

                {isEditMode ? (
                    <div>
                         <div className="row">
                          <div className="col-md-12">
                          <div className=' fv-row mb-10'>

<label className='form-label fs-6 fw-bolder text-dark'>Picture</label>

{uploadedPicture ? (
  <div className="image-container d-flex align-items-center justify-content-center">
    <img
      src={picture}
      alt={currentUser.firstName}
      width="200em"
      height="200em"
      style={{ objectFit: "cover" }}
      className="mb-3"
    />
  </div>
) : currentUser.picture ? (
  <div className="image-container d-flex align-items-center justify-content-center">
    <RecipePicture
      src={currentUser.picture}
      alt={currentUser.firstName}
      width="25em"
      height="20em"
      objectFit="cover"
    />
  </div>
) : null}

<input
    type="file"
    name='picture'
    id="picture"
    
    multiple={false}
      onChange={handlePictureChange}
    onBlur={formik.handleBlur}
    className={clsx(
        'form-control form-control-lg form-control-solid',

        {'is-invalid border border-danger': formik.touched.picture  && formik.errors.picture},
        {'is-valid border border-success': formik.touched.picture && !formik.errors.picture}
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

                        <div className='row fv-row mb-7'>
                            <div className='col-xl-12'>
                                <label className='form-label fw-bolder text-dark fs-6'>First name</label>
                                <input
                                    placeholder='First name'
                                    type='text'
                                    autoComplete='off'
                                    {...formik.getFieldProps('firstName')}
                                    className={clsx(
                                        'form-control form-control-lg',
                                        {
                                            'is-invalid': formik.touched.firstName && formik.errors.firstName,
                                        },
                                        {
                                            'is-valid': formik.touched.firstName && !formik.errors.firstName,
                                        }
                                    )}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>
                                            <span role='alert'>{formik.errors.firstName}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* begin::Form group Lastname */}
<div className='row fv-row mb-7'>
    <div className='col-xl-12'>
        <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
        <input
            placeholder='Last name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('lastName')}
            className={clsx(
                'form-control form-control-lg',
                {
                    'is-invalid': formik.touched.lastName && formik.errors.lastName,
                },
                {
                    'is-valid': formik.touched.lastName && !formik.errors.lastName,
                }
            )}
        />
        {formik.touched.lastName && formik.errors.lastName && (
            <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.lastName}</span>
                </div>
            </div>
        )}
    </div>
</div>
{/* end::Form group */}


                {/* end::Form group */}

                {/* begin::Form group Email */}

                <div className='fv-row mb-7'>
                    <label className='form-label fw-bolder text-dark fs-6'>Email</label>
                    <input
                        /*value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}*/
                        placeholder='Email'
                        type='email'
                        autoComplete='off'
                        {...formik.getFieldProps('email')}
                        className={clsx(
                            'form-control form-control-lg',
                            {'is-invalid': formik.touched.email && formik.errors.email},
                            {
                                'is-valid': formik.touched.email && !formik.errors.email,
                            }
                        )}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.email}</span>
                            </div>
                        </div>
                    )}
                </div>
                {/* end::Form group */}

                  {/* begin::Form group Password */}
                <div className='fv-row' data-kt-password-meter='true'>
                    <div className=''>
                        <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                        <div className='position-relative '>
                            <input
                                /*value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}*/
                                type='password'
                                placeholder='Password'
                                autoComplete='off'
                                {...formik.getFieldProps('password')}
                                className={clsx(
                                    'form-control form-control-lg',
                                    {
                                        'is-invalid': formik.touched.password && formik.errors.password,
                                    },
                                    {
                                        'is-valid': formik.touched.password && !formik.errors.password,
                                    }
                                )}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.password}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* begin::Meter */}
                        <div
                            className='d-flex align-items-center mb-3'
                            data-kt-password-meter-control='highlight'
                        >
                            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                            <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
                        </div>
                        {/* end::Meter */}
                    </div>
                    <div className='text-muted'>
                        Use 8 or more characters with a mix of letters, numbers & symbols.
                    </div>
                </div>
                {/* end::Form group */}

                {/* begin::Form group Confirm password */}
                <div className='fv-row'>
                    <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
                    <input
                       /* value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}*/
                        type='password'
                        placeholder='Password confirmation'
                        autoComplete='off'
                        {...formik.getFieldProps('changePassword')}
                        className={clsx(
                            'form-control form-control-lg',
                            {
                                'is-invalid': formik.touched.changePassword && formik.errors.changePassword,
                            },
                            {
                                'is-valid': formik.touched.changePassword && !formik.errors.changePassword,
                            }
                        )}
                    />
                    {formik.touched.changePassword && formik.errors.changePassword && (
                        <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                                <span role='alert'>{formik.errors.changePassword}</span>
                            </div>
                        </div>
                    )}
                </div>
                {/* end::Form group */}       

                <button
                        type='submit'
                        id='kt_sign_in_submit'
                        className='btn btn-lg default-button w-100 mb-5 mt-3'
                        >
                        Submit
                    </button>


                    </div>
                ) 
                :
                (
                <div className="p-3 d-flex align-items-center justify-content-center col-sm-12 col-md-12 col-lg-12">
                    <div className="card w-100 p-3 default-border fv-plugins-bootstrap5 fv-plugins-framework">
                        <div className="card-body">
                            
                            {currentUser.picture?(
                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label className="form-label fs-6 fw-bolder text-dark">Picture</label>
                                    
                                    <div className="image-container d-flex align-items-center justify-content-center">
                                     <RecipePicture 
                                     src={currentUser.picture} 
                                     alt={currentUser.firstName} 
                                     width="25em"
                                     height="20em"
                                     objectFit="cover"/>
                                    </div>
                                </div> 
                            </div>
                            ):(null)}

                            <div className="row">
                                <div className="col-xl6">
                                    <label className="form-label fs-6 fw-bolder text-dark">First Name</label>
                                    <div className="form-control form-control-lg">{currentUser.firstName}</div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl6">
                                    <label className="form-label fs-6 fw-bolder text-dark">Last Name</label>
                                    <div className="form-control form-control-lg">{currentUser.lastName}</div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl6">
                                    <label className="form-label fs-6 fw-bolder text-dark">Email</label>
                                    <div className="form-control form-control-lg">{currentUser.email}</div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl6">
                                    <label className="form-label fs-6 fw-bolder text-dark">Role</label>
                                    <div className="form-control form-control-lg">{currentUser.role}</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                )}

            </form>
        </div>
    );
};

export default UserInformation;