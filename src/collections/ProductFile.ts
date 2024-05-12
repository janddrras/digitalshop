import { yourOwnAndPurchased } from "../lib/payload-utils"
import { User } from "../payload/payload-types"
import { BeforeChangeHook } from "payload/dist/collections/config/types"
import { Access, CollectionConfig } from "payload/types"

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null
  return { ...data, user: user?.id }
}

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin"
  },
  hooks: {
    beforeChange: [addUser]
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin"
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
        condition: () => false
      },
      hasMany: false,
      required: true
    }
  ]
}
