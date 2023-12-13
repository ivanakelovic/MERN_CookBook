/*
import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AuthService from "../../../shared/services/api-client/auth.service";
import {showErrorMessage} from "../../../shared/components/messages/error-createtender-message";
import {showSuccessMessage} from "../../../shared/components/messages/success-createtender-message";

const VerifyEmail = () => {

    const authService = new AuthService();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    console.log('token ', token);

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/my-profile');
    };

    const verify = async () => {
        try {
            if (token) {
                const verificationResult = await authService.verifyEmail(token);
                if (verificationResult) {
                    console.log("Email verified successfully");
                    showSuccessMessage('Successfully verified email!!! Please log in again!')
                    navigate('/my-profile');
                } else {
                    console.error("Email verification failed");
                    showErrorMessage('Email verification failed');
                }
            } else {
                console.error("No token found");
                showErrorMessage('Email verification failed');
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            showErrorMessage('Email verification failed');
        }
    };


    return (
        <div className='d-flex justify-content-center align-items-center'>
            <button
                className='btn btn-lg me-5'
                onClick={verify}>Verify email
            </button>
            <button
                className='btn btn-secondary btn-lg'
                onClick={handleCancel}
            >
                Cancel
            </button>
        </div>
    );
};

export default VerifyEmail;
*/
