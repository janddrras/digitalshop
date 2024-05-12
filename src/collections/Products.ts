import { BeforeChangeHook } from "payload/dist/collections/config/types"
import { PRODUCT_CATEGORIES } from "../lib/productCategories"
import { CollectionConfig } from "payload/types"
import { Product } from "../payload/payload-types"
import { stripe } from "../lib/stripe"

const addUser: BeforeChangeHook<Product> = async ({ data, req }) => ({ ...data, user: req.user.id })
const stripeOp: BeforeChangeHook<Product> = async (args) => {
  const data = args.data as Product
  if (args.operation === "create") {
    const createdProduct = await stripe.products.create({
      name: data.name,
      default_price_data: { currency: "usd", unit_amount: Math.round(data.price * 100) }
    })
    const finalProduct: Product = { ...data, stripeId: createdProduct.id, priceId: createdProduct.default_price as string }
    return finalProduct
  } else if (args.operation === "update") {
    const updatedProduct = await stripe.products.update(data.stripeId!, { name: data.name, default_price: data.priceId! })
    const finalProduct = { ...data, stripeId: updatedProduct.id, priceId: updatedProduct.default_price as string }
    return finalProduct
  }
}

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name"
  },
  access: {},
  hooks: { beforeChange: [addUser, stripeOp] },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false
      }
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true
    },
    {
      name: "description",
      type: "textarea",
      label: "Product details"
    },
    {
      name: "price",
      label: "Price in USD",
      min: 0,
      max: 1000,
      type: "number",
      required: true
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true
    },
    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      hasMany: false
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin"
      },
      options: [
        {
          label: "Pending verification",
          value: "pending"
        },
        {
          label: "Approved",
          value: "approved"
        },
        {
          label: "Denied",
          value: "denied"
        }
      ]
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false
      },
      type: "text",
      admin: {
        hidden: true
      }
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false
      },
      type: "text",
      admin: {
        hidden: true
      }
    },
    {
      name: "images",
      type: "array",
      label: "Product images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images"
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true
        }
      ]
    }
  ]
}
