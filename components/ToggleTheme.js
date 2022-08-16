import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
const ToggleButton = () => {
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
          isDark ? "w-[2px]  translate-x-8 right-16" : "w-3 md:w-4"
        }   rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200  h-[2px] `}
      ></div>
      <div
        className={`absolute bg-white ${
          isDark
            ? "w-[2px] h-[2px] md:w-[3px] md:h-[3px] -translate-x-1 translate-y-1 right-7 md:right-6"
            : "w-2 md:w-4 h-[1px] right-9 top-[102px] md:right-auto md:top-auto"
        }   rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200`}
      ></div>
      <div
        className={`absolute bg-white ${
          isDark
            ? "w-[4px] h-[4px]  "
            : "w-4 md:w-6 h-[3px] top-[115px] md:top-auto"
        } right-9 md:right-9 md:top-10 rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200 `}
      ></div>
      <div
        className={`absolute bg-white ${
          isDark
            ? "w-[3px] h-[3px] md:w-[5px] md:h-[5px] "
            : " w-2 h-[3px] md:w-5 md:h-[3px]"
        } right-10 top-[106px] md:top-6 z-20 rounded-[50%] ${
          isDark && "shadow-sm shadow-violet-500"
        } transition duration-200 `}
      ></div>
      {isDark && (
        <>
          <div className="absolute bg-[#deb887] w-2  md:w-3 h-1 -rotate-45 top-[105px] md:top-[25px]  shadow-zinc-800 shadow-inner opacity-30 z-50 rounded-[50%]"></div>
          <div className="absolute bg-[#deb887] w-1 md:w-2 h-2 -rotate-45 top-[106px] md:top-7 right-[45px] md:right-[53px] shadow-zinc-800 shadow-inner opacity-30 z-50 rounded-[50%]"></div>
        </>
      )}
    </div>
  );
};

export default ToggleButton;
