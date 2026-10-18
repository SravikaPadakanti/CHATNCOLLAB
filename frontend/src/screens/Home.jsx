import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
import ThemeToggle from '../components/ThemeToggle'
import axios from "../config/axios"
import { useNavigate, Link } from 'react-router-dom'

const Home = () => {
    const { user, setUser } = useContext(UserContext)
    const { isDark } = useTheme()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState('')
    const [ projects, setProjects ] = useState([])
    const [ searchQuery, setSearchQuery ] = useState('')
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ createError, setCreateError ] = useState('')

    const navigate = useNavigate()

    const fetchProjects = () => {
        setIsLoading(true)
        axios.get('/projects/all')
            .then((res) => {
                setProjects(res.data.projects || [])
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch projects:', err)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleCreateProject = (e) => {
        e.preventDefault()
        if (!projectName.trim()) return

        setIsSubmitting(true)
        setCreateError('')

        axios.post('/projects/create', {
            name: projectName.trim(),
        })
            .then((res) => {
                setProjects(prev => [ res.data, ...prev ])
                setIsModalOpen(false)
                setProjectName('')
                setIsSubmitting(false)
            })
            .catch((error) => {
                console.error(error)
                const msg = error.response?.data || error.message || 'Failed to create project'
                setCreateError(typeof msg === 'string' ? msg : 'Project name already exists or invalid')
                setIsSubmitting(false)
            })
    }

    const handleLogout = () => {
        axios.get('/users/logout')
            .finally(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
                navigate('/login')
            })
    }

    const filteredProjects = projects.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

    return (
        <div className={`min-h-screen transition-colors duration-200 selection:bg-orange-500 selection:text-black ${
            isDark ? 'bg-[#090a0e] text-zinc-100' : 'bg-[#fdfdf1] text-[#1c1917]'
        }`}>
            
            {/* Top Dashboard Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 ${
                isDark ? 'bg-[#0d0f14]/90 border-zinc-800' : 'bg-[#fdfdf1]/90 border-[#e7e5d8] shadow-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    
                    {/* Brand */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(249,115,22,0.35)] group-hover:scale-105 transition-transform">
                                <i className="ri-code-s-slash-line text-2xl"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-extrabold text-xl tracking-tight flex items-center gap-2 ${
                                    isDark ? 'text-white' : 'text-[#1c1917]'
                                }`}>
                                    CHATNCOLLAB
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                                        isDark
                                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                            : 'bg-orange-100 text-orange-800 border-orange-200'
                                    }`}>
                                        Dashboard
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Search Projects */}
                    <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                            <input
                                type="text"
                                placeholder="Search your workspaces..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none transition-colors ${
                                    isDark
                                        ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:border-orange-500'
                                        : 'bg-white border-[#e7e5d8] text-zinc-900 placeholder-zinc-400 focus:border-orange-500 shadow-sm'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Right Controls: Theme Toggle & Actions */}
                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5"
                        >
                            <i className="ri-add-line text-lg"></i>
                            <span className="hidden sm:inline">New Project</span>
                        </button>

                        {/* User Profile Pill */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#e7e5d8] shadow-sm'
                        }`}>
                            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs">
                                {userInitial}
                            </div>
                            <span className={`text-xs font-medium max-w-[120px] truncate hidden md:inline ${
                                isDark ? 'text-zinc-300' : 'text-zinc-700'
                            }`}>
                                {user?.email || 'User'}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                                isDark
                                    ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-rose-400'
                                    : 'bg-white hover:bg-zinc-100 border-[#e7e5d8] text-zinc-600 hover:text-rose-600 shadow-sm'
                            }`}
                        >
                            <i className="ri-logout-box-r-line text-base"></i>
                        </button>
                    </div>

                </div>
            </header>

            {/* Dashboard Body */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    <div className={`p-5 rounded-2xl border transition-colors ${
                        isDark ? 'bg-[#0e1017] border-zinc-800/80 hover:border-orange-500/30' : 'bg-white border-[#e7e5d8] shadow-sm hover:border-orange-300'
                    }`}>
                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                            <span>Total Workspaces</span>
                            <i className="ri-folder-3-line text-orange-500"></i>
                        </div>
                        <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                            {projects.length}
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border transition-colors ${
                        isDark ? 'bg-[#0e1017] border-zinc-800/80 hover:border-amber-500/30' : 'bg-white border-[#e7e5d8] shadow-sm hover:border-amber-300'
                    }`}>
                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                            <span>Collaborator Network</span>
                            <i className="ri-group-line text-amber-500"></i>
                        </div>
                        <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                            {projects.reduce((acc, p) => acc + (p.users?.length || 1), 0)}
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border transition-colors ${
                        isDark ? 'bg-[#0e1017] border-zinc-800/80 hover:border-orange-500/30' : 'bg-white border-[#e7e5d8] shadow-sm hover:border-orange-300'
                    }`}>
                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                            <span>WebContainer Engine</span>
                            <i className="ri-terminal-box-line text-orange-500"></i>
                        </div>
                        <div className="text-sm font-bold text-orange-500 flex items-center gap-1.5 mt-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Online & Isolated
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border transition-colors ${
                        isDark ? 'bg-[#0e1017] border-zinc-800/80 hover:border-amber-500/30' : 'bg-white border-[#e7e5d8] shadow-sm hover:border-amber-300'
                    }`}>
                        <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                            <span>AI Assistant Status</span>
                            <i className="ri-sparkling-fill text-amber-500"></i>
                        </div>
                        <div className="text-sm font-bold text-amber-500 flex items-center gap-1.5 mt-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Gemini Ready
                        </div>
                    </div>
                </div>

                {/* Section Title & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className={`text-2xl font-extrabold tracking-tight flex items-center gap-2 ${
                            isDark ? 'text-white' : 'text-[#1c1917]'
                        }`}>
                            <span>Your Workspaces</span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-orange-100 text-orange-800'
                            }`}>
                                {filteredProjects.length}
                            </span>
                        </h2>
                        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Select a workspace to open real-time multi-user editing, team chat, and the in-browser terminal.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm text-zinc-400 font-medium">Fetching workspaces...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className={`py-16 px-4 rounded-3xl border border-dashed text-center max-w-lg mx-auto ${
                        isDark ? 'bg-[#0d0e14] border-zinc-800' : 'bg-white border-[#e7e5d8] shadow-sm'
                    }`}>
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-3xl mx-auto mb-4 border border-orange-500/20">
                            <i className="ri-folder-add-line"></i>
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                            No Projects Found
                        </h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            {searchQuery ? 'No workspaces matched your search query.' : 'You have not created any collaborative workspaces yet.'}
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
                        >
                            <i className="ri-add-line"></i>
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* New Project Quick Trigger Card */}
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className={`group cursor-pointer rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center min-h-[220px] transition-all hover:-translate-y-1 text-center ${
                                isDark
                                    ? 'border-zinc-800 hover:border-orange-500/50 bg-zinc-900/30 hover:bg-orange-950/10'
                                    : 'border-[#e7e5d8] hover:border-orange-500 bg-[#f7f7e8]/60 hover:bg-orange-50/50'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-colors ${
                                isDark
                                    ? 'bg-zinc-800 group-hover:bg-orange-500/20 text-zinc-400 group-hover:text-orange-400'
                                    : 'bg-white group-hover:bg-orange-100 text-zinc-600 group-hover:text-orange-600 shadow-sm'
                            }`}>
                                <i className="ri-add-line"></i>
                            </div>
                            <span className={`font-bold text-base transition-colors ${
                                isDark ? 'text-white group-hover:text-orange-400' : 'text-[#1c1917] group-hover:text-orange-600'
                            }`}>
                                Create New Workspace
                            </span>
                            <span className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                                Setup isolated room & runtime
                            </span>
                        </div>

                        {/* Project Cards */}
                        {filteredProjects.map((proj) => {
                            const memberCount = proj.users?.length || 1
                            return (
                                <div
                                    key={proj._id}
                                    onClick={() => {
                                        navigate('/project', {
                                            state: { project: proj }
                                        })
                                    }}
                                    className={`group cursor-pointer rounded-2xl border p-6 flex flex-col justify-between min-h-[220px] transition-all hover:-translate-y-1 relative overflow-hidden ${
                                        isDark
                                            ? 'bg-[#0e1017] border-zinc-800 hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)]'
                                            : 'bg-white border-[#e7e5d8] hover:border-orange-400 shadow-sm hover:shadow-md'
                                    }`}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-lg">
                                                    <i className="ri-terminal-box-line"></i>
                                                </div>
                                                <h3 className={`font-bold text-lg truncate max-w-[180px] transition-colors ${
                                                    isDark ? 'text-white group-hover:text-orange-400' : 'text-[#1c1917] group-hover:text-orange-600'
                                                }`}>
                                                    {proj.name}
                                                </h3>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                                isDark
                                                    ? 'bg-orange-950/70 text-orange-400 border-orange-500/20'
                                                    : 'bg-orange-100 text-orange-800 border-orange-200'
                                            }`}>
                                                Active
                                            </span>
                                        </div>

                                        <p className={`text-xs line-clamp-2 mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            Real-time collaborative workspace with AI assistant and file syncing.
                                        </p>
                                    </div>

                                    <div className={`pt-4 border-t flex items-center justify-between ${
                                        isDark ? 'border-zinc-800/80' : 'border-[#f2efe4]'
                                    }`}>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <i className="ri-user-shared-line text-orange-500"></i>
                                            <span>{memberCount} Collaborator{memberCount > 1 ? 's' : ''}</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform">
                                            <span>Open</span>
                                            <i className="ri-arrow-right-line"></i>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

            </main>

            {/* CREATE PROJECT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className={`relative w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl ${
                        isDark ? 'bg-[#0f1118] border-zinc-800' : 'bg-[#fdfdf1] border-[#e7e5d8]'
                    }`}>
                        
                        <button
                            onClick={() => {
                                setIsModalOpen(false)
                                setCreateError('')
                            }}
                            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>

                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl mb-4 border border-orange-500/20">
                            <i className="ri-folder-add-line"></i>
                        </div>

                        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                            Create New Workspace
                        </h3>
                        <p className={`text-xs mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Give your workspace a name. You can invite team members right after creation.
                        </p>

                        {createError && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                                <i className="ri-error-warning-line text-sm"></i>
                                <span>{createError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateProject}>
                            <div className="mb-6">
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                                }`}>
                                    Workspace Name
                                </label>
                                <div className="relative">
                                    <i className="ri-keyboard-line absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. backend-api, hackathon-sprint"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${
                                            isDark
                                                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-orange-500'
                                                : 'bg-white border-[#e7e5d8] text-zinc-900 placeholder-zinc-400 focus:border-orange-500 shadow-sm'
                                        }`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setCreateError('')
                                    }}
                                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                                        isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300' : 'bg-white hover:bg-zinc-100 border border-[#e7e5d8] text-zinc-700'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !projectName.trim()}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2"
                                >
                                    {isSubmitting && <i className="ri-loader-4-line animate-spin"></i>}
                                    <span>{isSubmitting ? 'Creating...' : 'Create Workspace'}</span>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Home