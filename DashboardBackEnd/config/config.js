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
        SessionAddress: "/qcbin/rest/site-session"
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