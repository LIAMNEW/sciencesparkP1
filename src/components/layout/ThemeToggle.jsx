import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = React.useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark/light mode"
      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Light-switch track */}
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${dark ? "bg-purple-600" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center ${dark ? "translate-x-5" : "translate-x-0"}`}>
          {dark
            ? <Moon className="w-3 h-3 text-purple-600" />
            : <Sun className="w-3 h-3 text-yellow-500" />
          }
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {dark ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}