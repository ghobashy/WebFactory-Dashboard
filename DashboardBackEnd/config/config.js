'use strict';

var _domain = "DIGITAL",
    _Project = "LT_DE_ONEPOS";

exports.appSettings = {
    db: 'mongodb://localhost/dashboard',
    alm: {
        almUrl: "https://alm.vodafone.com/qcbin/",
        Domain: _domain,
        Project: _Project,
        IsSessionRequired: "true",
        IsLogoutRequired: "true",
        SessionCookieName: "XSRF-TOKEN",
        TokenCookieName: "LWSSO_COOKIE_KEY",
        /* Address */
        Login: "/qcbin/authentication-point/authenticate",
        Logout: "/qcbin/authentication-point/logout",
        LockEntity: "/qcbin/rest/domains/" + _domain + "/projects/" + _Project + "/{Entity Type}/{Entity ID}/lock",
        EntityCollection: "/{Entity Type}s/",
        Entity: "/{Entity Type}s/{Entity ID}",
        EntityHistory: "/{Entity Type}s/{Entity ID}/audits",
        IsAuthenticated: "/qcbin/rest/is-authenticated",
        SessionAddress: "/qcbin/rest/site-session",
        TestFolder: "/test-set-folders?query={FolderQuery}",
        TestSets: "/qcbin/rest/domains/" + _domain + "/projects/" + _Project + "/test-sets?query={test-set-folder.hierarchical-path[HierarchicalPath*]}"
    },
    jira: {
        /*var jira = new JiraApi('https', config.host, config.port, config.user, config.password, '2.0.alpha1'); */
        host: "jira.sp.vodafone.com",
        port: 80,

    },
    fields: ["priority",
        "id",
        "status",
        "owner",
        "name",
        "creation-time",
        "last-modified",
        "severity",
        "detected-by",
        "user-05",
        "user-04",
        "user-13"
    ]
};