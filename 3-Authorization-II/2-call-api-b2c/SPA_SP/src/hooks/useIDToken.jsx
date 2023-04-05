import {
  useState,
  useCallback, useContext, createContext,
} from 'react'

import { InteractionType, PopupRequest } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from "@azure/msal-react";

export const IDTokenContext = createContext(null);
