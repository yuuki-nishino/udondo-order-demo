import { ReactNode } from 'react'

// 静的エクスポート用のパラメータ生成関数
export async function generateStaticParams() {
  // 静的ビルド時に利用可能なメニューIDを定義
  // 実際のプロダクションでは、ビルド時にSupabaseからメニュー一覧を取得することも可能
  const menuIds = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ];
  
  return menuIds.map((id) => ({
    id: id,
  }));
}

interface MenuItemLayoutProps {
  children: ReactNode
}

export default function MenuItemLayout({ children }: MenuItemLayoutProps) {
  return <>{children}</>
} 