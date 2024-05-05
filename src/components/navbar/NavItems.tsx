"use client"

import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { PRODUCT_CATEGORIES } from "@/lib/productCategories"
import { useEffect, useRef, useState } from "react"
import NavItem from "./NavItem"

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null)
      }
    }

    document.addEventListener("keydown", handler)

    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [])

  const navRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(navRef, () => setActiveIndex(null))

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null)
          } else {
            setActiveIndex(i)
          }
        }

        const isOpen = i === activeIndex

        return <NavItem category={category} handleOpen={handleOpen} isOpen={isOpen} key={category.value} />
      })}
    </div>
  )
}

export default NavItems
