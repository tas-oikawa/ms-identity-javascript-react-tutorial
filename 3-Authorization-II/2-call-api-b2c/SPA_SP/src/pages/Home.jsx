import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react'
import { useLocation } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import useIDToken, { IDTokenContext } from '../hooks/useIDToken'


/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const {idToken, setIdToken} = useContext(IDTokenContext);
  useEffect( () => {
    console.log(code);
    if (code) {
      sessionStorage.setItem("token", code);
      setIdToken(code);
    }
  }, [code]);

    return (
        <>
          {idToken? (<div>
            <p>認証済み</p>
          </div>):
          <p>未認証</p>}
        </>
    )
}