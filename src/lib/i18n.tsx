"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "sv" | "en";

const KEY = "stockholm-open-lang";

const I18nContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sv");

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* private mode */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

export function useDocumentTitle(title: { sv: string; en: string }) {
  const { lang } = useI18n();
  const swedish = title.sv;
  const english = title.en;
  useEffect(() => {
    document.title = `${lang === "sv" ? swedish : english} · Stockholm Open`;
  }, [lang, swedish, english]);
}
