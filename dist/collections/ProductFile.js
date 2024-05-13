"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFiles = void 0;
var payload_utils_1 = require("../lib/payload-utils");
var addUser = function (_a) {
    var req = _a.req, data = _a.data;
    var user = req.user;
    return __assign(__assign({}, data), { user: user === null || user === void 0 ? void 0 : user.id });
};
exports.ProductFiles = {
    slug: "product_files",
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        }
    },
    hooks: {
        beforeChange: [addUser]
    },
    access: {
        read: payload_utils_1.yourOwnAndPurchased,
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        }
    },
    upload: {
        staticURL: "/product_files",
        staticDir: "product_files",
        mimeTypes: ["image/*", "font/*", "application/postscript", "pdf"]
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            admin: {
                condition: function () { return false; }
            },
            hasMany: false,
            required: true
        }
    ]
};
