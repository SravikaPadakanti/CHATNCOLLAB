import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {
    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            setLoading(false)
            navigate('/login')
            return
        }

        if (user) {
            setLoading(false)
            return
        }

        // Token exists but user not loaded in memory yet, verify with backend
        axios.get('/users/profile')
            .then(res => {
                setUser(res.data.user)
                setLoading(false)
            })
            .catch(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
                setLoading(false)
                navigate('/login')
            })
    }, [ user, navigate, setUser ])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-zinc-400">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
                <p className="text-sm tracking-wider uppercase font-semibold text-emerald-400/80">Loading Workspace...</p>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserAuth