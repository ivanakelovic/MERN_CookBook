/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'

const AuthLayout = () => {
    useEffect(() => {
        document.body.classList.add('bg-body')
        return () => {
            document.body.classList.remove('bg-body')
        }
    }, [])
    return (
        <div className='d-flex align-items-center justify-content-center'>
            <div className='d-flex align-items-center justify-content-center col-sm-12 col-md-12 col-lg-12'>
                <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
                    <div className='w-lg-500px shadow-sm rounded p-10 p-lg-15 d-flex align-items-center justify-content-center '>
                        <Outlet/>
                    </div>
                </div>
            </div>


        </div>
    )
}

const AuthPage = () => (
    <Routes>
        <Route element={<AuthLayout/>}>
            <Route path='login' element={<Login/>}/>
            <Route path='registration' element={<Registration/>}/>
            <Route path='forgot-password' element={<ForgotPassword/>}/>

            <Route index element={<Login/>}/>

        </Route>

    </Routes>
)

export {AuthPage}


