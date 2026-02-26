// import React, { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark";

// interface ThemeContextType {
//   theme: Theme;
//   toggleTheme?: () => void;
//   switchable: boolean;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// interface ThemeProviderProps {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
//   switchable?: boolean;
// }

// export function ThemeProvider({
//   children,
//   defaultTheme = "light",
//   switchable = false,
// }: ThemeProviderProps) {
//   const [theme, setTheme] = useState<Theme>(() => {
//     if (switchable) {
//       const stored = localStorage.getItem("theme");
//       return (stored as Theme) || defaultTheme;
//     }
//     return defaultTheme;
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") {
//       root.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//     }

//     if (switchable) {
//       localStorage.setItem("theme", theme);
//     }
//   }, [theme, switchable]);

//   const toggleTheme = switchable
//     ? () => {
//         setTheme(prev => (prev === "light" ? "dark" : "light"));
//       }
//     : undefined;

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within ThemeProvider");
//   }
//   return context;
// }

/**
 * CHESS Theme Context
 * Manages dark/light mode with localStorage persistence
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "chess-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get theme from localStorage or default to light
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === "dark" ? "dark" : "light") as Theme;
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}