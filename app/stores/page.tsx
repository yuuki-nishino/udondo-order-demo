"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SpaceBackground } from "@/components/space-background"
import { MapPin, Search, Navigation, Clock, CreditCard, User, UserCheck } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

// Supabaseのテーブル構成に合わせたデータ型
type StoreRecord = {
  id: number
  name: string
  location: string
  contactNumber: string
  openingHours: string
  staffFlag: boolean
}

// アプリケーションで使用するデータ型
type Store = {
  id: number
  name: string
  address: string
  distance: string
  status: string
  staffed: boolean
  hours: string
  waitTime: string
  paymentMethods: string[]
}

// Supabaseのデータをアプリケーションのデータ形式に変換
function mapStoreData(records: StoreRecord[]): Store[] {
  return records.map(record => ({
    id: record.id,
    name: record.name,
    address: record.location, // locationをaddressにマッピング
    distance: "0.5km", // 固定値として設定
    status: "営業中", // デフォルト値
    staffed: record.staffFlag, // staffFlagをstaffedにマッピング
    hours: record.openingHours, // openingHoursをhoursにマッピング
    waitTime: "約10分", // デフォルト値
    paymentMethods: ["現金", "クレジットカード"] // デフォルト値
  }))
}

// フォールバックストアデータ
const fallbackStores: Store[] = [
  {
    id: 1,
    name: "大阪蛍池店",
    address: "大阪府豊中市蛍池2丁目5-13",
    distance: "0.5km",
    status: "営業中",
    staffed: true,
    hours: "24時間営業",
    waitTime: "約10分",
    paymentMethods: ["現金", "クレジットカード", "電子マネー", "QRコード決済"]
  },
  {
    id: 2,
    name: "大阪中之島店",
    address: "大阪府大阪市北区中之島1丁目1-1",
    distance: "13km",
    status: "営業中",
    staffed: false,
    hours: "7:00 - 23:00",
    waitTime: "約15分",
    paymentMethods: ["現金", "クレジットカード", "QRコード決済"]
  },
  {
    id: 3,
    name: "富士吉田店",
    address: "山梨県富士吉田市大和田1丁目1-1",
    distance: "420km",
    status: "営業中",
    staffed: true,
    hours: "8:30 - 22:30",
    waitTime: "約0分",
    paymentMethods: ["現金のみ"]
  }
]

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>(fallbackStores)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStores() {
      setLoading(true)
      const supabase = createClient()
      
      try {
        // STOREテーブルからすべてのデータを取得
        const { data, error } = await supabase
          .from('STORE')
          .select('*')
        
        if (error) {
          console.error('Storesデータの取得エラー:', error)
          return
        }

        console.log('取得したSTOREデータ:', data)
        
        // データが存在する場合は使用、そうでなければフォールバックデータを使用
        if (data && data.length > 0) {
          setStores(mapStoreData(data))
        }
      } catch (e) {
        console.error('データ取得中に例外が発生しました:', e)
      } finally {
        setLoading(false)
      }
    }

    getStores()
  }, [])

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="店舗を選択" />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-24 z-10 relative">
        <div className="flex items-center gap-2 mb-6 bg-black/60 backdrop-blur-md rounded-lg p-3 border border-purple-500/30">
          <Search className="w-5 h-5 text-purple-300" />
          <Input
            placeholder="店舗名や住所で検索"
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300">
            <Navigation className="w-4 h-4 mr-2" />
            現在地から近い順
          </Button>
          <Button variant="ghost" size="sm" className="text-purple-300">
            <Clock className="w-4 h-4 mr-2" />
            待ち時間順
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">店舗情報を読み込み中...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {stores.map((store) => (
              <Card key={store.id} className="bg-black/60 border-purple-500/30 backdrop-blur-md hover:bg-black/70 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white">{store.name}</CardTitle>
                    <span className="text-sm px-2 py-1 rounded-full bg-green-900/60 text-green-300">
                      {store.status}
                    </span>
                  </div>
                  <CardDescription className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-1 inline" />
                    {store.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 text-sm text-gray-300">
                  <p>営業時間: {store.hours}</p>
                  <div className="flex items-center my-1">
                    {store.staffed ? (
                      <div className="flex items-center text-teal-300">
                        <UserCheck className="w-4 h-4 mr-1" />
                        <span>現在スタッフ対応可</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-300">
                        <User className="w-4 h-4 mr-1" />
                        <span>現在無人営業中</span>
                      </div>
                    )}
                  </div>
                  <p>現在の待ち時間: {store.waitTime}</p>
                  <div className="mt-2">
                    <div className="flex items-center mb-1">
                      <CreditCard className="w-4 h-4 mr-1 text-purple-300" />
                      <span className="text-purple-200 font-medium">支払い方法</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {store.paymentMethods.map((method, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-indigo-900/60 text-indigo-300">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <span className="text-sm text-purple-300">距離: {store.distance}</span>
                  <div className="flex gap-2">
                    <Link href={`/menu?store=${store.id}&eatType=takeout`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800"
                      >
                        テイクアウト
                      </Button>
                    </Link>
                    <Link href={`/menu?store=${store.id}&eatType=eatIn`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-900/20"
                      >
                        店内飲食
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
