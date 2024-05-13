"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var auth_router_1 = require("./auth-router");
var trpc_1 = require("./trpc");
var products_router_1 = require("./products-router");
var payment_router_1 = require("./payment-router");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_router_1.authRouter,
    getInfiniteProducts: products_router_1.productsRouter.getInfiniteProducts,
    payment: payment_router_1.paymentRouter
});
