const passportConfig = {
    credentials: {
        tenantName: 'soziidtest.onmicrosoft.com',
        clientID: '82ec4e14-3b8d-4597-b02a-d789849fa258',
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

