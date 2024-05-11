import { authRouter } from "./auth-router"
import { router } from "./trpc"
import { productsRouter } from "./products-router"
import { paymentRouter } from "./payment-router"

export const appRouter = router({
  auth: authRouter,
  getInfiniteProducts: productsRouter.getInfiniteProducts,
  payment: paymentRouter
})

export type AppRouter = typeof appRouter
