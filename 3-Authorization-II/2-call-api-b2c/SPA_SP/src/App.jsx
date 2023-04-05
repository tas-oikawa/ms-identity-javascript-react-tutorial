import { MsalProvider } from '@azure/msal-react';

import { Routes, Route } from "react-router-dom";
import { PageLayout } from './components/PageLayout';
import { TodoList } from './pages/TodoList';
import { Home } from './pages/Home';
import { IDTokenContext } from './hooks/useIDToken'

import './styles/App.css';
import { useState } from 'react'

const Pages = () => {
    return (
        <Routes>
            <Route path="/todolist" element={<TodoList />} />
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
  const [idToken, setIdToken] = useState(null);
    return (
        <MsalProvider instance={instance}>
          <IDTokenContext.Provider value={{ idToken, setIdToken }}>
            <PageLayout>
                <Pages />
            </PageLayout>
          </IDTokenContext.Provider>
        </MsalProvider>
    );
};

export default App;
