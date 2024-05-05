"use client"

import { PRODUCT_CATEGORIES } from "@/lib/productCategories"
import Image from "next/image"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Category = (typeof PRODUCT_CATEGORIES)[number]

interface NavItemProps {
  category: Category
  handleOpen: () => void
  isOpen: boolean
}

const NavItem = ({ category, handleOpen, isOpen }: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button className="gap-1.5" onClick={handleOpen} variant={isOpen ? "secondary" : "ghost"}>
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen
            })}
          />
        </Button>
      </div>

      {isOpen ? (
        <div
          onClick={() => handleOpen()}
          className={cn("absolute inset-x-0 top-full text-sm shadow", {
            "animate-in fade-in-10 slide-in-from-top-5": isOpen !== null
          })}
        >
          <div className="relative bg-white px-8">
            <div className="grid grid-cols-3 gap-x-8 py-16 mx-auto max-w-6xl">
              {category.featured.map((item) => (
                <Link href={item.href} key={item.name} className="mt-6 block font-medium text-gray-900">
                  <div className="relative text-base sm:text-sm">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 hover:opacity-75">
                      <Image src={item.imageSrc} alt="product category image" fill className="object-cover object-center" />
                    </div>
                    <h3 className="mt-8 font-semibold">{item.name}</h3>

                    <p className="mt-1 text-muted-foreground text-sm" aria-hidden="true">
                      Shop now
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NavItem
