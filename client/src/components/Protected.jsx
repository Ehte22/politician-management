import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Protected = () => {

    const user = JSON.parse(localStorage.getItem("user"))

    return user?.token ? <Outlet /> : <Navigate to="/login" />
}

export default Protected