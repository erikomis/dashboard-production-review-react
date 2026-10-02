import { Moon, Sun } from "lucide-react";
import useColorMode from "@/shared/hooks/useColorMode";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <li>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Modo escuro"
        title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
        onClick={() => setColorMode(isDark ? "light" : "dark")}
        className={`relative block h-7.5 w-14 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          isDark ? "bg-primary" : "bg-stroke"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-switcher transition-transform duration-150 ${
            isDark ? "translate-x-[26px]" : "translate-x-0"
          }`}
        >
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </span>
      </button>
    </li>
  );
};

export default DarkModeSwitcher;
