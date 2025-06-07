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
import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/utils/supabase/client"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

// メニュー項目の型定義
type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  popular?: boolean;
}

// カテゴリーの定義
const categories = [
  { id: "udondo", name: "ウドンド" },
  { id: "toppings", name: "トッピング" },
  { id: "curry", name: "カレー" },
  { id: "drinks", name: "飲み物" },
]

// メインメニューコンテンツコンポーネント
function MenuContent() {
  const searchParams = useSearchParams()
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({})
  const [loading, setLoading] = useState(true)
  const { addItem, getItemCount } = useCart()
  const { toast } = useToast()
  
  // 店舗選択画面に戻るためのURL
  const backUrl = '/stores'

  // カートにアイテムを追加する関数
  const handleAddToCart = (item: MenuItem, event: React.MouseEvent) => {
    event.preventDefault() // Linkのナビゲーションを防ぐ
    event.stopPropagation()
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      options: [],
      image: item.image,
      category: item.category
    })
    
    toast({
      title: "カートに追加しました",
      description: `${item.name}をカートに追加しました`,
      duration: 2000,
    })
  }

  // Supabaseからメニューデータを取得
  useEffect(() => {
    async function fetchMenuData() {
      setLoading(true)
      const supabase = createClient()
      
      try {
        // MENUテーブルからすべてのデータを取得
        const { data, error } = await supabase
          .from('MENU')
          .select('*')
        
        if (error) {
          console.error('メニューデータの取得エラー:', error)
          return
        }
        
        // データをカテゴリーごとに整理
        const categorizedItems: Record<string, MenuItem[]> = {}
        
        data.forEach((item: any) => {
          // カテゴリーが存在しない場合は初期化
          if (!categorizedItems[item.category]) {
            categorizedItems[item.category] = []
          }
          
          // アイテムを追加
          categorizedItems[item.category].push({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image || "/placeholder.svg?height=200&width=200",
            popular: item.popular || false
          })
        })
        
        setMenuItems(categorizedItems)
      } catch (e) {
        console.error('データ取得中に例外が発生しました:', e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMenuData()
  }, [])

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="ウドンド メニュー" showCart={true} backUrl={backUrl} />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-24 z-10 relative">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">メニューを読み込み中...</div>
          </div>
        ) : (
          <Tabs defaultValue={categories[0].id} className="w-full">
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

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4 mt-0">
                {menuItems[category.id]?.length > 0 ? (
                  menuItems[category.id].map((item) => (
                    <Link href={`/menu-detail?id=${item.id}${searchParams.get('store') ? `&store=${searchParams.get('store')}` : ''}${searchParams.get('eatType') ? `&eatType=${searchParams.get('eatType')}` : ''}`} key={item.id}>
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
                                onClick={(e) => handleAddToCart(item, e)}
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
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    このカテゴリーにはメニューがありません
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-purple-500/20 z-20">
        <Link href="/cart">
          <Button className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800">
            カートを見る {getItemCount() > 0 && `(${getItemCount()})`}
          </Button>
        </Link>
      </div>
    </main>
  )
}

// メインエクスポートコンポーネント（Suspenseでラップ）
export default function MenuPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="ウドンド メニュー" showCart={true} />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">読み込み中...</div>
          </div>
        </div>
      </main>
    }>
      <MenuContent />
    </Suspense>
  )
}
