import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Landing from '../screens/Landing'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Marketing Landing Page */}
                <Route path="/" element={<Landing />} />

                {/* Authentication Screens */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Authenticated Workspace & Dashboard */}
                <Route path="/dashboard" element={<UserAuth><Home /></UserAuth>} />
                <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes