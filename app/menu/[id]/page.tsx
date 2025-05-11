"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { Minus, Plus, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"

// メニュー項目の型定義
type MenuItem = {
  name: string;
  price: number;
  description: string;
  image: string;
  allergens: string[];
  popular?: boolean;
};

// 全メニュー項目をコンポーネントの外に定義
const allMenuItems: Record<string, MenuItem> = {
  "1": {
    name: "かけウドンド",
    price: 550,
    description: "シンプルながらも深い味わいのかけウドンド",
    image: "/placeholder.svg?height=400&width=400",
    popular: true,
    allergens: ["小麦"],
  },
  "2": {
    name: "かけ油ウドンド",
    price: 550,
    description: "特製の油が香る、風味豊かなウドンド",
    image: "/placeholder.svg?height=400&width=400",
    allergens: ["小麦"],
  },
  "3": {
    name: "みつか坊主のエビ味噌咖喱ウドンド",
    price: 730,
    description: "みつか坊主特製のエビ味噌咖喱と絶妙に絡むウドンド",
    image: "/placeholder.svg?height=400&width=400",
    popular: true,
    allergens: ["小麦", "えび"],
  },
  // デフォルト
  "default": {
    name: "メニュー",
    price: 0,
    description: "メニュー情報",
    image: "/placeholder.svg?height=400&width=400",
    allergens: [],
  }
};

export default function MenuItemPage() {
  // クライアントサイドでパラメータを取得
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  
  // URLクエリパラメータを保持して戻る
  const storeId = searchParams.get('store')
  const eatType = searchParams.get('eatType')
  const backUrl = storeId && eatType 
    ? `/menu?store=${storeId}&eatType=${eatType}` 
    : '/menu'
  
  // IDが存在しない場合はデフォルト値を使用
  const menuItem = allMenuItems[id] || allMenuItems.default;

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="メニュー詳細" backUrl={backUrl} />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
        <div className="w-full h-64 relative mb-6">
          <Image
            src={menuItem.image || "/placeholder.svg"}
            alt={menuItem.name}
            fill
            className="object-cover rounded-lg"
          />
          {menuItem.popular && (
            <div className="absolute top-4 right-4 bg-yellow-600/80 text-white px-3 py-1 rounded-full text-sm flex items-center backdrop-blur-sm">
              <Star className="w-4 h-4 fill-yellow-300 mr-1" />
              人気メニュー
            </div>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{menuItem.name}</h1>
          <p className="text-xl font-medium text-white mb-4">¥{Number(menuItem.price).toLocaleString()}</p>
          <p className="text-gray-300">{menuItem.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {menuItem.allergens.map((allergen) => (
              <span
                key={allergen}
                className="text-xs bg-red-900/40 text-red-300 px-2 py-1 rounded-full border border-red-500/30"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">数量</span>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-purple-500/50">
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">減らす</span>
                </Button>
                <span className="text-lg font-medium">1</span>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-purple-500/50">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">増やす</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">麺の硬さ</h3>
            <RadioGroup defaultValue="normal">
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem id="soft" value="soft" />
                <Label htmlFor="soft" className="text-gray-300">
                  やわらかめ
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem id="normal" value="normal" />
                <Label htmlFor="normal" className="text-gray-300">
                  普通
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="hard" value="hard" />
                <Label htmlFor="hard" className="text-gray-300">
                  かため
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">トッピング</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-1" />
                  <Label htmlFor="topping-1" className="text-gray-300">
                    旨い煮豚
                  </Label>
                </div>
                <span className="text-gray-400">+¥400</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-2" />
                  <Label htmlFor="topping-2" className="text-gray-300">
                    大阪スジ煮
                  </Label>
                </div>
                <span className="text-gray-400">+¥450</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-3" />
                  <Label htmlFor="topping-3" className="text-gray-300">
                    麹漬け旨煮鶏
                  </Label>
                </div>
                <span className="text-gray-400">+¥380</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-4" />
                  <Label htmlFor="topping-4" className="text-gray-300">
                    ウドンドの覚醒（激辛ウマすりだね）
                  </Label>
                </div>
                <span className="text-gray-400">+¥180</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-5" />
                  <Label htmlFor="topping-5" className="text-gray-300">
                    生たまご
                  </Label>
                </div>
                <span className="text-gray-400">+¥50</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-6" />
                  <Label htmlFor="topping-6" className="text-gray-300">
                    追加ねぎ
                  </Label>
                </div>
                <span className="text-gray-400">+¥20</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="topping-7" />
                  <Label htmlFor="topping-7" className="text-gray-300">
                    追加麺（1玉）
                  </Label>
                </div>
                <span className="text-gray-400">+¥230</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">備考</h3>
            <textarea
              placeholder="アレルギーや特別なリクエストがあればご記入ください"
              className="w-full h-24 bg-black/40 border border-purple-500/30 rounded-md p-3 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-purple-500/20 z-20">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300">合計</span>
            <span className="text-xl font-bold text-white">¥{menuItem.price.toLocaleString()}</span>
          </div>
          <Link href="/cart">
            <Button className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800">
              カートに追加
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
