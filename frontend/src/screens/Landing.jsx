import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
import ThemeToggle from '../components/ThemeToggle'

const Landing = () => {
    const { user } = useContext(UserContext)
    const { isDark } = useTheme()
    const navigate = useNavigate()

    // Interactive showcase tab state
    const [ activeTab, setActiveTab ] = useState('editor')
    const [ copiedCommand, setCopiedCommand ] = useState(false)
    const [ interactiveCode, setInteractiveCode ] = useState(`import express from 'express';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

// Team Collaboration Room Gateway
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', latency: '12ms', sync: true });
});

app.listen(3000, () => {
  console.log('⚡ CHATNCOLLAB Engine running on port 3000');
});`)

    const [ isRunning, setIsRunning ] = useState(false)
    const [ terminalOutput, setTerminalOutput ] = useState('')

    // Copy command helper
    const handleCopyCommand = () => {
        navigator.clipboard?.writeText('npx chatncollab@latest')
        setCopiedCommand(true)
        setTimeout(() => setCopiedCommand(false), 2000)
    }

    // Run code simulation
    const handleRunInteractive = () => {
        setIsRunning(true)
        setTerminalOutput('Mounting files into WebContainer memory...')
        setTimeout(() => {
            setTerminalOutput(
                '⚡ WebContainer runtime booted [118ms]\n' +
                '✓ Dependencies resolved\n' +
                '🚀 Server listening on http://localhost:3000\n' +
                '✓ WebSocket room broadcast active (3 peers connected)'
            )
            setIsRunning(false)
        }, 650)
    }

    const showcaseScreens = {
        editor: {
            title: 'Collaborative Multi-Tab Code Studio',
            subtitle: 'Real-time multi-cursor editing with line-level diffs and directory synchronization.',
            metric: '12ms cursor sync',
            type: 'editor'
        },
        ai: {
            title: 'Context-Aware Gemini Co-Pilot',
            subtitle: 'Tag @ai in any project room to generate whole file trees, boilerplate, and edge-case handling.',
            metric: 'Full AST generator',
            type: 'ai'
        },
        runtime: {
            title: 'True In-Browser Node.js WebContainers',
            subtitle: 'Compile packages, run tests, and spin up live HTTP servers without installing local dependencies.',
            metric: 'Zero-install runtime',
            type: 'runtime'
        },
        workspaces: {
            title: 'Instant Workspaces & Team Permissions',
            subtitle: 'Organize projects, invite team members by email, and sync permissions across MongoDB and Redis.',
            metric: '1-click invites',
            type: 'workspaces'
        }
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 selection:bg-orange-500 selection:text-black ${
            isDark ? 'bg-[#090a0e] text-zinc-100' : 'bg-[#fdfdf1] text-[#1c1917]'
        }`}>
            {/* Ambient subtle glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none ${
                isDark ? 'radial-ambient-dark' : 'radial-ambient-light'
            }`} />

            {/* TOP NAVIGATION BAR */}
            <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
                isDark ? 'bg-[#090a0e]/85 border-zinc-800' : 'bg-[#fdfdf1]/90 border-[#e7e5d8] shadow-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-[0_0_20px_rgba(249,115,22,0.35)] group-hover:scale-105 transition-transform">
                            <i className="ri-code-s-slash-line text-2xl"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl tracking-tight">
                                CHATNCOLLAB
                            </span>
                            <span className={`text-xs hidden sm:inline ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                Real-time Collaborative Code Cloud
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold ${
                        isDark ? 'text-zinc-300' : 'text-zinc-700'
                    }`}>
                        <a href="#showcase" className="hover:text-orange-500 transition-colors">App Showcase</a>
                        <a href="#playground" className="hover:text-orange-500 transition-colors">Live Playground</a>
                        <a href="#benefits" className="hover:text-orange-500 transition-colors">Why CHATNCOLLAB</a>
                        <a href="#workflows" className="hover:text-orange-500 transition-colors">Use Cases</a>
                    </nav>

                    {/* Right Controls: Theme Toggle & Auth */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {user ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5"
                            >
                                <i className="ri-dashboard-3-line text-base"></i>
                                <span>Go to Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                                        isDark ? 'text-zinc-300 hover:text-orange-400' : 'text-zinc-700 hover:text-orange-600'
                                    }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5"
                                >
                                    <span>Get Started</span>
                                    <i className="ri-arrow-right-line"></i>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Release Pill - User POV without v2.4 */}
                    <div className="flex justify-center mb-6">
                        <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-colors ${
                            isDark
                                ? 'bg-zinc-900 border-orange-500/30 text-zinc-300'
                                : 'bg-white border-orange-300 text-orange-950 shadow-orange-500/5'
                        }`}>
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            <span>Browser-Native Cloud Studio & Real-Time AI Pair Programmer</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] ${
                            isDark ? 'text-white' : 'text-[#1c1917]'
                        }`}>
                            Where teams write code, <br />
                            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                                talk, and run apps together.
                            </span>
                        </h1>
                        <p className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
                            isDark ? 'text-zinc-400' : 'text-zinc-600'
                        }`}>
                            An instant, zero-install collaborative studio. Live multi-user cursors, room chat with integrated Gemini AI, and sub-second WebContainer execution inside your browser.
                        </p>

                        {/* CTA and Quick Copy Terminal Bar */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate(user ? '/dashboard' : '/register')}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all transform hover:-translate-y-0.5"
                            >
                                <i className="ri-rocket-2-fill text-lg"></i>
                                <span>{user ? 'Open Your Workspaces' : 'Start Building Free'}</span>
                            </button>

                            {/* 1-Click Copy Command */}
                            <div
                                onClick={handleCopyCommand}
                                className={`w-full sm:w-auto px-5 py-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer group transition-all ${
                                    isDark
                                        ? 'bg-zinc-900/90 border-zinc-800 hover:border-orange-500/40 text-zinc-300'
                                        : 'bg-white border-[#e7e5d8] hover:border-orange-400 text-zinc-800 shadow-sm'
                                }`}
                                title="Click to copy setup command"
                            >
                                <div className="flex items-center gap-2 font-mono text-xs">
                                    <span className="text-orange-500 font-bold">$</span>
                                    <span>npx chatncollab@latest</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${
                                    copiedCommand
                                        ? 'bg-emerald-500 text-black'
                                        : isDark ? 'bg-zinc-800 text-zinc-400 group-hover:text-white' : 'bg-orange-100 text-orange-800 group-hover:bg-orange-200'
                                }`}>
                                    {copiedCommand ? 'Copied!' : 'Copy'}
                                </span>
                            </div>
                        </div>

                        {/* User-POV Value Badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
                            <span className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                <i className="ri-team-fill text-orange-500 text-sm"></i>
                                Real-Time Team Collaboration
                            </span>
                            <span className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                <i className="ri-sparkling-fill text-amber-500 text-sm"></i>
                                Built-In AI Pair Programmer
                            </span>
                            <span className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                <i className="ri-terminal-box-fill text-orange-500 text-sm"></i>
                                Zero Local Setup or Installs
                            </span>
                            <span className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                <i className="ri-shield-check-fill text-emerald-500 text-sm"></i>
                                Secure In-Browser Execution
                            </span>
                        </div>
                    </div>

                </div>
            </section>

            {/* INSTAGRAM-STYLE REALISTIC APP SHOWCASE */}
            <section id="showcase" className={`py-20 border-y transition-colors duration-200 ${
                isDark ? 'bg-[#0d0f15] border-zinc-800' : 'bg-[#f6f6e8] border-[#e7e5d8]'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${
                            isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}>
                            <i className="ri-camera-lens-fill text-orange-500"></i>
                            Live Studio Showcase
                        </div>
                        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
                            isDark ? 'text-white' : 'text-[#1c1917]'
                        }`}>
                            Experience the Workspace in Action
                        </h2>
                        <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Click through the real screenshots below to see how teams code, brainstorm with AI, and run servers together.
                        </p>
                    </div>

                    {/* Screenshot Selector Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
                        {Object.entries(showcaseScreens).map(([ key, val ]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                                    activeTab === key
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 border-transparent shadow-[0_0_20px_rgba(249,115,22,0.35)] scale-105'
                                        : isDark
                                            ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                                            : 'bg-white hover:bg-zinc-50 text-zinc-700 border-[#e7e5d8] shadow-sm'
                                }`}
                            >
                                <i className={
                                    key === 'editor' ? 'ri-code-box-line' :
                                    key === 'ai' ? 'ri-sparkling-fill' :
                                    key === 'runtime' ? 'ri-terminal-box-line' : 'ri-folder-shared-line'
                                }></i>
                                <span>{val.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Dual Device Showcase Canvas */}
                    <div className={`p-6 sm:p-10 rounded-3xl border shadow-xl transition-all ${
                        isDark ? 'bg-[#10121a] border-zinc-800' : 'bg-white border-[#e7e5d8]'
                    }`}>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            
                            {/* Left Side: Instagram-Style Mobile Phone Frame */}
                            <div className="lg:col-span-4 flex justify-center">
                                <div className={`w-[290px] rounded-[44px] p-3 shadow-2xl border-4 relative transition-colors ${
                                    isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-[#292524] border-[#1c1917]'
                                }`}>
                                    {/* Notch */}
                                    <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                                    </div>

                                    {/* Inside Screen */}
                                    <div className={`rounded-[32px] p-3 h-[460px] overflow-hidden flex flex-col justify-between text-xs transition-colors ${
                                        isDark ? 'bg-[#090b10] text-zinc-200' : 'bg-[#fdfdf1] text-zinc-900'
                                    }`}>
                                        
                                        {/* Mobile Instagram-Style Creator Stories Bar */}
                                        <div className="shrink-0 pb-2 border-b border-zinc-800/40">
                                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                                <div className="flex flex-col items-center gap-1 shrink-0">
                                                    <div className="w-9 h-9 rounded-full ring-2 ring-orange-500 p-0.5 bg-zinc-900 flex items-center justify-center font-bold text-[10px] text-orange-400">
                                                        You
                                                    </div>
                                                    <span className="text-[9px]">Live</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 shrink-0">
                                                    <div className="w-9 h-9 rounded-full ring-2 ring-amber-500 p-0.5 bg-zinc-900 flex items-center justify-center font-bold text-[10px] text-amber-400">
                                                        Alex
                                                    </div>
                                                    <span className="text-[9px]">✎ code</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 shrink-0">
                                                    <div className="w-9 h-9 rounded-full ring-2 ring-orange-400 p-0.5 bg-zinc-900 flex items-center justify-center font-bold text-[10px] text-white">
                                                        Sarah
                                                    </div>
                                                    <span className="text-[9px]">Lead</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 shrink-0">
                                                    <div className="w-9 h-9 rounded-full ring-2 ring-emerald-500 p-0.5 bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-[10px] text-black">
                                                        AI
                                                    </div>
                                                    <span className="text-[9px]">Co-Pilot</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Chat & AI Stream */}
                                        <div className="flex-1 py-3 space-y-2.5 overflow-hidden flex flex-col justify-end">
                                            <div className={`p-2.5 rounded-2xl rounded-tl-none border text-[11px] ${
                                                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#e7e5d8] shadow-sm'
                                            }`}>
                                                <span className="text-orange-500 font-bold block text-[10px]">Alex Rivera:</span>
                                                <span>I just committed the socket middleware to `/project`.</span>
                                            </div>

                                            <div className={`p-2.5 rounded-2xl rounded-tl-none border text-[11px] ${
                                                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-[#e7e5d8] shadow-sm'
                                            }`}>
                                                <span className="text-amber-500 font-bold block text-[10px]">Sarah:</span>
                                                <span><span className="text-orange-500 font-bold">@ai</span> create tests for express api</span>
                                            </div>

                                            <div className={`p-2.5 rounded-2xl border text-[10px] ${
                                                isDark ? 'bg-orange-500/5 border-orange-500/40' : 'bg-orange-50/70 border-orange-300'
                                            }`}>
                                                <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 font-bold mb-1">
                                                    <span>GEMINI ASSISTANT</span>
                                                    <span className="bg-orange-500/20 px-1 py-0.5 rounded text-[9px]">test/api.test.js</span>
                                                </div>
                                                <p className="font-mono text-[10px] text-zinc-500">describe('Auth Suite', () =&gt; ...)</p>
                                            </div>
                                        </div>

                                        {/* Mobile Input */}
                                        <div className="shrink-0 pt-2 border-t border-zinc-800/40 flex items-center gap-1.5">
                                            <div className={`flex-1 px-3 py-1.5 rounded-full text-[10px] border ${
                                                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-[#e7e5d8] text-zinc-500'
                                            }`}>
                                                Send message or @ai...
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-orange-500 text-black font-bold flex items-center justify-center text-xs">
                                                <i className="ri-send-plane-fill"></i>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="w-24 h-1 bg-zinc-600 rounded-full mx-auto mt-2"></div>
                                </div>
                            </div>

                            {/* Right Side: Desktop MacBook Studio IDE Frame */}
                            <div className="lg:col-span-8">
                                
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                                            isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {showcaseScreens[activeTab].metric}
                                        </span>
                                    </div>
                                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                                        {showcaseScreens[activeTab].title}
                                    </h3>
                                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                        {showcaseScreens[activeTab].subtitle}
                                    </p>
                                </div>

                                {/* macOS Window Chrome */}
                                <div className={`rounded-2xl border shadow-xl overflow-hidden ${
                                    isDark ? 'bg-[#0a0c10] border-zinc-800' : 'bg-white border-[#e7e5d8]'
                                }`}>
                                    
                                    {/* Window Header */}
                                    <div className={`h-10 px-3 flex items-center justify-between border-b ${
                                        isDark ? 'bg-[#10121a] border-zinc-800' : 'bg-[#f8f8ea] border-[#e7e5d8]'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                            <span className={`ml-2 text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                                workspace://hackathon-sprint/{activeTab === 'ai' ? 'ai.service.js' : activeTab === 'runtime' ? 'terminal' : 'server.js'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-orange-500">
                                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                                            Active Room Sync
                                        </div>
                                    </div>

                                    {/* Window Body Screen */}
                                    <div className={`p-4 sm:p-6 min-h-[340px] font-mono text-xs overflow-auto ${
                                        isDark ? 'bg-[#08090d] text-zinc-300' : 'bg-[#fdfdf1] text-[#1c1917]'
                                    }`}>
                                        
                                        {activeTab === 'editor' && (
                                            <div>
                                                <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-2 mb-3 text-[11px]">
                                                    <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/30 font-bold flex items-center gap-1">
                                                        <i className="ri-file-code-line"></i> server.js
                                                    </span>
                                                    <span className="text-zinc-400 px-2 flex items-center gap-1">
                                                        <i className="ri-file-code-line"></i> auth.js
                                                    </span>
                                                    <span className="text-zinc-400 px-2 flex items-center gap-1">
                                                        <i className="ri-settings-3-line"></i> package.json
                                                    </span>
                                                </div>
                                                <div className="leading-relaxed">
                                                    <span className="text-orange-500 font-bold">import</span> express <span className="text-orange-500 font-bold">from</span> <span className="text-amber-500">'express'</span>;<br/>
                                                    <span className="text-orange-500 font-bold">import</span> &#123; Server &#125; <span className="text-orange-500 font-bold">from</span> <span className="text-amber-500">'socket.io'</span>;<br/><br/>
                                                    <span className="text-zinc-500">// Collaborative Multi-User Socket Gateway</span><br/>
                                                    <span className="text-orange-500 font-bold">const</span> app = express();<br/>
                                                    <span className="text-orange-500 font-bold">const</span> port = process.env.PORT || 3000;<br/><br/>
                                                    app.get(<span className="text-amber-500">'/status'</span>, (req, res) =&gt; &#123;<br/>
                                                    &nbsp;&nbsp;res.json(&#123; status: <span className="text-amber-500">'ready'</span>, latency: <span className="text-amber-500">'12ms'</span> &#125;);<br/>
                                                    &#125;);
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'ai' && (
                                            <div className="space-y-3 font-sans">
                                                <div className={`p-3 rounded-xl border text-xs ${
                                                    isDark ? 'bg-orange-500/5 border-orange-500/40' : 'bg-orange-50/70 border-orange-300'
                                                }`}>
                                                    <span className="text-orange-600 dark:text-orange-400 font-bold block mb-1">User Input in Team Chat:</span>
                                                    <span className="font-mono text-zinc-800 dark:text-zinc-300">@ai generate an express server with socket.io room sync</span>
                                                </div>
                                                <div className={`p-4 rounded-xl border font-mono text-xs ${
                                                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-[#e7e5d8]'
                                                }`}>
                                                    <div className="flex items-center justify-between text-orange-500 font-bold mb-2">
                                                        <span>GEMINI AST GENERATOR</span>
                                                        <span className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-[10px]">Tree Mounted</span>
                                                    </div>
                                                    <div className="text-zinc-500 space-y-1">
                                                        <div>+ server.js [64 lines]</div>
                                                        <div>+ routes/user.routes.js [32 lines]</div>
                                                        <div>+ middleware/auth.js [24 lines]</div>
                                                        <div>+ package.json [dependencies resolved]</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'runtime' && (
                                            <div className="space-y-2 text-xs">
                                                <div className="text-zinc-500 pb-1 border-b border-zinc-800/40">
                                                    WebContainer Virtualized Node.js Environment
                                                </div>
                                                <div className="text-zinc-500">$ npm install</div>
                                                <div className="text-emerald-500">✓ added 52 packages in 320ms</div>
                                                <div className="text-zinc-500">$ node server.js</div>
                                                <div className="text-orange-500">⚡ CHATNCOLLAB Node Engine initialized</div>
                                                <div className="font-bold">🚀 Server listening on port 3000</div>
                                                <div className="text-amber-500">✓ Connected to in-memory MongoDB</div>
                                                <div className="text-emerald-500">✓ Redis Mock connected</div>
                                            </div>
                                        )}

                                        {activeTab === 'workspaces' && (
                                            <div className="font-sans grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className={`p-4 rounded-xl border ${
                                                    isDark ? 'bg-zinc-900/80 border-orange-500/40' : 'bg-white border-orange-300 shadow-sm'
                                                }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-sm">hackathon-sprint</span>
                                                        <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">Active</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 mb-3">Real-time collaborative chat and web app.</p>
                                                    <span className="text-xs text-orange-500 font-semibold">4 Collaborators</span>
                                                </div>

                                                <div className={`p-4 rounded-xl border ${
                                                    isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-[#e7e5d8] shadow-sm'
                                                }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold text-sm">express-api-engine</span>
                                                        <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">Synced</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 mb-3">Backend microservice with auth.</p>
                                                    <span className="text-xs text-amber-500 font-semibold">2 Collaborators</span>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* LIVE HANDS-ON INTERACTIVE PLAYGROUND */}
            <section id="playground" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                        isDark ? 'text-white' : 'text-[#1c1917]'
                    }`}>
                        Try the Interactive Editor Right Here
                    </h2>
                    <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Edit the code snippet below or click "Run Code" to test WebContainer execution in real-time.
                    </p>
                </div>

                <div className={`rounded-3xl border shadow-xl overflow-hidden ${
                    isDark ? 'bg-[#0f1118] border-zinc-800' : 'bg-white border-[#e7e5d8] shadow-lg'
                }`}>
                    {/* Header */}
                    <div className={`h-12 px-4 flex items-center justify-between border-b ${
                        isDark ? 'bg-[#12141d] border-zinc-800' : 'bg-[#f8f8ea] border-[#e7e5d8]'
                    }`}>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-orange-500 flex items-center gap-1.5">
                                <i className="ri-play-circle-fill"></i>
                                sandbox/server.js
                            </span>
                        </div>
                        <button
                            onClick={handleRunInteractive}
                            disabled={isRunning}
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                        >
                            <i className={isRunning ? 'ri-loader-4-line animate-spin' : 'ri-play-fill'}></i>
                            <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
                        </button>
                    </div>

                    {/* Editor & Output split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Interactive textarea */}
                        <div className={`p-4 font-mono text-xs border-b lg:border-b-0 lg:border-r ${
                            isDark ? 'bg-[#08090d] border-zinc-800 text-zinc-200' : 'bg-[#fdfdf1] border-[#e7e5d8] text-zinc-900'
                        }`}>
                            <textarea
                                value={interactiveCode}
                                onChange={(e) => setInteractiveCode(e.target.value)}
                                rows={10}
                                className="w-full h-full bg-transparent resize-none focus:outline-none leading-relaxed font-mono text-xs"
                                spellCheck="false"
                            />
                        </div>

                        {/* Terminal output */}
                        <div className={`p-4 font-mono text-xs flex flex-col justify-between ${
                            isDark ? 'bg-[#090b10] text-zinc-300' : 'bg-[#1c1917] text-[#fdfdf1]'
                        }`}>
                            <div>
                                <span className="text-zinc-400 block mb-2 border-b border-zinc-700/60 pb-1 text-[11px]">
                                    Console Output
                                </span>
                                <div className="whitespace-pre-line text-[11px] leading-relaxed">
                                    {terminalOutput || 'Click "Run Code" above to execute this script.'}
                                </div>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-4">
                                Virtualized in-memory environment
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* USER-POV VALUE PILLARS */}
            <section id="benefits" className={`py-20 border-t transition-colors ${
                isDark ? 'bg-[#0d0f15] border-zinc-800' : 'bg-[#f8f8ea] border-[#e7e5d8]'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border ${
                            isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}>
                            <i className="ri-user-star-fill text-orange-500"></i>
                            Built For How Modern Teams Build
                        </div>
                        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
                            isDark ? 'text-white' : 'text-[#1c1917]'
                        }`}>
                            Everything You Need to Build Faster
                        </h2>
                        <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Say goodbye to 30-minute environment setups, broken node modules, and screen-sharing lag. Here is how CHATNCOLLAB empowers your daily coding flow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Benefit 1 */}
                        <div className={`p-6 rounded-2xl border transition-all ${
                            isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-orange-500/40' : 'bg-white border-[#e7e5d8] hover:border-orange-400 shadow-sm'
                        }`}>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl mb-4 font-bold">
                                <i className="ri-team-line"></i>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-orange-500 block mb-1">
                                Real-Time Multiplayer
                            </span>
                            <h4 className="font-bold text-base mb-2">Code Together Live</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Watch your teammates' edits live with synchronized multi-cursors and line-by-line updates. Discuss features directly inside integrated team chat right beside your code.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className={`p-6 rounded-2xl border transition-all ${
                            isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-amber-500/40' : 'bg-white border-[#e7e5d8] hover:border-amber-400 shadow-sm'
                        }`}>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mb-4 font-bold">
                                <i className="ri-sparkling-fill"></i>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500 block mb-1">
                                Integrated AI Co-Pilot
                            </span>
                            <h4 className="font-bold text-base mb-2">Your 24/7 Pair Partner</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Mention @ai in chat to scaffold entire file trees, write unit tests, generate boilerplate, or debug syntax errors. The code mounts directly into your project files.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className={`p-6 rounded-2xl border transition-all ${
                            isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-orange-500/40' : 'bg-white border-[#e7e5d8] hover:border-orange-400 shadow-sm'
                        }`}>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl mb-4 font-bold">
                                <i className="ri-terminal-box-line"></i>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-orange-500 block mb-1">
                                Zero-Install Runtime
                            </span>
                            <h4 className="font-bold text-base mb-2">Real In-Browser Terminal</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Install npm packages, execute scripts, and preview live web servers inside your browser tab without burning battery or consuming your local computer's memory.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className={`p-6 rounded-2xl border transition-all ${
                            isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-amber-500/40' : 'bg-white border-[#e7e5d8] hover:border-amber-400 shadow-sm'
                        }`}>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mb-4 font-bold">
                                <i className="ri-folder-user-line"></i>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500 block mb-1">
                                Instant Team Access
                            </span>
                            <h4 className="font-bold text-base mb-2">One-Click Project Sharing</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Spin up a new workspace in seconds and invite teammates by email. Everyone gets an identical, ready-to-run environment with zero "it works on my machine" issues.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* USE CASES & WORKFLOWS */}
            <section id="workflows" className={`py-20 border-t transition-colors ${
                isDark ? 'bg-[#090a0e] border-zinc-800' : 'bg-[#fdfdf1] border-[#e7e5d8]'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border ${
                            isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}>
                            <i className="ri-compass-3-fill text-orange-500"></i>
                            Use Cases
                        </div>
                        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
                            isDark ? 'text-white' : 'text-[#1c1917]'
                        }`}>
                            Designed for Every Coding Scenario
                        </h2>
                        <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            Whether you're building a side project, racing at a hackathon, or mentoring teammates, CHATNCOLLAB is your unfair advantage.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Use case 1 */}
                        <div className={`p-8 rounded-3xl border transition-all ${
                            isDark ? 'bg-zinc-900/80 border-zinc-800 hover:border-orange-500/40' : 'bg-white border-[#e7e5d8] hover:border-orange-400 shadow-sm'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl font-bold">
                                    <i className="ri-trophy-line"></i>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                    Sprint Ready
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Hackathons & Sprints</h3>
                            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mb-4">
                                Ship functional MVPs and full-stack web prototypes in hours. Split tasks between frontend, backend, and AI scaffolding without git collisions or merge conflicts.
                            </p>
                            <div className="pt-4 border-t border-zinc-800/40 text-xs font-semibold text-orange-500 flex items-center gap-1.5">
                                <i className="ri-check-line"></i>
                                <span>Zero-config immediate deployment</span>
                            </div>
                        </div>

                        {/* Use case 2 */}
                        <div className={`p-8 rounded-3xl border transition-all ${
                            isDark ? 'bg-zinc-900/80 border-zinc-800 hover:border-amber-500/40' : 'bg-white border-[#e7e5d8] hover:border-amber-400 shadow-sm'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">
                                    <i className="ri-bug-line"></i>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    Live Sync
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Remote Pair Programming</h3>
                            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mb-4">
                                Troubleshoot tough production bugs together in real time. Jump into the exact same file, inspect terminal logs together, and verify fixes collaboratively.
                            </p>
                            <div className="pt-4 border-t border-zinc-800/40 text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                                <i className="ri-check-line"></i>
                                <span>Shared terminal & simultaneous cursors</span>
                            </div>
                        </div>

                        {/* Use case 3 */}
                        <div className={`p-8 rounded-3xl border transition-all ${
                            isDark ? 'bg-zinc-900/80 border-zinc-800 hover:border-orange-500/40' : 'bg-white border-[#e7e5d8] hover:border-orange-400 shadow-sm'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl font-bold">
                                    <i className="ri-graduation-cap-line"></i>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                    No Downloads
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Interviews & Education</h3>
                            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mb-4">
                                Conduct technical coding interviews or coach junior engineers in a clean, fully functional browser sandbox with zero software dependencies to install.
                            </p>
                            <div className="pt-4 border-t border-zinc-800/40 text-xs font-semibold text-orange-500 flex items-center gap-1.5">
                                <i className="ri-check-line"></i>
                                <span>Sandboxed browser isolation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-20 relative text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <div className={`p-10 sm:p-14 rounded-3xl border shadow-xl ${
                        isDark ? 'bg-zinc-900 border-orange-500/30' : 'bg-white border-orange-300 shadow-orange-500/10'
                    }`}>
                        <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
                            isDark ? 'text-white' : 'text-[#1c1917]'
                        }`}>
                            Ready to Code with Your Squad?
                        </h2>
                        <p className={`mt-3 text-sm sm:text-base max-w-lg mx-auto ${
                            isDark ? 'text-zinc-300' : 'text-zinc-600'
                        }`}>
                            Create your first collaborative workspace and invite teammates in 30 seconds.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => navigate(user ? '/dashboard' : '/register')}
                                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all transform hover:-translate-y-0.5"
                            >
                                <i className="ri-flashlight-fill mr-1.5"></i>
                                {user ? 'Go to Your Workspaces' : 'Create Free Account'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={`border-t py-12 text-xs transition-colors ${
                isDark ? 'bg-[#07070b] border-zinc-800 text-zinc-400' : 'bg-[#f8f8ea] border-[#e7e5d8] text-zinc-600'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-zinc-950 font-bold">
                            <i className="ri-code-s-slash-line"></i>
                        </div>
                        <span className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-[#1c1917]'}`}>
                            CHATNCOLLAB
                        </span>
                        <span>•</span>
                        <span>© 2026 CHATNCOLLAB. Real-time Collaborative Engine.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                        <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
                        <Link to="/login" className="hover:text-orange-500 transition-colors">Sign In</Link>
                        <ThemeToggle />
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Landing
