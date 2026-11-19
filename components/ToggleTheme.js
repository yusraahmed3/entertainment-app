
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

const ToggleButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-11 w-11 rounded-xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-[#1D1F2B]"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:border-[#A78BFA] hover:text-[#8B5CF6] dark:border-white/10 dark:bg-[#1D1F2B] dark:text-[#C4B5FD] dark:hover:border-[#A78BFA]"
    >
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default ToggleButton;
