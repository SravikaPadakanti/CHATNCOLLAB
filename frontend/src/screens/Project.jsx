import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
import ThemeToggle from '../components/ThemeToggle'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js'
import { getWebContainer } from '../config/webContainer'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { isDark } = useTheme()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set())
    const [ project, setProject ] = useState(location.state?.project || null)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = useRef(null)

    const [ users, setUsers ] = useState([])
    const [ userSearch, setUserSearch ] = useState('')
    const [ inviteEmail, setInviteEmail ] = useState('')
    const [ inviteStatus, setInviteStatus ] = useState({ text: '', type: '' })
    const [ copiedInviteLink, setCopiedInviteLink ] = useState(false)
    const [ messages, setMessages ] = useState([])
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)
    const [ isRunningCode, setIsRunningCode ] = useState(false)
    const [ terminalLogs, setTerminalLogs ] = useState([])
    const [ showTerminal, setShowTerminal ] = useState(false)
    const [ runProcess, setRunProcess ] = useState(null)

    const copyInviteLink = () => {
        const pId = project?._id || location.state?.project?._id || new URLSearchParams(location.search).get('id')
        if (!pId) return
        const link = `${window.location.origin}/project?id=${pId}`
        navigator.clipboard.writeText(link).then(() => {
            setCopiedInviteLink(true)
            setTimeout(() => setCopiedInviteLink(false), 2500)
        }).catch(() => {
            setInviteStatus({ text: `Share this link: ${link}`, type: 'info' })
        })
    }

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId)
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id)
            } else {
                newSelectedUserId.add(id)
            }
            return newSelectedUserId
        })
    }

    function addCollaborators() {
        const pId = project?._id || location.state?.project?._id || new URLSearchParams(location.search).get('id')
        if (!pId) return
        setInviteStatus({ text: '', type: '' })

        const payload = {
            projectId: pId,
            users: Array.from(selectedUserId)
        }

        if (inviteEmail.trim()) {
            payload.email = inviteEmail.trim()
        }

        axios.put('/projects/add-user', payload).then(res => {
            if (res.data.project) {
                setProject(res.data.project)
            }
            setInviteStatus({ text: res.data.message || 'Collaborator added successfully!', type: 'success' })
            setSelectedUserId(new Set())
            setInviteEmail('')
            setTimeout(() => {
                setIsModalOpen(false)
                setInviteStatus({ text: '', type: '' })
            }, 1500)
        }).catch(err => {
            console.error('Failed to add collaborators:', err)
            const errMsg = err.response?.data?.error || 'Failed to add collaborator.'
            setInviteStatus({ text: errMsg, type: 'error' })
        })
    }

    const send = () => {
        if (!message.trim()) return

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prev => [ ...prev, { sender: user, message } ])
        setMessage('')
    }

    function WriteAiMessage(rawMsg) {
        let messageObject
        try {
            messageObject = typeof rawMsg === 'string' ? JSON.parse(rawMsg) : rawMsg
        } catch {
            messageObject = { text: rawMsg }
        }

        return (
            <div className={`overflow-auto border rounded-xl p-3 shadow-md ${
                isDark ? 'bg-[#07080c] border-orange-500/30 text-zinc-200' : 'bg-white border-orange-300 text-zinc-800'
            }`}>
                <div className="flex items-center justify-between text-[11px] font-bold text-orange-500 mb-2 pb-1.5 border-b border-zinc-800/40">
                    <span className="flex items-center gap-1.5">
                        <i className="ri-sparkling-fill text-amber-500"></i>
                        GEMINI AI ASSISTANT
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-300">
                        Code Generator
                    </span>
                </div>
                <div className="prose prose-invert prose-xs max-w-none text-xs">
                    <Markdown
                        children={messageObject.text || ''}
                        options={{
                            overrides: {
                                code: SyntaxHighlightedCode,
                            },
                        }}
                    />
                </div>
                {messageObject.fileTree && (
                    <div className="mt-3 pt-2 border-t border-zinc-800/40 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Created Files:</span>
                        {Object.keys(messageObject.fileTree).map(fname => (
                            <button
                                key={fname}
                                onClick={() => {
                                    setCurrentFile(fname)
                                    setOpenFiles(prev => [ ...new Set([ ...prev, fname ]) ])
                                }}
                                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors flex items-center gap-1 ${
                                    isDark
                                        ? 'bg-zinc-800 hover:bg-orange-500 hover:text-black text-orange-400 border-zinc-700'
                                        : 'bg-zinc-100 hover:bg-orange-500 hover:text-white text-orange-600 border-zinc-300'
                                }`}
                            >
                                <i className="ri-file-code-line"></i>
                                {fname}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const urlProjectId = queryParams.get('id') || queryParams.get('projectId')
        const effectiveProjectId = project?._id || location.state?.project?._id || urlProjectId

        if (!effectiveProjectId) {
            navigate('/dashboard')
            return
        }

        initializeSocket(effectiveProjectId)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
            }).catch(e => {
                console.warn('WebContainer notice:', e)
            })
        }

        receiveMessage('project-message', data => {
            if (data.sender._id === 'ai') {
                try {
                    const parsed = JSON.parse(data.message)
                    if (parsed.fileTree) {
                        webContainer?.mount(parsed.fileTree)
                        setFileTree(prev => ({ ...prev, ...parsed.fileTree }))
                        const firstFile = Object.keys(parsed.fileTree)[0]
                        if (firstFile) {
                            setCurrentFile(firstFile)
                            setOpenFiles(prev => [ ...new Set([ ...prev, firstFile ]) ])
                        }
                    }
                } catch (e) {
                    console.log('Plain text AI response:', e)
                }
            }
            setMessages(prev => [ ...prev, data ])
        })

        // Automatically join or fetch project by ID
        axios.post('/projects/join', { projectId: effectiveProjectId }).then(res => {
            const p = res.data.project
            setProject(p)
            if (p.fileTree) {
                setFileTree(p.fileTree)
                const files = Object.keys(p.fileTree)
                if (files.length > 0) {
                    setCurrentFile(files[0])
                    setOpenFiles([ files[0] ])
                }
            }
        }).catch(() => {
            axios.get(`/projects/get-project/${effectiveProjectId}`).then(res => {
                const p = res.data.project
                setProject(p)
                if (p.fileTree) {
                    setFileTree(p.fileTree)
                    const files = Object.keys(p.fileTree)
                    if (files.length > 0) {
                        setCurrentFile(files[0])
                        setOpenFiles([ files[0] ])
                    }
                }
            }).catch(err => {
                console.error('Error fetching project:', err)
                navigate('/dashboard')
            })
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users || [])
        }).catch(err => {
            console.error('Error fetching users:', err)
        })

    }, [])

    useEffect(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight
        }
    }, [ messages ])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).catch(err => console.error('Failed to save file tree:', err))
    }

    const runProjectCode = async () => {
        if (!webContainer) {
            alert('WebContainer is initializing. Please try again in a few moments.')
            return
        }

        setIsRunningCode(true)
        setShowTerminal(true)
        setTerminalLogs(prev => [ ...prev, '⚡ Mounting files into in-browser container...' ])

        try {
            await webContainer.mount(fileTree)
            setTerminalLogs(prev => [ ...prev, '✓ Files mounted. Running npm install...' ])

            const installProcess = await webContainer.spawn('npm', [ 'install' ])
            installProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    setTerminalLogs(prev => [ ...prev, chunk ])
                }
            }))

            const installExitCode = await installProcess.exit
            if (installExitCode !== 0) {
                setTerminalLogs(prev => [ ...prev, '⚠️ npm install finished with warnings' ])
            } else {
                setTerminalLogs(prev => [ ...prev, '✓ Dependencies installed. Starting server...' ])
            }

            if (runProcess) {
                runProcess.kill()
            }

            const tempRunProcess = await webContainer.spawn('npm', [ 'start' ])
            tempRunProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    setTerminalLogs(prev => [ ...prev, chunk ])
                }
            }))

            setRunProcess(tempRunProcess)

            webContainer.on('server-ready', (port, url) => {
                setIframeUrl(url)
                setTerminalLogs(prev => [ ...prev, `🚀 Live preview online at ${url}` ])
                setIsRunningCode(false)
            })

        } catch (err) {
            console.error('Execution error:', err)
            setTerminalLogs(prev => [ ...prev, `❌ Error: ${err.message}` ])
            setIsRunningCode(false)
        }
    }

    const closeTab = (e, fileToClose) => {
        e.stopPropagation()
        const remaining = openFiles.filter(f => f !== fileToClose)
        setOpenFiles(remaining)
        if (currentFile === fileToClose) {
            setCurrentFile(remaining.length > 0 ? remaining[ remaining.length - 1 ] : null)
        }
    }

    return (
        <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans transition-colors duration-200 selection:bg-orange-500 selection:text-black ${
            isDark ? 'bg-[#090a0e] text-zinc-100' : 'bg-[#fafaf8] text-zinc-900'
        }`}>
            
            {/* Top Workspace Header */}
            <header className={`h-14 border-b flex items-center justify-between px-4 shrink-0 z-30 transition-colors ${
                isDark ? 'bg-[#0d0f15] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
                <div className="flex items-center gap-4">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                isDark
                                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-orange-400 border-zinc-800'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-orange-600 border-zinc-200'
                            }`}
                        >
                            <i className="ri-home-4-line text-sm text-orange-500"></i>
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                isDark
                                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-orange-400 border-zinc-800'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-orange-600 border-zinc-200'
                            }`}
                        >
                            <i className="ri-dashboard-line text-sm text-amber-500"></i>
                            <span>Dashboard</span>
                        </Link>
                    </div>

                    <div className={`h-4 w-[1px] ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>

                    {/* Project Title */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center text-sm font-bold">
                            <i className="ri-folder-3-fill"></i>
                        </div>
                        <span className={`font-bold text-sm tracking-tight truncate max-w-[200px] ${
                            isDark ? 'text-white' : 'text-zinc-900'
                        }`}>
                            {project?.name || 'Workspace'}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                            Live Room
                        </span>
                    </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2.5">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                            isDark ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
                        }`}
                    >
                        <i className="ri-group-line text-orange-500"></i>
                        <span>{project?.users?.length || 1} Member{project?.users?.length > 1 ? 's' : ''}</span>
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-xs shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
                    >
                        <i className="ri-user-add-line text-sm"></i>
                        <span>Invite</span>
                    </button>

                    <button
                        onClick={runProjectCode}
                        disabled={isRunningCode || Object.keys(fileTree).length === 0}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-orange-500 font-bold text-xs transition-all disabled:opacity-40 ${
                            isDark ? 'bg-zinc-900 hover:bg-zinc-800 border-orange-500/40' : 'bg-white hover:bg-zinc-50 border-orange-400 shadow-sm'
                        }`}
                    >
                        <i className={isRunningCode ? "ri-loader-4-line animate-spin text-sm" : "ri-play-fill text-sm"}></i>
                        <span>{isRunningCode ? 'Running...' : 'Run Project'}</span>
                    </button>
                </div>
            </header>

            {/* Main Workspace Body */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* LEFT PANEL: CHAT & AI CO-PILOT */}
                <section className={`w-80 sm:w-96 border-r flex flex-col shrink-0 relative z-10 transition-colors ${
                    isDark ? 'bg-[#0c0e14] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}>
                    
                    <div className={`h-11 px-4 border-b flex items-center justify-between shrink-0 ${
                        isDark ? 'bg-[#10121a] border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                    }`}>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                            <i className="ri-chat-3-line text-orange-500"></i>
                            Project Discussion
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 font-bold">
                            @ai Co-Pilot
                        </span>
                    </div>

                    <div
                        ref={messageBox}
                        className="flex-1 p-3 overflow-y-auto space-y-3 message-box"
                    >
                        {messages.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg mx-auto mb-2 border border-orange-500/20">
                                    <i className="ri-chat-smile-2-line"></i>
                                </div>
                                <p className="text-xs font-semibold">Welcome to #{project?.name}</p>
                                <p className="text-[11px] text-zinc-400 mt-1">
                                    Chat with teammates or prompt the AI:
                                </p>
                                <button
                                    onClick={() => setMessage('@ai create an express server')}
                                    className={`mt-3 px-2.5 py-1 rounded-lg border text-[11px] font-mono text-orange-500 transition-colors ${
                                        isDark ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/40' : 'bg-white border-zinc-300 hover:border-orange-400 shadow-sm'
                                    }`}
                                >
                                    @ai create an express server
                                </button>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            const isMe = msg.sender?._id === user?._id?.toString()
                            const isAi = msg.sender?._id === 'ai'

                            if (isAi) {
                                return (
                                    <div key={index} className="w-full">
                                        {WriteAiMessage(msg.message)}
                                    </div>
                                )
                            }

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} text-xs`}
                                >
                                    <span className="text-[10px] text-zinc-400 mb-1 px-1">
                                        {isMe ? 'You' : msg.sender?.email || 'User'}
                                    </span>
                                    <div
                                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                            isMe
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-medium rounded-tr-none shadow-sm'
                                                : isDark
                                                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                                                    : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
                                        }`}
                                    >
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Chat Input */}
                    <div className={`p-3 border-t shrink-0 ${
                        isDark ? 'bg-[#10121a] border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                    }`}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                send()
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message or @ai prompt..."
                                className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
                                    isDark
                                        ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-orange-500'
                                        : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-orange-500'
                                }`}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-40 text-zinc-950 font-bold flex items-center justify-center transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0"
                            >
                                <i className="ri-send-plane-fill text-base"></i>
                            </button>
                        </form>
                    </div>

                    {/* Collaborator Side Slide-over Panel */}
                    <div
                        className={`absolute inset-0 z-20 flex flex-col transition-transform duration-300 ${
                            isDark ? 'bg-[#0c0e14]' : 'bg-white'
                        } ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className={`h-14 px-4 border-b flex items-center justify-between ${
                            isDark ? 'bg-[#10121a] border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                        }`}>
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <i className="ri-group-line text-orange-500"></i>
                                Active Collaborators
                            </h3>
                            <button
                                onClick={() => setIsSidePanelOpen(false)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                    isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
                                }`}
                            >
                                <i className="ri-close-line text-base"></i>
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto space-y-2">
                            {project?.users?.map(u => (
                                <div
                                    key={u._id || u.email}
                                    className={`p-3 rounded-xl border flex items-center gap-3 ${
                                        isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-xs font-bold text-black">
                                        {u.email ? u.email.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">{u.email}</p>
                                        <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Connected
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

                {/* MIDDLE PANEL: FILE EXPLORER */}
                <section className={`w-56 border-r flex flex-col shrink-0 transition-colors ${
                    isDark ? 'bg-[#0e1017] border-zinc-800' : 'bg-[#f4f4f6] border-zinc-200'
                }`}>
                    <div className={`h-11 px-4 border-b flex items-center justify-between shrink-0 ${
                        isDark ? 'bg-[#12141c] border-zinc-800' : 'bg-zinc-200/80 border-zinc-200'
                    }`}>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                            <i className="ri-folder-2-line text-amber-500"></i>
                            Files
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                            {Object.keys(fileTree).length} files
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {Object.keys(fileTree).length === 0 ? (
                            <div className="text-center py-10 px-3 text-zinc-500 text-[11px]">
                                No files yet. Prompt @ai to scaffold code.
                            </div>
                        ) : (
                            Object.keys(fileTree).map((fileName) => {
                                const isActive = currentFile === fileName
                                return (
                                    <button
                                        key={fileName}
                                        onClick={() => {
                                            setCurrentFile(fileName)
                                            setOpenFiles(prev => [ ...new Set([ ...prev, fileName ]) ])
                                        }}
                                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all text-left ${
                                            isActive
                                                ? 'bg-orange-500/15 text-orange-500 border border-orange-500/30 font-semibold'
                                                : isDark
                                                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                                    : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/70'
                                        }`}
                                    >
                                        <i className="ri-file-code-line text-sm text-orange-500 shrink-0"></i>
                                        <span className="truncate">{fileName}</span>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </section>

                {/* RIGHT PANEL: CODE EDITOR & TERMINAL */}
                <section className={`flex-1 flex flex-col min-w-0 transition-colors ${
                    isDark ? 'bg-[#07080c]' : 'bg-white'
                }`}>
                    
                    {/* File Tabs */}
                    <div className={`h-11 border-b flex items-center justify-between px-2 shrink-0 overflow-x-auto ${
                        isDark ? 'bg-[#10121a] border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                    }`}>
                        <div className="flex items-center gap-1">
                            {openFiles.length === 0 ? (
                                <span className="text-xs text-zinc-500 px-3">No active tab</span>
                            ) : (
                                openFiles.map(f => {
                                    const isActive = currentFile === f
                                    return (
                                        <div
                                            key={f}
                                            onClick={() => setCurrentFile(f)}
                                            className={`group cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all ${
                                                isActive
                                                    ? isDark
                                                        ? 'bg-[#07080c] text-orange-400 border-orange-500/40 font-semibold shadow-sm'
                                                        : 'bg-white text-orange-600 border-orange-400 font-semibold shadow-sm'
                                                    : isDark
                                                        ? 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                                                        : 'bg-zinc-200/60 text-zinc-600 border-zinc-300 hover:text-zinc-900'
                                            }`}
                                        >
                                            <i className="ri-file-code-line text-xs"></i>
                                            <span>{f}</span>
                                            <button
                                                onClick={(e) => closeTab(e, f)}
                                                className="hover:text-rose-500 transition-colors ml-1 opacity-70 group-hover:opacity-100"
                                            >
                                                <i className="ri-close-line text-xs"></i>
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Terminal toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowTerminal(!showTerminal)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                                    showTerminal
                                        ? 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                                        : isDark
                                            ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                                            : 'bg-zinc-200 text-zinc-600 border-zinc-300'
                                }`}
                            >
                                <i className="ri-terminal-box-line"></i>
                                <span>Terminal</span>
                            </button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 flex overflow-hidden">
                        <div className={`flex-1 flex flex-col overflow-auto ${
                            isDark ? 'bg-[#08090d]' : 'bg-[#fcfcfd]'
                        }`}>
                            {currentFile && fileTree[currentFile] ? (
                                <div className="flex-1 p-4 font-mono text-xs overflow-auto">
                                    <pre className="h-full">
                                        <code
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText
                                                const ft = {
                                                    ...fileTree,
                                                    [ currentFile ]: {
                                                        file: { contents: updatedContent }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: hljs.highlight(
                                                    currentFile.endsWith('.json') ? 'json' : 'javascript',
                                                    fileTree[currentFile]?.file?.contents || ''
                                                ).value
                                            }}
                                            className="outline-none block w-full leading-relaxed"
                                            style={{ whiteSpace: 'pre-wrap' }}
                                        />
                                    </pre>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-3xl mb-4 border border-orange-500/20">
                                        <i className="ri-code-s-slash-line"></i>
                                    </div>
                                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                        Collaborative Code Studio
                                    </h3>
                                    <p className={`text-xs max-w-md leading-relaxed mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                        Select any file from the explorer on the left to start editing, or tag{' '}
                                        <span className="text-orange-500 font-bold">@ai</span> in the chat room to scaffold fullstack boilerplate.
                                    </p>
                                    <button
                                        onClick={() => {
                                            const sampleApp = {
                                                'server.js': {
                                                    file: {
                                                        contents: `import express from 'express';\nconst app = express();\n\napp.get('/', (req, res) => {\n    res.send('Hello from CHATNCOLLAB Studio!');\n});\n\napp.listen(3000, () => {\n    console.log('Server is running on port 3000');\n});`
                                                    }
                                                },
                                                'package.json': {
                                                    file: {
                                                        contents: `{\n  "name": "chatncollab-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "start": "node server.js"\n  },\n  "dependencies": {\n    "express": "^4.21.2"\n  }\n}`
                                                    }
                                                }
                                            }
                                            setFileTree(sampleApp)
                                            saveFileTree(sampleApp)
                                            setCurrentFile('server.js')
                                            setOpenFiles([ 'server.js', 'package.json' ])
                                        }}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-all hover:opacity-95"
                                    >
                                        <i className="ri-magic-line mr-1"></i>
                                        Scaffold Starter Express Server
                                    </button>
                                </div>
                            )}

                            {/* Bottom Terminal Drawer */}
                            {showTerminal && (
                                <div className="h-48 bg-[#090b10] border-t border-zinc-800 p-3 font-mono text-[11px] overflow-y-auto shrink-0 flex flex-col justify-between text-zinc-300">
                                    <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
                                        <span className="font-bold text-orange-400 flex items-center gap-1.5">
                                            <i className="ri-terminal-box-line"></i>
                                            WebContainer Terminal
                                        </span>
                                        <button onClick={() => setShowTerminal(false)} className="hover:text-white">
                                            <i className="ri-close-line"></i>
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-1">
                                        {terminalLogs.length === 0 ? (
                                            <span className="text-zinc-500">Terminal ready. Click "Run Project" to execute.</span>
                                        ) : (
                                            terminalLogs.map((log, i) => (
                                                <div key={i} className="whitespace-pre-wrap">{log}</div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {iframeUrl && (
                            <div className="w-1/2 border-l border-zinc-800 flex flex-col bg-white">
                                <div className="h-10 bg-[#12141c] border-b border-zinc-800 flex items-center px-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const curr = iframeUrl
                                            setIframeUrl('')
                                            setTimeout(() => setIframeUrl(curr), 50)
                                        }}
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        <i className="ri-restart-line text-xs"></i>
                                    </button>
                                    <input
                                        type="text"
                                        value={iframeUrl}
                                        readOnly
                                        className="flex-1 bg-zinc-900 text-zinc-300 text-[11px] px-3 py-1 rounded-md border border-zinc-800"
                                    />
                                </div>
                                <iframe src={iframeUrl} title="Live App Preview" className="w-full flex-1 border-none" />
                            </div>
                        )}
                    </div>
                </section>

            </div>

            {/* INVITE COLLABORATORS MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className={`border p-6 rounded-2xl w-full max-w-md relative shadow-2xl ${
                        isDark ? 'bg-[#10121a] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
                    }`}>
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-bold flex items-center gap-2">
                                <i className="ri-user-add-line text-orange-500"></i>
                                Invite Collaborator to Workspace
                            </h2>
                            <button
                                onClick={() => { setIsModalOpen(false); setInviteStatus({ text: '', type: '' }); }}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                            >
                                <i className="ri-close-line text-lg"></i>
                            </button>
                        </header>

                        {/* 1. Shareable Project Invite Link */}
                        <div className={`p-3.5 rounded-xl border mb-4 ${
                            isDark ? 'bg-[#151824] border-orange-500/30' : 'bg-orange-50/70 border-orange-300'
                        }`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
                                    <i className="ri-link"></i> Project Invite Link
                                </span>
                                <span className="text-[10px] text-zinc-400">Instant access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/project?id=${project?._id || ''}`}
                                    className={`flex-1 text-xs px-3 py-2 rounded-lg font-mono border select-all ${
                                        isDark
                                            ? 'bg-black/60 border-zinc-800 text-zinc-200'
                                            : 'bg-white border-zinc-300 text-zinc-800'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={copyInviteLink}
                                    className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                                        copiedInviteLink
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-orange-500 hover:bg-orange-400 text-black'
                                    }`}
                                >
                                    <i className={copiedInviteLink ? "ri-check-line font-bold" : "ri-file-copy-line"}></i>
                                    <span>{copiedInviteLink ? 'Copied!' : 'Copy Link'}</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-2">
                                Anyone with this link automatically joins this collaborative room upon opening it.
                            </p>
                        </div>

                        {/* 2. Invite By Email */}
                        <div className="mb-4">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                                Invite by Teammate Email
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@example.com"
                                    className={`flex-1 border text-xs px-3 py-2 rounded-lg placeholder-zinc-500 focus:outline-none focus:border-orange-500 ${
                                        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                                    }`}
                                    onKeyDown={(e) => { if (e.key === 'Enter') addCollaborators(); }}
                                />
                                <button
                                    type="button"
                                    onClick={addCollaborators}
                                    disabled={!inviteEmail.trim()}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-all disabled:opacity-40"
                                >
                                    Invite
                                </button>
                            </div>
                            {inviteStatus.text && (
                                <p className={`text-xs mt-2 font-medium ${inviteStatus.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {inviteStatus.text}
                                </p>
                            )}
                        </div>

                        {/* 3. Registered Users Selection */}
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                Registered Users ({users.length})
                            </label>
                            {users.length > 2 && (
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                    className="text-[11px] bg-transparent border-b border-zinc-700 px-1 py-0.5 text-zinc-300 focus:outline-none focus:border-orange-500"
                                />
                            )}
                        </div>

                        <div className="users-list flex flex-col gap-2 mb-6 max-h-40 overflow-y-auto">
                            {users.length === 0 ? (
                                <div className="text-center py-4 px-2 border border-dashed border-zinc-800 rounded-xl">
                                    <p className="text-xs text-zinc-400 mb-1">No other registered users in the database yet.</p>
                                    <p className="text-[11px] text-orange-400">Use the <strong>Project Invite Link</strong> above to share with your teammates!</p>
                                </div>
                            ) : (
                                users
                                    .filter(u => !userSearch || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                                    .map(u => {
                                        const isSelected = selectedUserId.has(u._id)
                                        return (
                                            <div
                                                key={u._id}
                                                onClick={() => handleUserClick(u._id)}
                                                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                                                    isSelected
                                                        ? 'bg-orange-500/15 border-orange-500'
                                                        : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-black font-bold flex items-center justify-center text-xs">
                                                        {u.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs font-medium truncate max-w-[200px]">{u.email}</span>
                                                </div>
                                                <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                                    isSelected ? 'bg-orange-500 border-orange-500 text-black' : 'border-zinc-500'
                                                }`}>
                                                    {isSelected && <i className="ri-check-line text-[10px] font-bold"></i>}
                                                </div>
                                            </div>
                                        )
                                    })
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/40">
                            <button
                                type="button"
                                onClick={() => { setIsModalOpen(false); setInviteStatus({ text: '', type: '' }); }}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                                    isDark ? 'bg-zinc-900 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                                }`}
                            >
                                Close
                            </button>
                            <button
                                onClick={addCollaborators}
                                disabled={selectedUserId.size === 0 && !inviteEmail.trim()}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all disabled:opacity-40"
                            >
                                {selectedUserId.size > 0 ? `Add (${selectedUserId.size}) Selected` : 'Add Collaborator'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Project