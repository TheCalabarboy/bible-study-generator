import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApiKey } from '../contexts/ApiKeyContext';
import ApiKeyModal from './ApiKeyModal';

/**
 * Route-level gate: renders <Outlet /> only when the user has
 * provided an API key. Otherwise shows the ApiKeyModal.
 *
 * Wrap any routes that need an AI key (Generate, Topics) with
 * this component in router.jsx.
 */
export default function RequireApiKey() {
  const { hasKey } = useApiKey();

  if (!hasKey) {
    return <ApiKeyModal onConfirm={() => {}} />;
  }

  return <Outlet />;
}
