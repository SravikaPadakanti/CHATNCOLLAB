import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
import ThemeToggle from '../components/ThemeToggle'
import axios from '../config/axios'

const Register = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    const { setUser } = useContext(UserContext)
    const { isDark } = useTheme()
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        setErrorMessage('')
        setIsSubmitting(true)

        axios.post('/users/register', {
            email: email.trim(),
            password
        }).then((res) => {
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            setIsSubmitting(false)
            navigate('/dashboard')
        }).catch((err) => {
            setIsSubmitting(false)
            console.error('Registration error:', err)
            const errDetail = err.response?.data?.errors || err.response?.data || 'Failed to create account'
            if (Array.isArray(errDetail)) {
                setErrorMessage(errDetail.map(e => e.msg).join(', '))
            } else if (typeof errDetail === 'string') {
                setErrorMessage(errDetail)
            } else {
                setErrorMessage('Registration failed. Email may already be in use.')
            }
        })
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200 selection:bg-orange-500 selection:text-black ${
            isDark ? 'bg-[#090a0e] text-zinc-100' : 'bg-[#fafaf8] text-zinc-900'
        }`}>
            {/* Top Right Theme Toggle */}
            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md relative z-10">
                
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 group mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-[0_0_25px_rgba(249,115,22,0.35)] group-hover:scale-105 transition-transform">
                            <i className="ri-code-s-slash-line text-2xl"></i>
                        </div>
                        <span className={`font-extrabold text-2xl tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            CHATNCOLLAB
                        </span>
                    </Link>
                    <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        Create your account
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Start collaborating with your team in seconds
                    </p>
                </div>

                {/* Form Card */}
                <div className={`p-8 rounded-3xl border shadow-2xl transition-colors ${
                    isDark ? 'bg-[#0f1118]/90 backdrop-blur-xl border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'
                }`}>
                    
                    {errorMessage && (
                        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2.5">
                            <i className="ri-error-warning-fill text-base shrink-0"></i>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-5">
                        
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                                isDark ? 'text-zinc-400' : 'text-zinc-600'
                            }`} htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                                <input
                                    autoFocus
                                    required
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                                        isDark
                                            ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-orange-500'
                                            : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white'
                                    }`}
                                    placeholder="developer@team.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                                isDark ? 'text-zinc-400' : 'text-zinc-600'
                            }`} htmlFor="password">
                                Password <span className="text-[10px] text-zinc-400 font-normal lowercase">(min. 3 chars)</span>
                            </label>
                            <div className="relative">
                                <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                                <input
                                    required
                                    minLength={3}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                                        isDark
                                            ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-orange-500'
                                            : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors text-sm"
                                >
                                    <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {isSubmitting && <i className="ri-loader-4-line animate-spin"></i>}
                            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                        </button>
                    </form>

                    <div className={`mt-6 pt-5 border-t text-center ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            Already have an account?{' '}
                            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                </div>

                <div className="text-center mt-6">
                    <Link to="/" className={`text-xs transition-colors ${
                        isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'
                    }`}>
                        ← Back to Homepage
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Register