import React, { createContext, useContext, useEffect, useState } from 'react';
import { getThemeColors, saveThemeColors, ThemeColors, DEFAULT_THEME } from '../services/settingsService';

interface ThemeContextType {
    theme: ThemeColors;
    setTheme: (colors: ThemeColors) => void;
    saveTheme: (colors: ThemeColors) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeColors>(DEFAULT_THEME);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        const colors = await getThemeColors();
        setThemeState(colors);
        applyTheme(colors);
    };

    const applyTheme = (colors: ThemeColors) => {
        const root = document.documentElement;
        root.style.setProperty('--background-dark', colors.background);
        root.style.setProperty('--surface-dark', colors.surface);
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--accent-gold', colors.secondary);
        root.style.setProperty('--accent-magenta', colors.accent);
    };

    const setTheme = (colors: ThemeColors) => {
        setThemeState(colors);
        applyTheme(colors);
    };

    const saveTheme = async (colors: ThemeColors) => {
        await saveThemeColors(colors);
        setTheme(colors);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, saveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
