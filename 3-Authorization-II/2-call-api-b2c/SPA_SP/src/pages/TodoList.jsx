import { useEffect, useState } from 'react';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

import { ListView } from '../components/ListView';
import { loginRequest, protectedResources } from "../authConfig";
import useFetchWithIDToken from '../hooks/useFetchWithIDToken';

const TodoListContent = () => {
    const { error, execute } = useFetchWithIDToken({
        scopes: protectedResources.apiTodoList.scopes.read,
    });

    const [todoListData, setTodoListData] = useState(null);

    useEffect(() => {
        if (!todoListData) {
            execute("GET", protectedResources.apiTodoList.endpoint).then((response) => {
                console.log(response);
                setTodoListData(response);
            }).catch((e) => {
               console.log("Caught");
                window.location.href = `http://localhost:3000/login?redirect=${encodeURIComponent("http://localhost:4000/")}`;
            });
        }
    }, [execute, todoListData])

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return <>{todoListData ? <ListView todoListData={todoListData} /> : null}</>;
};

/**
 * The `MsalAuthenticationTemplate` component will render its children if a user is authenticated
 * or attempt to sign a user in. Just provide it with the interaction type you would like to use
 * (redirect or popup) and optionally a request object to be passed to the login API, a component to display while
 * authentication is in progress or a component to display if an error occurs. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const TodoList = () => {
    return (
      <TodoListContent />
    );
};
