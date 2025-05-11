"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"

export default function CartPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get('store')
  const eatType = searchParams.get('eatType')
  
  // 戻るURL設定（メニューページに戻る）
  const backUrl = storeId && eatType 
    ? `/menu?store=${storeId}&eatType=${eatType}` 
    : '/menu'

  const cartItems = [
    {
      id: 1,
      name: "宇宙特製うどん",
      price: 980,
      quantity: 1,
      options: ["麺の硬さ：普通", "トッピング：温泉卵(+¥100)"],
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 7,
      name: "海老天（2本）",
      price: 480,
      quantity: 2,
      options: [],
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 11,
      name: "緑茶",
      price: 180,
      quantity: 1,
      options: [],
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + tax

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="カート" backUrl={backUrl} />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-48 z-10 relative">
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <Card key={item.id} className="bg-black/60 border-purple-500/30 backdrop-blur-md overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>

                    <p className="text-gray-400 text-sm mb-1">¥{item.price.toLocaleString()}</p>

                    {item.options.length > 0 && (
                      <div className="text-xs text-gray-400 mb-2">
                        {item.options.map((option, index) => (
                          <p key={index}>{option}</p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-purple-500/50">
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">減らす</span>
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full border-purple-500/50">
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">増やす</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">食事方法</h3>
            <RadioGroup defaultValue="eat-in">
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem id="eat-in" value="eat-in" />
                <Label htmlFor="eat-in" className="text-gray-300">
                  店内飲食
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="take-out" value="take-out" />
                <Label htmlFor="take-out" className="text-gray-300">
                  テイクアウト
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">クーポン</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="クーポンコードを入力"
                className="flex-1 bg-black/40 border border-purple-500/30 rounded-md p-2 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <Button variant="outline" className="border-purple-500/50">
                適用
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-300">小計</span>
                <span className="text-white">¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">消費税（10%）</span>
                <span className="text-white">¥{tax.toLocaleString()}</span>
              </div>
              <Separator className="my-3 bg-purple-500/20" />
              <div className="flex justify-between">
                <span className="text-lg font-medium text-white">合計</span>
                <span className="text-lg font-bold text-white">¥{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-purple-500/20 z-20">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300">合計</span>
            <span className="text-xl font-bold text-white">¥{total.toLocaleString()}</span>
          </div>
          <Link href="/payment">
            <Button className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800">
              注文を確定する
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
