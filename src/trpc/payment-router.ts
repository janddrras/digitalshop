import { z } from "zod"
import { privateProcedure, router } from "./trpc"
import { TRPCError } from "@trpc/server"
import { getPayloadClient } from "../payload/getPayloadClient"
import { stripe } from "../lib/stripe"
import type Stripe from "stripe"

export const paymentRouter = router({
  createSession: privateProcedure.input(z.object({ productIds: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
    const { user } = ctx
    let { productIds } = input

    if (productIds.length === 0) throw new TRPCError({ code: "BAD_REQUEST" })

    const payload = await getPayloadClient()

    const { docs: products } = await payload.find({
      collection: "products",
      where: { id: { in: productIds } }
    })

    const filteredProducts = products.filter((prod) => Boolean(prod.priceId))

    const order = await payload.create({
      collection: "orders",
      data: {
        products: filteredProducts.map((prod) => prod.id),
        user: user.id,
        _isPaid: false
      }
    })

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    filteredProducts.forEach((product) => lineItems.push({ price: product.priceId!, quantity: 1 }))
    lineItems.push({ price: "price_1PFYZxHoXBWQEbtFUiPlhiGH", quantity: 1, adjustable_quantity: { enabled: false } })

    try {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
        payment_method_types: ["card"],
        mode: "payment",
        metadata: {
          userId: user.id,
          orderId: order.id
        },
        line_items: lineItems
      })

      return { url: stripeSession.url }
    } catch (error) {
      console.error(error)
      return { url: null }
    }
  }),

  pollOrderStatus: privateProcedure.input(z.object({ orderId: z.string() })).query(async ({ input }) => {
    const { orderId } = input

    const payload = await getPayloadClient()

    const { docs: orders } = await payload.find({
      collection: "orders",
      where: { id: { equals: orderId } }
    })

    const [order] = orders

    if (!order) throw new TRPCError({ code: "NOT_FOUND" })

    return { isPaid: order._isPaid }
  })
})
