"use client"

import Link from "next/link"
import { ChevronLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

interface AppHeaderProps {
  title: string
  showBack?: boolean
  showCart?: boolean
  backUrl?: string
}

export function AppHeader({ title, showBack = true, showCart = false, backUrl }: AppHeaderProps) {
  const router = useRouter()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="container max-w-md mx-auto flex items-center justify-between h-16 px-4">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-950/20"
            onClick={handleBack}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">戻る</span>
          </Button>
        ) : (
          <div className="w-10"></div>
        )}

        <h1 className="text-xl font-medium text-white">{title}</h1>

        {showCart ? (
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-950/20 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">カートを見る</span>
            </Button>
          </Link>
        ) : (
          <div className="w-10"></div>
        )}
      </div>
    </header>
  )
}
