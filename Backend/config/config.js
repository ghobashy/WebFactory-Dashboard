'use strict';

exports.appSettings = {
    //db: 'mongodb://sa:password@138.197.37.84:27017/dashboard',
    db: 'mongodb://admin:m4N5247sX|+5A5F@ds133331.mlab.com:33331/vf-dashboard',
    port: 3000,
    host: "http://138.197.37.84:3000/app",
    oauth: {
        clientID: '0Pm3E1o3rdd0z267iKVizXanT2WTmPms',
        clientKey: 'gUTWGJAYFigpMeP3Rqh5pPqfiafD2__ABs6gDBxICEDBggsQ9Esa6bC-eD6BYTzO',
        grant_type: 'client_credentials',
        audience: 'vf-Dashboard',
        tokenUrl: "https://elzouhery.auth0.com/oauth/token",
        issuer: "https://elzouhery.auth0.com/"
    },
    sendGrid: {
        apiKey: "BaMhTX6cRK-insqAtDImNQ",
        apiPassword: "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"
    },
    jira: {
        jiraBaseUrl: "https://jira.sp.vodafone.com/rest/api/2/",
        calendarService: "https://confluence.sp.vodafone.com/rest/calendar-services/1.0/calendar/",
        host: "jira.sp.vodafone.com",
        port: 80,
        authCode: "Basic bWFobW91ZC5lbHpvdWhlcnlAdm9kYWZvbmUuY29tOjdZRlBjaWtD",
        calendars: [
            { name: "WFH", id: "9b27698a-305f-4aa5-88e8-5e9a582a1c1c" },
            { name: "Trainings", id: "1e7ec852-3d32-4fd5-bc63-c68e09d65752" }, //Team Trainings
            { name: "Trainings", id: "757b3aa3-5347-4222-9eda-d5f1e34bcec2" }, //Leads Trainings
            { name: "Vacations", id: "0ce24d8e-0ed9-4f02-bafc-ad8ef4bdadf2" },
            { name: "Vacations", id: "2b2b83e6-a4b2-487c-b539-0a5adfa3b5bf" },
            { name: "WebFactory Events", id: "451835a6-3731-463b-b8fc-5e71942241b5" },
            { name: "WebFactory Events", id: "74e6b22c-dc06-4f16-b089-968052552fea" },
            { name: "WebFactory Events", id: "b1da7fae-2dc5-4bf0-af36-191f4e6af9fe" },
            { name: "WebFactory Events", id: "25ba1c4e-4a2b-489c-b889-97f8f3fe8d02" },
            { name: "WebFactory Events", id: "fe6a3907-6bbd-4842-8bf9-cbf37d998303" },
            { name: "WebFactory Events", id: "301d4947-bea9-40e3-bdd3-26db2dcf50c2" },
            { name: "WebFactory Events", id: "52b7e7d9-1011-4718-8bfd-7c082aa1b869" },
            { name: "WebFactory Events", id: "b84d3dfe-2d40-451c-bbc2-954b2531a388" },
            { name: "WebFactory Events", id: "bb09c791-0234-4bbf-bc1e-8ac9f4527b60" },
            { name: "WebFactory Events", id: "5ade68e0-6d36-49d9-b159-cba5f57c735e" }
        ]
    }
};