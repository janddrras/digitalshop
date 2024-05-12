import { PRODUCT_CATEGORIES } from "@/lib/productCategories"
import { formatPrice } from "@/lib/utils"
import { Order, Product, ProductFile } from "@/payload/payload-types"
import Image from "next/image"

interface ProductListItemProps {
  product: Product
  order: Order
}

const ProductListItem = ({ product, order }: ProductListItemProps) => {
  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label

  const downloadUrl = (product.product_files as ProductFile).url as string

  const { image } = product.images[0]

  return (
    <li key={product.id} className="flex space-x-6 py-6">
      <div className="relative h-24 w-24">
        {typeof image !== "string" && image.url ? (
          <Image
            fill
            src={image.url}
            alt={`${product.name} image`}
            className="flex-none rounded-md bg-gray-100 object-cover object-center"
          />
        ) : null}
      </div>

      <div className="flex-auto flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-gray-900">{product.name}</h3>

          <p className="my-1">Category: {label}</p>
        </div>

        {order._isPaid ? (
          <a href={downloadUrl} download={product.name} className="text-blue-600 hover:underline underline-offset-2">
            Download asset
          </a>
        ) : null}
      </div>

      <p className="flex-none font-medium text-gray-900">{formatPrice(product.price)}</p>
    </li>
  )
}

export default ProductListItem
