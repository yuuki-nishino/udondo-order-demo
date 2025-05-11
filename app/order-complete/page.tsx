import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { CheckCircle, Clock, Copy } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function OrderCompletePage() {
  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="注文完了" showBack={false} />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-24 z-10 relative">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">注文が完了しました</h1>
          <p className="text-gray-300 text-center">
            ご注文ありがとうございます。
            <br />
            以下の注文番号をお控えください。
          </p>
        </div>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-400 mb-2">注文番号</h3>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-3xl font-bold text-white tracking-widest">A-123</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-purple-300 hover:text-purple-200 hover:bg-purple-950/20"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">コピー</span>
                </Button>
              </div>

              <div className="flex items-center text-yellow-300 gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <p className="font-medium">準備時間：約10分</p>
              </div>

              <p className="text-gray-300 text-center text-sm">
                店舗のディスプレイに表示される注文番号をご確認ください。
                <br />
                お呼びがあったらカウンターまでお越しください。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">注文詳細</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-300">店舗</span>
                <span className="text-white">ウドンド 東京駅店</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">注文日時</span>
                <span className="text-white">2023/05/03 12:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">食事方法</span>
                <span className="text-white">店内飲食</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">支払い方法</span>
                <span className="text-white">クレジットカード</span>
              </div>
            </div>

            <Separator className="my-4 bg-purple-500/20" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">宇宙特製うどん × 1</span>
                <span className="text-white">¥980</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">海老天（2本） × 2</span>
                <span className="text-white">¥960</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">緑茶 × 1</span>
                <span className="text-white">¥180</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">トッピング：温泉卵</span>
                <span className="text-white">¥100</span>
              </div>

              <Separator className="my-3 bg-purple-500/20" />

              <div className="flex justify-between">
                <span className="text-lg font-medium text-white">合計</span>
                <span className="text-lg font-bold text-white">¥2,442</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Link href="/order-history">
            <Button variant="outline" className="w-full py-6 border-purple-500/50 hover:bg-purple-950/30">
              注文履歴を確認
            </Button>
          </Link>

          <Link href="/">
            <Button className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800">
              トップに戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
