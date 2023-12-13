import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showSuccessMessage(message) {

    toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

        style: {
            background: 'green',
            color: 'white',
        },
        bodyClassName: 'toast-body',
})
};

export default function SuccessCreateTenderMessage() {
    return (
        <div>

        </div>
    );
}
