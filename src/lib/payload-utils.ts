import { User } from "../payload/payload-types"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { NextRequest } from "next/server"
import { Access } from "payload/config"

export const getServerSideUser = async (cookies: NextRequest["cookies"] | ReadonlyRequestCookies) => {
  const token = cookies.get("payload-token")?.value

  const meRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`
    }
  })

  const { user } = (await meRes.json()) as { user: User | null }

  return { user }
}

export const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined

    if (!user) return false
    if (user.role === "admin") return true

    return {
      user: {
        equals: req.user.id
      }
    }
  }

export const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null

  if (user?.role === "admin") return true
  if (!user) return false

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id
      }
    }
  })

  const ownProductFileIds = products.map((prod) => prod.product_files).flat()

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: {
        equals: user.id
      }
    }
  })

  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string") return req.payload.logger.error("Search depth not sufficient to find purchased file IDs")

        return typeof product.product_files === "string" ? product.product_files : product.product_files.id
      })
    })
    .filter(Boolean)
    .flat()

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds]
    }
  }
}
