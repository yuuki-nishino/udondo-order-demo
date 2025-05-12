"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

// 注文データの型定義
type OrderData = {
  id: number;
  totalPrice: number;
  store_id: number;
  orderAt: string;
  numbered: string;
  status_id: number;
  eat_style: string;
  payment_method: string;
  storeName?: string;
};

export default function OrderCompletePage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchLatestOrder() {
      setLoading(true);
      const supabase = createClient();
      
      try {
        // 最新の注文を取得
        const { data: orderData, error: orderError } = await supabase
          .from('ORDER')
          .select('*')
          .order('orderAt', { ascending: false })
          .limit(1)
          .single();
        
        if (orderError) {
          console.error('注文データの取得エラー:', orderError);
          return;
        }
        
        // 店舗情報を取得
        if (orderData) {
          const { data: storeData, error: storeError } = await supabase
            .from('STORE')
            .select('name')
            .eq('id', orderData.store_id)
            .single();
          
          if (storeError) {
            console.error('店舗データの取得エラー:', storeError);
          }
          
          // 注文データと店舗名を設定
          setOrder({
            ...orderData,
            storeName: storeData?.name || '不明な店舗'
          });
        }
      } catch (e) {
        console.error('データ取得中に例外が発生しました:', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLatestOrder();
  }, []);
  
  // カートアイテムのモックデータ（実際のアプリではカート状態や注文詳細から取得する）
  const cartItems = [
    {
      id: 1,
      name: "宇宙特製うどん",
      price: 980,
      quantity: 1,
      options: ["麺の硬さ：普通", "トッピング：温泉卵(+¥100)"],
    },
    {
      id: 7,
      name: "海老天（2本）",
      price: 480,
      quantity: 2,
      options: [],
    },
    {
      id: 11,
      name: "緑茶",
      price: 180,
      quantity: 1,
      options: [],
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;
  
  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // 食事方法の表示名
  const getEatStyleName = (eatStyle: string) => {
    switch (eatStyle) {
      case 'eatIn': return '店内飲食';
      case 'takeout': return 'テイクアウト';
      default: return eatStyle;
    }
  };
  
  // 支払い方法の表示名
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit-card': return 'クレジットカード';
      case 'qr-code': return 'QRコード決済';
      case 'e-money': return '電子マネー';
      default: return method;
    }
  };

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="注文完了" />
      
      <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">注文情報を読み込み中...</div>
          </div>
        ) : order ? (
          <>
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-16 h-16 flex items-center justify-center bg-green-800/30 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">ご注文ありがとうございます</h1>
              <p className="text-gray-300 mt-2">注文番号: {order.numbered}</p>
            </div>

            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">注文詳細</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">店舗</span>
                    <span className="text-white">{order.storeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">注文日時</span>
                    <span className="text-white">{formatDate(order.orderAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">食事方法</span>
                    <span className="text-white">{getEatStyleName(order.eat_style)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">支払い方法</span>
                    <span className="text-white">{getPaymentMethodName(order.payment_method)}</span>
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
                    <span className="text-lg font-bold text-white">¥{order.totalPrice.toLocaleString()}</span>
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
          </>
        ) : (
          <div className="flex justify-center items-center h-60">
            <div className="text-red-300">注文情報が見つかりませんでした</div>
          </div>
        )}
      </div>
    </main>
  )
}
