import {
    useState,
    useCallback,
} from 'react';

import { InteractionType, PopupRequest } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from "@azure/msal-react";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest 
 * @returns 
 */
const useFetchWithIDToken = (msalRequest) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    /**
     * Execute a fetch request with the given options
     * @param {string} method: GET, POST, PUT, DELETE
     * @param {String} endpoint: The endpoint to call
     * @param {Object} data: The data to send to the endpoint, if any 
     * @returns JSON response
     */
    const execute = async (method, endpoint, data = null) => {
        const idToken = sessionStorage.getItem("token");
        if (!idToken) {
            throw Error("no valid token.");
        }
        try {
            let response = null;

            const headers = new Headers();
            const bearer = `Bearer ${idToken}`;
            headers.append("Authorization", bearer);

            if (data) {
                headers.append('Content-Type', 'application/json');
            }

            let options = {
                method: method,
                headers: headers,
                body: data ? JSON.stringify(data) : null,
            };

            setIsLoading(true);

            response = await (await fetch(endpoint, options)).json();
            setData(response);

            setIsLoading(false);
            return response;
        } catch (e) {
            setError(e);
            setIsLoading(false);
            throw e;
        }
    };

    return {
        isLoading,
        error,
        data,
        execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
    };
};

export default useFetchWithIDToken;