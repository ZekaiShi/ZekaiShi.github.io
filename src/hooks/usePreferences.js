import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function writePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Continue with in-memory preferences if storage is unavailable. */
  }
}
function useMediaQuery(query) {
  const subscribe = useCallback(
    (listener) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePreferences() {
  const [themePreference, updateTheme] = useState(() => {
    const saved = readPreference("profile-theme", "system");
    if (saved === "retro") return "light";
    if (saved === "modern") return "dark";
    return ["light", "dark", "system"].includes(saved) ? saved : "system";
  });
  const [lang, updateLang] = useState(() =>
    readPreference("profile-language", "en") === "zh" ? "zh" : "en",
  );
  const [motionPaused, updateMotion] = useState(
    () => readPreference("profile-motion", "on") === "off",
  );
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const theme =
    themePreference === "system"
      ? systemDark
        ? "dark"
        : "light"
      : themePreference;
  const motion = !motionPaused && !reducedMotion;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.content = theme === "light" ? "#e0e6e0" : "#07080d";
    });
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);
  return {
    theme,
    themePreference,
    lang,
    motionPaused,
    reducedMotion,
    motion,
    setThemePreference(value) {
      writePreference("profile-theme", value);
      updateTheme(value);
    },
    setLang(value) {
      writePreference("profile-language", value);
      updateLang(value);
    },
    setMotionPaused(value) {
      writePreference("profile-motion", value ? "off" : "on");
      updateMotion(value);
    },
  };
}
