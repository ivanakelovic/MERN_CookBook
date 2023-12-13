import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import AuthService from "../../services/api-client/auth.service";
import "../../css/components.css";


const authService = new AuthService();

const initialValues = {
    email: 'admin@demo.com',
}

const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Email is required'),
})

export function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
    const formik = useFormik({
        initialValues,
        validationSchema: forgotPasswordSchema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            await authService.forgotPassword(values.email)
        },
    })

    return (
        <>
            <form style={{marginTop:'16rem'}}
                  className='bg-white form w-100 default-border p-3 fv-plugins-bootstrap5 fv-plugins-framework'
                  noValidate
                  id='kt_login_password_reset_form'
                  onSubmit={formik.handleSubmit}
            >
                <div className='text-center mb-10'>
                    {/*  <img alt='Logo' src={favicon} className='h-75px'/>*/}
                    <br/>
                    {/* begin::Title */}
                    <h1 className='text-dark mb-3'>Forgot Password ?</h1>
                    {/* end::Title */}

                    {/* begin::Link */}
                    <div className='text-gray-400 fw-bold fs-4'>Enter your email to reset your password.</div>
                    {/* end::Link */}
                </div>

                {/* begin::Title */}
                {hasErrors === true && (
                    <div className='mb-lg-15 alert alert-danger'>
                        <div className='alert-text font-weight-bold'>
                            Sorry, looks like there are some errors detected, please try again.
                        </div>
                    </div>
                )}

                {hasErrors === false && (
                    <div className='mb-10 bg-light-info p-8 rounded'>
                        <div className='text-info'>Sent password reset. Please check your email</div>
                    </div>
                )}
                {/* end::Title */}

                {/* begin::Form group */}
                <div className='fv-row mb-10'>
                    <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
                    <input
                        type='email'
                        placeholder=''
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

                {/* begin::Form group */}
                <div className='mt-3 d-flex flex-wrap justify-content-center pb-lg-0'>
                    <button
                        type='submit'
                        id='kt_password_reset_submit'
                        className='btn btn-lg  fw-bolder me-4 default-button'
                    >
                        <span className='indicator-label'>Submit</span>
                        {loading && (
                            <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
                        )}
                    </button>
                    <Link to='/auth/login'>
                        <button
                            type='button'
                            id='kt_login_password_reset_form_cancel_button'
                            className='btn btn-lg fw-bolder cancel-btn:hover'
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            Cancel
                        </button>
                    </Link>{' '}
                </div>
                {/* end::Form group */}
            </form>
        </>
    )
}
