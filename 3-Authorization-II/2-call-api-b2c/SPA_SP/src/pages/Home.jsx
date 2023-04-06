import { useLocation } from 'react-router-dom'
import { useContext, useEffect, useRef } from 'react'
import { IDTokenContext } from '../hooks/useIDToken'


/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
  const location = useLocation();
  const dataBridge = useRef();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const {idToken, setIdToken} = useContext(IDTokenContext);

  const handleIframeLoad = () => {
    console.log("iframe loaded");
    /**
     * iframeの読み込みが完了した時点でデータを要求
     */

      // React 18 から開発モードだとuseEffectが2回呼ばれるので、これで逃げてる。
    let timeoutId = setTimeout(() => {
        console.log("message post.");
        dataBridge.current.contentWindow.postMessage('GET', '*')
      }, 500)

    /**
     * iframe側から送信されたデータを受信
     */
    window.addEventListener('message', (e) => {
      if (e.origin !== "http://localhost:3000") {
        return;
      }
      const data = e.data;
      if ("cmd" in data && data.cmd === "GET") {
        const body =  data.body;
        if (body.isAuthorized) {
          setIdToken(body.token);
        }
      }
    });
    return () => {
      clearTimeout(timeoutId)
    }
  };

  useEffect( () => {
    console.log(code);
    if (code) {
      sessionStorage.setItem("token", code);
      setIdToken(code);
    }
  }, [code]);

    return (
        <>
          <iframe title={"login"} ref={dataBridge} src="http://localhost:3000/silentLogin" onLoad={handleIframeLoad} style={{display:"none"}}></iframe>
          {idToken? (<div>
            <p>認証済み</p>
          </div>):
          <p>未認証</p>}
        </>
    )
}