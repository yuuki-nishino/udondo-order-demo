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
import { useSearchParams, useRouter } from "next/navigation"
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
  allergens?: string[];
};

// トッピングの型定義
type Topping = {
  id: string;
  name: string;
  price: number;
  checked: boolean;
};

// メインコンポーネント内部
function MenuDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedHardness, setSelectedHardness] = useState("normal");
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([
    { id: "topping-1", name: "旨い煮豚", price: 400, checked: false },
    { id: "topping-2", name: "大阪スジ煮", price: 450, checked: false },
    { id: "topping-3", name: "麹漬け旨煮鶏", price: 380, checked: false },
    { id: "topping-4", name: "ウドンドの覚醒（激辛ウマすりだね）", price: 180, checked: false },
    { id: "topping-5", name: "生たまご", price: 50, checked: false },
    { id: "topping-6", name: "追加ねぎ", price: 20, checked: false },
    { id: "topping-7", name: "追加麺（1玉）", price: 230, checked: false },
  ]);
  const [remarks, setRemarks] = useState("");
  
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // URLクエリパラメータを保持して戻る
  const storeId = searchParams.get('store');
  const eatType = searchParams.get('eatType');
  const backUrl = storeId && eatType 
    ? `/menu?store=${storeId}&eatType=${eatType}` 
    : '/menu';

  // 数量を変更する関数
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // トッピングの選択状態を変更する関数
  const handleToppingChange = (toppingId: string, checked: boolean) => {
    setSelectedToppings(prev => 
      prev.map(topping => 
        topping.id === toppingId 
          ? { ...topping, checked }
          : topping
      )
    );
  };

  // 合計金額を計算する関数
  const calculateTotal = () => {
    if (!menuItem) return 0;
    const basePrice = menuItem.price;
    const toppingsPrice = selectedToppings
      .filter(topping => topping.checked)
      .reduce((sum, topping) => sum + topping.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  // カートに追加する関数
  const handleAddToCart = () => {
    if (!menuItem) return;

    const selectedToppingNames = selectedToppings
      .filter(topping => topping.checked)
      .map(topping => topping.name);
    
    const options = [
      `麺の硬さ：${selectedHardness === 'soft' ? 'やわらかめ' : selectedHardness === 'normal' ? '普通' : 'かため'}`,
      ...selectedToppingNames.map(name => `トッピング：${name}`),
      ...(remarks ? [`備考：${remarks}`] : [])
    ];

    const itemTotal = calculateTotal();
    const basePrice = Math.floor(itemTotal / quantity); // 1個あたりの価格（トッピング込み）

    // 指定された数量分だけカートに追加
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: menuItem.id + (Date.now() + i), // ユニークなIDを生成（同じメニューでもオプションが違う場合は別アイテムとして扱う）
        name: menuItem.name,
        price: basePrice,
        options: options,
        image: menuItem.image,
        category: menuItem.category
      });
    }

    toast({
      title: "カートに追加しました",
      description: `${menuItem.name} × ${quantity}をカートに追加しました`,
      duration: 2000,
    });

    // カートページに遷移
    router.push('/cart');
  };
  
  // Supabaseからメニューデータを取得
  useEffect(() => {
    async function fetchMenuItem() {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();
      
      try {
        // MENUテーブルから指定されたIDのデータを取得
        const { data, error } = await supabase
          .from('MENU')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('メニューデータの取得エラー:', error);
          // エラー時のフォールバックデータ
          setMenuItem({
            id: parseInt(id),
            name: "メニュー",
            price: 0,
            description: "メニュー情報が見つかりませんでした",
            category: "",
            image: "/placeholder.svg?height=400&width=400",
            allergens: []
          });
          return;
        }
        
        // データをセット
        if (data) {
          setMenuItem({
            id: data.id,
            name: data.name,
            price: data.price,
            description: data.description,
            category: data.category,
            image: data.image || "/placeholder.svg?height=400&width=400",
            popular: data.popular || false,
            allergens: data.allergens ? data.allergens.split(';') : []
          });
        }
      } catch (e) {
        console.error('データ取得中に例外が発生しました:', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMenuItem();
  }, [id]);

  // IDが指定されていない場合
  if (!id) {
    return (
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="メニュー詳細" backUrl="/menu" showCart={true} />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="flex justify-center items-center h-60">
            <div className="text-red-300">メニューIDが指定されていません</div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="メニュー詳細" backUrl={backUrl} showCart={true} />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">メニューを読み込み中...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!menuItem) {
    return (
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="メニュー詳細" backUrl={backUrl} showCart={true} />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="flex justify-center items-center h-60">
            <div className="text-red-300">メニューが見つかりませんでした</div>
          </div>
        </div>
      </main>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <main className="min-h-screen relative">
      <SpaceBackground />
      <AppHeader title="メニュー詳細" backUrl={backUrl} showCart={true} />

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
            {menuItem.allergens && menuItem.allergens.map((allergen) => (
              allergen && (
                <span
                  key={allergen}
                  className="text-xs bg-red-900/40 text-red-300 px-2 py-1 rounded-full border border-red-500/30"
                >
                  {allergen}
                </span>
              )
            ))}
          </div>
        </div>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">数量</span>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border-purple-500/50"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">減らす</span>
                </Button>
                <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border-purple-500/50"
                  onClick={() => handleQuantityChange(1)}
                >
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
            <RadioGroup value={selectedHardness} onValueChange={setSelectedHardness}>
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
              {selectedToppings.map((topping) => (
                <div key={topping.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={topping.id} 
                      checked={topping.checked}
                      onCheckedChange={(checked) => handleToppingChange(topping.id, checked as boolean)}
                    />
                    <Label htmlFor={topping.id} className="text-gray-300">
                      {topping.name}
                    </Label>
                  </div>
                  <span className="text-gray-400">+¥{topping.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">備考</h3>
            <textarea
              placeholder="アレルギーや特別なリクエストがあればご記入ください"
              className="w-full h-24 bg-black/40 border border-purple-500/30 rounded-md p-3 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-purple-500/20 z-20">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300">合計</span>
            <span className="text-xl font-bold text-white">¥{totalPrice.toLocaleString()}</span>
          </div>
          <Button 
            className="w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800"
            onClick={handleAddToCart}
          >
            カートに追加 ({quantity}個)
          </Button>
        </div>
      </div>
    </main>
  )
}

// メインエクスポートコンポーネント（Suspenseでラップ）
export default function MenuDetailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative">
        <SpaceBackground />
        <AppHeader title="メニュー詳細" />
        <div className="container max-w-md mx-auto p-4 pt-20 pb-32 z-10 relative">
          <div className="flex justify-center items-center h-60">
            <div className="text-purple-300">読み込み中...</div>
          </div>
        </div>
      </main>
    }>
      <MenuDetailContent />
    </Suspense>
  )
} 