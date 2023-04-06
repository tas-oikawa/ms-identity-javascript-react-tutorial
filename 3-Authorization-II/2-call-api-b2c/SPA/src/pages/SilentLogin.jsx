import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  protectedResources,
} from '../authConfig'


/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const SilentLogin = () => {
    const { instance } = useMsal();
    const [initialized, setInitialized] = useState(false);
    const activeAccount = instance.getActiveAccount();

    useEffect(() => {
      if (initialized) {
        return;
      }
      setInitialized(true);

      /**
       * メッセージ処理
       */
      window.addEventListener('message', async (e) => {
        // 通信元のoriginをチェック
        if (e.origin === 'http://localhost:4000') {
          console.log("message from local");
          const command = e.data  // 送信元からのデータ(要求)を受け取る

          // 送信元の要求に従って処理
          switch (command) {
            case 'GET':
              if (!activeAccount) {
                // 送信元へデータを返却
                e.source.postMessage({
                    status: true, cmd: 'GET', body: {
                      isAuthorized: false,
                    }
                  },
                  e.origin);
                return;
              } else {
                const result = await instance.acquireTokenSilent({
                  scopes: [
                    ...protectedResources.apiTodoList.scopes.read,
                    ...protectedResources.apiTodoList.scopes.write,
                  ],
                });
                // 送信元へデータを返却
                e.source.postMessage({
                    status: true, cmd: 'GET', body: {
                      isAuthorized: true,
                      token: result.idToken
                    }
                  },
                  e.origin);
                return;
              }
          }
        }
      });
    }, [initialized]);

    return (
        <>
            <AuthenticatedTemplate>
                {
                    activeAccount ?
                    <Container>
                            <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                    </Container>
                    :
                    null
                }
            </AuthenticatedTemplate>
        </>
    )
}