import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { b2cPolicies, protectedResources } from '../authConfig'


/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Login = () => {
    
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const isAuthenticated = activeAccount !== null;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirectParam = queryParams.get("redirect");

    useEffect(() => {
      login();
    }, []);

    const login = async () => {
      try {
        if (!isAuthenticated) {
          let signUpSignInFlowRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            scopes: [
              ...protectedResources.apiTodoList.scopes.read,
              ...protectedResources.apiTodoList.scopes.write,
            ],
              redirectUri: `${window.location.href}`
          };
          // サインインしていない場合は、認証ページにリダイレクト
          await instance.loginRedirect(signUpSignInFlowRequest);
        } else {
          const result = await instance.acquireTokenSilent({
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            scopes: [
              ...protectedResources.apiTodoList.scopes.read,
              ...protectedResources.apiTodoList.scopes.write,
            ],
            redirectUri: `${window.location.href}`
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