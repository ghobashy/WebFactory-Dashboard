// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    oauth: {
        clientID: '0Pm3E1o3rdd0z267iKVizXanT2WTmPms',
        clientKey: 'gUTWGJAYFigpMeP3Rqh5pPqfiafD2__ABs6gDBxICEDBggsQ9Esa6bC-eD6BYTzO',
        grant_type: 'client_credentials',
        audience: 'vf-Dashboard',
        tokenUrl: "/auth/oauth/token",
        issuer: "https://elzouhery.auth0.com/"
    },
    backendUrl: "/api/"
};
