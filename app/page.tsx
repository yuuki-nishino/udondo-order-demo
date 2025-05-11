import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SpaceBackground } from "@/components/space-background"
import { UdondoLogo } from "@/components/udondo-logo"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <SpaceBackground />

      <div className="z-10 flex flex-col items-center justify-center gap-8 max-w-md w-full">
        <UdondoLogo className="w-64 h-64 mb-4" />

        <h1 className="text-4xl font-bold text-center tracking-wider">
          ウドンド
          <span className="block text-2xl mt-2 text-purple-300">事前オーダーシステム</span>
        </h1>

        <Card className="w-full bg-black/60 border border-purple-500/30 backdrop-blur-md">
          <CardContent className="p-6 flex flex-col gap-4">
            <Link href="/stores" className="w-full">
              <Button className="w-full text-lg py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 border border-purple-400/20">
                注文を始める
              </Button>
            </Link>

            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full text-lg py-6 border-purple-500/50 hover:bg-purple-950/30">
                ログイン
              </Button>
            </Link>

            <Link href="/order-history" className="w-full">
              <Button
                variant="ghost"
                className="w-full text-lg py-6 text-purple-300 hover:text-purple-200 hover:bg-purple-950/20"
              >
                注文履歴を確認
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
