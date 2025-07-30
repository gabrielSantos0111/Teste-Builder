import { Language } from './translations';

const supportedLanguages: Language[] = ['pt-BR', 'en', 'fr', 'it', 'es'];
const defaultLanguage: Language = 'pt-BR';

// ISO 639 language code mappings
const languageMap: Record<string, Language> = {
  'pt': 'pt-BR',
  'pt-br': 'pt-BR',
  'en': 'en',
  'fr': 'fr',
  'it': 'it',
  'es': 'es'
};

export const getLanguageFromUrl = (): Language => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang')?.toLowerCase();
  
  if (!langParam) {
    return defaultLanguage;
  }
  
  // Check direct match first
  if (supportedLanguages.includes(langParam as Language)) {
    return langParam as Language;
  }
  
  // Check mapped language codes
  if (languageMap[langParam]) {
    return languageMap[langParam];
  }
  
  return defaultLanguage;
};

export const updateUrlLanguage = (language: Language) => {
  const url = new URL(window.location.href);
  
  if (language === defaultLanguage) {
    // Remove lang parameter if it's the default language
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', language);
  }
  
  window.history.replaceState({}, '', url.toString());
};

export const isValidLanguage = (lang: string): lang is Language => {
  return supportedLanguages.includes(lang as Language);
};

export { supportedLanguages, defaultLanguage };