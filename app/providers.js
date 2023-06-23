'use client'

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

export function Providers({ children }) {
  return (
    React.createElement(CacheProvider, null,
      React.createElement(ChakraProvider, null,
        children
      )
    )
  );
}
