import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
const ToggleButton = () => {
  let currentTheme = "";

  useEffect(() => {
    currentTheme = localStorage.getItem("theme");
  }, []);

  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="flex items-center">
      <input
        onClick={() => {
          setIsDark(!isDark);
          setTheme(theme === "dark" ? "light" : "dark");
        }}
        type="checkbox"
        id="toggle-switch"
        className="cursor-pointer h-4 w-8 md:h-8 md:w-16 rounded-full appearance-none bg-gradient-to-b checked:from-cyan-500 checked:to-blue-300 bg-opacity-20 border border-blue  from-[#191970] to-[#663399] transition duration-200 relative after:w-4 after:h-4 md:after:h-8 md:after:w-8 after:rounded-full after:absolute checked:after:bg-yellow-300 checked:after:shadow-sm checked:after:shadow-yellow-300 after:left-0 after:top-0 after:z-10 after:transform after:scale-110 after:transition after:duration-200 after:bg-neutral-300 after:shadow-neutral-300 checked:after:translate-x-4 md:checked:after:translate-x-8"
      />
      <div
        className={`absolute bg-white ${
          isDark ? "w-[2px]  translate-x-8" : "w-4"
        }  right-16 rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200  h-[2px] `}
      ></div>
      <div
        className={`absolute bg-white ${
          isDark
            ? "w-[2px] h-[2px] -translate-x-1 translate-y-1"
            : "w-3 md:w-4 h-[1px] right-9 top-[102px] md:right-auto md:top-auto"
        }  right-6 rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200`}
      ></div>
      <div
        className={`absolute bg-white ${
          isDark ? "w-[4px] h-[4px] " : "w-5 md:w-6 h-1 top-[105px] md:top-auto"
        } right-6 md:right-9 md:top-12 rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200 `}
      ></div>
      <div
        className={`absolute bg-white ${
          isDark
            ? "w-[3px] h-[3px] md:w-[5px] md:h-[5px] "
            : " w-3 h-[3px] md:w-5 md:h-[3px]"
        } right-7 md:right-10 top-[98px] md:top-7 z-20 rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200 `}
      ></div>
      {isDark && (
        <>
          <div className="absolute bg-[#deb887] w-2  md:w-3 h-1 -rotate-45 top-[100px] md:top-[30px]  shadow-zinc-800 shadow-inner opacity-30 z-50 rounded-[50%]"></div>
          <div className="absolute bg-[#deb887] w-1 md:w-2 h-2 -rotate-45 top-24 md:top-7 right-[37px] md:right-[53px] shadow-zinc-800 shadow-inner opacity-30 z-50 rounded-[50%]"></div>
        </>
      )}
    </div>
  );
};

export default ToggleButton;
