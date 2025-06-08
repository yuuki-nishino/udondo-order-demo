"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { CreditCard, DollarSign, Smartphone, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// import { createClient } from "@/utils/supabase/client"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'

// メイン決済コンテンツコンポーネント
function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('store') || "1"; // デフォルト店舗ID
  const eatType = searchParams.get('eatType') || "eatIn"; // デフォルト食事タイプ
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);
  
  // 実際のカートデータを取得
  const { items, subtotal, tax, total, clearCart } = useCart();

  // カートが空の場合の表示
  if (items.length === 0) {
    return (
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="お支払い" />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="text-center py-20">
            <div className="text-gray-400 mb-6">カートが空です</div>
            <Link href="/menu">
              <Button className="bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800">
                メニューを見る
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  // 支払い処理と注文登録
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // const supabase = createClient();
      
      // 現在の日時
      const now = new Date();
      
      // 注文番号の生成（例: 店舗ID + 年月日 + ランダム数字3桁）
      const orderNumberPrefix = `${storeId}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderNumber = `${orderNumberPrefix}-${randomSuffix}`;
      
      // 注文詳細をローカルストレージに保存（注文完了画面で使用）
      const orderDetails = {
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        orderNumber: orderNumber,
        orderAt: now.toISOString(),
        storeId: storeId,
        eatType: eatType,
        paymentMethod: paymentMethod
      };
      
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      
      // ORDERテーブルに注文データを挿入
      // const { data, error } = await supabase
      //   .from('ORDER')
      //   .insert({
      //     totalPrice: total,
      //     store_id: parseInt(storeId),
      //     orderAt: now.toISOString(),
      //     numbered: orderNumber,
      //     status_id: 1, // 1: 注文受付
      //     eat_style: eatType,
      //     payment_method: paymentMethod
      //   })
      //   .select();
      
      // if (error) {
      //   console.error('注文の保存に失敗しました:', error);
      //   throw new Error('注文の保存に失敗しました');
      // }
      
      // console.log('注文が完了しました:', data);
      
      // カートをクリア
      clearCart();
      
      // 注文完了ページに遷移
      router.push('/order-complete');
      
    } catch (error) {
      console.error('決済処理中にエラーが発生しました:', error);
      alert('決済処理中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="お支払い" />

      <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">支払い方法</h3>
            <RadioGroup defaultValue="credit-card" onValueChange={setPaymentMethod} value={paymentMethod}>
              <div className="flex items-center space-x-2 mb-4 p-3 border border-purple-500/30 rounded-md">
                <RadioGroupItem id="credit-card" value="credit-card" />
                <Label htmlFor="credit-card" className="text-gray-300 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
                  クレジットカード
                </Label>
              </div>

              <div className="flex items-center space-x-2 mb-4 p-3 border border-purple-500/30 rounded-md">
                <RadioGroupItem id="qr-code" value="qr-code" />
                <Label htmlFor="qr-code" className="text-gray-300 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-purple-400" />
                  QRコード決済
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border border-purple-500/30 rounded-md">
                <RadioGroupItem id="e-money" value="e-money" />
                <Label htmlFor="e-money" className="text-gray-300 flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-purple-400" />
                  電子マネー
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">クレジットカード情報</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number" className="text-sm text-gray-400 mb-1 block">
                  カード番号
                </Label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-black/40 border border-purple-500/30 rounded-md p-2 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="expiry" className="text-sm text-gray-400 mb-1 block">
                    有効期限
                  </Label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-md p-2 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="flex-1">
                  <Label htmlFor="cvc" className="text-sm text-gray-400 mb-1 block">
                    セキュリティコード
                  </Label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    className="w-full bg-black/40 border border-purple-500/30 rounded-md p-2 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-sm text-gray-400 mb-1 block">
                  カード名義
                </Label>
                <input
                  id="name"
                  type="text"
                  placeholder="TARO YAMADA"
                  className="w-full bg-black/40 border border-purple-500/30 rounded-md p-2 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">注文内容</h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-white">{item.name}</p>
                    {item.options.length > 0 && (
                      <div className="text-xs text-gray-400">
                        {item.options.slice(0, 2).map((option, index) => (
                          <p key={index}>{option}</p>
                        ))}
                        {item.options.length > 2 && (
                          <p>+{item.options.length - 2}個のオプション</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-white">¥{item.price.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-purple-500/20" />

            <div className="space-y-2">
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
          <Button 
            className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : `お支払い（¥${total.toLocaleString()}）`}
          </Button>
        </div>
      </div>
    </main>
  )
}

// メインエクスポートコンポーネント（Suspenseでラップ）
export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="お支払い" />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">読み込み中...</div>
          </div>
        </div>
      </main>
    }>
      <PaymentContent />
    </Suspense>
  )
}
