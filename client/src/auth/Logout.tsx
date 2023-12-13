import React, {useEffect} from 'react'
import {Navigate, Routes} from 'react-router-dom'
import {useAuth} from "./Auth";

export function Logout() {
    const {logout} = useAuth()
    useEffect(() => {
        logout()
        document.location.reload()
    }, [logout])

    return (
        <Routes>
            <Navigate to='/auth/login' />
        </Routes>
    )
}
