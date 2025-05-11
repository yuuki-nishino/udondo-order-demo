"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { Plus, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'

// メニュー項目の型定義
type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
}

export default function MenuPage() {
  const searchParams = useSearchParams()
  
  // 店舗選択画面に戻るためのURL
  const backUrl = '/stores'

  const categories = [
    { id: "udondo", name: "ウドンド" },
    { id: "toppings", name: "トッピング" },
    { id: "curry", name: "カレー" },
    { id: "drinks", name: "飲み物" },
  ]

  const menuItems: Record<string, MenuItem[]> = {
    udondo: [
      {
        id: 1,
        name: "かけウドンド",
        price: 550,
        description: "シンプルながらも深い味わいのかけウドンド",
        image: "/placeholder.svg?height=200&width=200",
        popular: true,
      },
      {
        id: 2,
        name: "かけ油ウドンド",
        price: 550,
        description: "特製の油が香る、風味豊かなウドンド",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 3,
        name: "みつか坊主のエビ味噌咖喱ウドンド",
        price: 730,
        description: "みつか坊主特製のエビ味噌咖喱と絶妙に絡むウドンド",
        image: "/placeholder.svg?height=200&width=200",
        popular: true,
      },
    ],
    toppings: [
      {
        id: 4,
        name: "旨い煮豚",
        price: 400,
        description: "じっくり煮込んだ旨味たっぷりの煮豚",
        image: "/placeholder.svg?height=200&width=200",
        popular: true,
      },
      {
        id: 5,
        name: "大阪スジ煮",
        price: 450,
        description: "大阪風に仕上げた柔らかスジ煮込み",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 6,
        name: "麹漬け旨煮鶏",
        price: 380,
        description: "麹に漬け込んだ柔らかジューシーな鶏肉",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 7,
        name: "ウドンドの覚醒（激辛ウマすりだね）",
        price: 180,
        description: "激辛好きにはたまらない特製すりだね",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 8,
        name: "生たまご",
        price: 50,
        description: "厳選された新鮮な生卵",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 9,
        name: "追加ねぎ",
        price: 20,
        description: "シャキシャキの新鮮なねぎ",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 10,
        name: "追加麺（1玉）",
        price: 230,
        description: "もっと食べたい方に追加の麺",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    curry: [
      {
        id: 11,
        name: "黒毛和牛スジ和風大阪出汁カレー",
        price: 400,
        description: "黒毛和牛のスジを使った本格大阪風出汁カレー",
        image: "/placeholder.svg?height=200&width=200",
        popular: true,
      },
      {
        id: 12,
        name: "みつか坊主のエビ味噌咖喱（単品）",
        price: 500,
        description: "みつか坊主特製の濃厚エビ味噌咖喱",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    drinks: [
      {
        id: 13,
        name: "お水",
        price: 100,
        description: "清涼なお水",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  }

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="ウドンド メニュー" showCart={true} backUrl={backUrl} />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-24 z-10 relative">
        <Tabs defaultValue="udondo" className="w-full">
          <TabsList className="w-full h-auto flex overflow-x-auto py-2 justify-start bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 data-[state=active]:bg-purple-900/50 data-[state=active]:text-white rounded-md"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-0">
              {items.map((item) => (
                <Link href={`/menu/${item.id}`} key={item.id}>
                  <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md hover:bg-black/70 transition-colors cursor-pointer overflow-hidden">
                    <div className="flex">
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-2">
                            <CardTitle className="text-lg text-white">{item.name}</CardTitle>
                            {item.popular && (
                              <div className="flex items-center text-yellow-400 text-xs">
                                <Star className="w-3 h-3 fill-yellow-400 mr-1" />
                                人気
                              </div>
                            )}
                          </div>
                          <CardDescription className="text-gray-400 line-clamp-2">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-lg font-medium text-white">¥{item.price.toLocaleString()}</p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            カートに追加
                          </Button>
                        </CardFooter>
                      </div>
                      <div className="w-24 h-24 relative self-center mr-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-purple-500/20 z-20">
        <Link href="/cart">
          <Button className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800">
            カートを見る
          </Button>
        </Link>
      </div>
    </main>
  )
}
