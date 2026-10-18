import React from 'react'
import { useTheme } from '../context/theme.context'

const ThemeToggle = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isDark
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 hover:border-amber-500/40'
                    : 'bg-white hover:bg-zinc-100 text-orange-600 border border-zinc-200 shadow-sm'
            } ${className}`}
        >
            {isDark ? (
                <i className="ri-sun-line text-base transition-transform hover:rotate-45"></i>
            ) : (
                <i className="ri-moon-clear-line text-base transition-transform hover:-rotate-12"></i>
            )}
        </button>
    )
}

export default ThemeToggle
