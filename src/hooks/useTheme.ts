"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/store/mapStore";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const { setMapStyleType } = useMapStore();

  useEffect(() => {
    const savedTheme = (localStorage.getItem("railgaadi-theme") as Theme) || "light";
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("railgaadi-theme", newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (t: Theme) => {
    const isDark =
      t === "dark" ||
      (t === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
      setMapStyleType("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setMapStyleType("streets");
    }
  };

  return { theme, setTheme };
}
