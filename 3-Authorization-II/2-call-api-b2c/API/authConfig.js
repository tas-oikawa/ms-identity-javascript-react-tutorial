const passportConfig = {
    credentials: {
        tenantName: 'soziidtest.onmicrosoft.com',
        clientID: 'e8322962-e54e-4349-8297-0dada2f90df5',
    },
    policies: {
        policyName: 'B2C_1_susi',
    },
    metadata: {
        b2cDomain: 'soziidtest.b2clogin.com',
        authority: 'login.microsoftonline.com',
        discovery: '.well-known/openid-configuration',
        version: 'v2.0',
    },
    settings: {
        isB2C: true,
        validateIssuer: false,
        passReqToCallback: true,
        loggingLevel: 'info',
        loggingNoPII: false,
    },
    protectedRoutes: {
        todolist: {
            endpoint: '/api/todolist',
            delegatedPermissions: {
                read: ['ToDoList.Read', 'ToDoList.ReadWrite'],
                write: ['ToDoList.ReadWrite'],
            },
        },
    },
};

module.exports = passportConfig;

