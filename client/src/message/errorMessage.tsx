import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showErrorMessage(message) {

    toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

        style: {
            background: 'red',
            color: 'white',
        },
        bodyClassName: 'toast-body',
    });
};


export default function ErrorCreateTenderMessage() {
    return (
        <div>

        </div>
    );
}
