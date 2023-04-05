import { AuthenticatedTemplate, useMsal } from '@azure/msal-react'
import { Container } from "react-bootstrap";
import { IdTokenData } from "../components/DataDisplay";
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PublicClientApplication } from '@azure/msal-browser'

import { msalConfig } from "../authConfig.js";
/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Redirect = () => {
  const msalInstance = useMsal();
  const activeAccount = msalInstance.instance.getActiveAccount();
  const redirectTo = sessionStorage.getItem("redirectTo");
  console.log("redirectTo");
  console.log(redirectTo);
  console.log("ac");
  console.log(activeAccount);
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