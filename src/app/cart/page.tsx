"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { cn, formatPrice } from "@/lib/utils"
import { trpc } from "@/trpc/client"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CartItem from "./_components/CartItem"

const Page = () => {
  const { items, removeItem, clearCart } = useCart()

  const router = useRouter()

  const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    }
  })

  const productIds = items.map(({ product }) => product.id)

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce((total, { product }) => total + product.price, 0)

  const fee = 1

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12": isMounted && items.length === 0
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div aria-hidden="true" className="relative mb-4 h-40 w-40 text-muted-foreground">
                  <Image src="/hippo-empty-cart.png" fill loading="eager" alt="empty shopping cart hippo" />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">Whoops! Nothing to show here yet.</p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200": isMounted && items.length > 0
              })}
            >
              {isMounted && items.map(({ product }) => CartItem({ product, removeItem }))}
            </ul>

            {isMounted && items.length !== 0 ? (
              <div className="text-left pt-8">
                <Button onClick={clearCart} variant="link" className="text-destructive/50 hover:text-destructive" size="sm">
                  Clear Cart
                </Button>
              </div>
            ) : null}
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? formatPrice(cartTotal) : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? formatPrice(fee) : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">Order Total</div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? formatPrice(cartTotal + fee) : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0 || isLoading}
                onClick={() => createCheckoutSession({ productIds })}
                className="w-full"
                size="lg"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page
