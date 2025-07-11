import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'


const ProtectedRoutes = ({allowed}) => {
    const curRole = localStorage.getItem('role')
    const location = useLocation()

    if (!curRole ) {
        return <Navigate to='/login' replace state= {{from: location}} />
    }

    if (curRole.toLowerCase() !== allowed.toLowerCase()) {
        return <Navigate to={`/${curRole}`} replace />    
    }   

    return <Outlet />
}

export default ProtectedRoutes
