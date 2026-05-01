import React, { createContext, useContext, useEffect, useState } from 'react';
import { setRuntimeApiKey } from '../services/geminiService';

const STORAGE_KEY = 'sdive_api_key';
const STORAGE_PROVIDER = 'sdive_api_provider';
const STORAGE_PERSIST = 'sdive_key_persist';

const ApiKeyContext = createContext(null);

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  const [provider, setProvider] = useState('gemini');

  useEffect(() => {
    const persisted = localStorage.getItem(STORAGE_PERSIST) === 'true';
    const store = persisted ? localStorage : sessionStorage;
    const storedKey = store.getItem(STORAGE_KEY);
    const storedProvider = store.getItem(STORAGE_PROVIDER) || 'gemini';
    if (storedKey) {
      setApiKey(storedKey);
      setProvider(storedProvider);
      setRuntimeApiKey(storedKey, storedProvider);
    }
  }, []);

  function saveKey(key, prov = 'gemini', persist = false) {
    const trimmed = key.trim();
    if (!trimmed) return;
    sessionStorage.setItem(STORAGE_KEY, trimmed);
    sessionStorage.setItem(STORAGE_PROVIDER, prov);
    if (persist) {
      localStorage.setItem(STORAGE_KEY, trimmed);
      localStorage.setItem(STORAGE_PROVIDER, prov);
      localStorage.setItem(STORAGE_PERSIST, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_PROVIDER);
      localStorage.removeItem(STORAGE_PERSIST);
    }
    setApiKey(trimmed);
    setProvider(prov);
    setRuntimeApiKey(trimmed, prov);
  }

  function clearKey() {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_PROVIDER);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_PROVIDER);
    localStorage.removeItem(STORAGE_PERSIST);
    setApiKey(null);
    setProvider('gemini');
    setRuntimeApiKey(null);
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, provider, hasKey: !!apiKey, saveKey, clearKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error('useApiKey must be used inside ApiKeyProvider');
  return ctx;
}
