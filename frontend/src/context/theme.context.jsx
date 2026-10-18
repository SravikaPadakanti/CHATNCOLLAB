import React, { createContext, useState, useEffect, useContext } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [ theme, setTheme ] = useState(() => {
        try {
            const saved = localStorage.getItem('chatncollab_theme')
            if (saved === 'light' || saved === 'dark') return saved
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
        } catch {
            return 'dark'
        }
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
            root.classList.remove('light')
        } else {
            root.classList.add('light')
            root.classList.remove('dark')
        }
        try {
            localStorage.setItem('chatncollab_theme', theme)
        } catch (e) {
            console.error('Failed to save theme in localStorage:', e)
        }
    }, [ theme ])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
