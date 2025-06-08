"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"
import { AppHeader } from "@/components/app-header"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, MapPin, Utensils } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

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

// 注文詳細の型定義
type OrderDetails = {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    options: string[];
    image?: string;
    category: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  orderNumber: string;
  orderAt: string;
  storeId: string;
  eatType: string;
  paymentMethod: string;
};

export default function OrderCompletePage() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        // ローカルストレージから注文詳細を取得
        const savedOrderDetails = localStorage.getItem('lastOrderDetails');
        if (savedOrderDetails) {
          const parsedDetails = JSON.parse(savedOrderDetails) as OrderDetails;
          setOrderDetails(parsedDetails);
          
          // 使用後にローカルストレージから削除
          localStorage.removeItem('lastOrderDetails');
        }
        
        // ダミーの店舗名を設定（実際のアプリではSupabaseから取得）
        console.log('注文完了ページでダミーデータを使用しています');
        
        /* Supabaseとの接続部分（コメントアウト）
        const supabase = createClient();
        
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
        */
      } catch (e) {
        console.error('データ取得中に例外が発生しました:', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrderData();
  }, []);
  
  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // 食事方法の表示名
  const getEatStyleName = (eatStyle: string) => {
    switch (eatStyle) {
      case 'eatIn': 
      case 'eat-in': 
        return '店内飲食';
      case 'takeout': 
      case 'take-out': 
        return 'テイクアウト';
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

  // ダミー店舗名を取得する関数
  const getStoreName = (storeId: string) => {
    const storeNames: Record<string, string> = {
      '1': '大阪蛍池店',
      '2': '大阪中之島店', 
      '3': '富士吉田店'
    };
    return storeNames[storeId] || '不明な店舗';
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
        ) : (order || orderDetails) ? (
          <>
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-16 h-16 flex items-center justify-center bg-green-800/30 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">ご注文ありがとうございます</h1>
              <p className="text-gray-300 mt-2">注文番号: {orderDetails?.orderNumber || order?.numbered}</p>
            </div>

            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">注文詳細</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">店舗</span>
                    <span className="text-white">
                      {orderDetails?.storeId ? getStoreName(orderDetails.storeId) : 
                       order?.storeName || '大阪蛍池店'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">注文日時</span>
                    <span className="text-white">
                      {orderDetails?.orderAt ? formatDate(orderDetails.orderAt) : 
                       order?.orderAt ? formatDate(order.orderAt) : formatDate(new Date().toISOString())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">食事方法</span>
                    <span className="text-white">
                      {orderDetails?.eatType ? getEatStyleName(orderDetails.eatType) : 
                       order?.eat_style ? getEatStyleName(order.eat_style) : '店内飲食'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">支払い方法</span>
                    <span className="text-white">
                      {orderDetails?.paymentMethod ? getPaymentMethodName(orderDetails.paymentMethod) : 
                       order?.payment_method ? getPaymentMethodName(order.payment_method) : 'クレジットカード'}
                    </span>
                  </div>
                </div>

                <Separator className="my-4 bg-purple-500/20" />

                <div className="space-y-2">
                  {orderDetails?.items ? (
                    // 実際の注文内容を表示
                    orderDetails.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between">
                          <span className="text-gray-300">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-white">
                            ¥{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        {item.options.length > 0 && (
                          <div className="ml-2">
                            {item.options.map((option, index) => (
                              <div key={index} className="text-sm text-gray-400">
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    // データが取得できない場合のフォールバック
                    <div className="text-gray-400">注文内容を取得中...</div>
                  )}

                  <Separator className="my-3 bg-purple-500/20" />

                  {orderDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-300">小計</span>
                        <span className="text-white">¥{orderDetails.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">消費税（10%）</span>
                        <span className="text-white">¥{orderDetails.tax.toLocaleString()}</span>
                      </div>
                      <Separator className="my-3 bg-purple-500/20" />
                    </>
                  )}

                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-white">合計</span>
                    <span className="text-lg font-bold text-white">
                      ¥{(orderDetails?.total || order?.totalPrice || 0).toLocaleString()}
                    </span>
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
