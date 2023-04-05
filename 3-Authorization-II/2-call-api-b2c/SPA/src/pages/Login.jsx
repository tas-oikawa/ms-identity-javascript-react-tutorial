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
export const Login = () => {
    const { instance, inProgress } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const isAuthenticated = activeAccount !== null;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirectParam = queryParams.get("redirect");

    useEffect(() => {
      // React 18 から開発モードだとuseEffectが2回呼ばれるので、これで逃げてる。
      let timeoutId = setTimeout(() => {
          login();
        }, 500)
        // こういう処理を書く
        return () => {
          clearTimeout(timeoutId)
        }
    }, []);

    const login = async () => {
      if(redirectParam) {
        sessionStorage.setItem("redirectTo", redirectParam);
      } else {
        sessionStorage.removeItem("redirectTo");
      }
      try {
        if (!isAuthenticated) {
          console.log("redirect");
          const currentUrl = new URL(window.location.href);
          const newUrl = `${currentUrl.origin}/redirect`;
          let signUpSignInFlowRequest = {
            scopes: [
              ...protectedResources.apiTodoList.scopes.read,
              ...protectedResources.apiTodoList.scopes.write,
            ],
            redirectUri: newUrl
          };
          // msalInstance、認証ページにリダイレクト
          await instance.loginRedirect(signUpSignInFlowRequest);
        } else {
          console.log("silent");
          const currentUrl = new URL(window.location.href);
          const newUrl = `${currentUrl.origin}/redirect`;
          const result = await instance.acquireTokenSilent({
            scopes: [
              ...protectedResources.apiTodoList.scopes.read,
              ...protectedResources.apiTodoList.scopes.write,
            ],
            redirectUri: newUrl
          });

          console.log(result);
          const code = result.idToken;

          // 認可コードをサイトAにリダイレクト
          window.location.href = `${redirectParam}?code=${code}`;
        }
      } catch (error) {
        console.error(error);
      }
    };
    return (
        <>
          <button onClick={login}>login</button>
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