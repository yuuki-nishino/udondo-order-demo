"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { CreditCard, Smartphone, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Separator } from "@/components/ui/separator"

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('store') || "1"; // デフォルト店舗ID
  const eatType = searchParams.get('eatType') || "eatIn"; // デフォルト食事タイプ
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);
  
  // カートアイテムのモックデータ（実際のアプリではカート状態から取得する）
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
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;
  
  // 支払い処理と注文登録
  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // 現在の日時
      const now = new Date();
      
      // 注文番号の生成（例: 店舗ID + 年月日 + ランダム数字3桁）
      const orderNumberPrefix = `${storeId}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderNumber = `${orderNumberPrefix}-${randomSuffix}`;
      
      // ORDERテーブルに注文データを挿入
      const { data, error } = await supabase
        .from('ORDER')
        .insert({
          totalPrice: total,
          store_id: parseInt(storeId),
          orderAt: now.toISOString(),
          numbered: orderNumber,
          status_id: 1, // 1: 注文受付
          eat_style: eatType,
          payment_method: paymentMethod
        })
        .select();
      
      if (error) {
        console.error('注文の保存に失敗しました:', error);
        throw new Error('注文の保存に失敗しました');
      }
      
      console.log('注文が完了しました:', data);
      
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
          <Button 
            className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800"
            disabled={isLoading}
            onClick={handlePayment}
          >
            {isLoading ? '処理中...' : '支払いを完了する'}
          </Button>
        </div>
      </div>
    </main>
  )
}
