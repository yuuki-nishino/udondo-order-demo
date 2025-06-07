"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// カートアイテムの型定義
export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  options: string[]
  image?: string
  category: string
}

// カートの状態の型定義
type CartState = {
  items: CartItem[]
  total: number
  subtotal: number
  tax: number
}

// アクションの型定義
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }

// 初期状態
const initialState: CartState = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0
}

// カートの状態を計算する関数
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + tax
  return { subtotal, tax, total }
}

// リデューサー関数
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let newItems: CartItem[]
      
      if (existingItem) {
        // 既存のアイテムが存在する場合は数量を増やす
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // 新しいアイテムを追加
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      
      const totals = calculateTotals(newItems)
      return {
        items: newItems,
        ...totals
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const totals = calculateTotals(newItems)
      return {
        items: newItems,
        ...totals
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      
      const totals = calculateTotals(newItems)
      return {
        items: newItems,
        ...totals
      }
    }
    
    case 'CLEAR_CART':
      return initialState
    
    default:
      return state
  }
}

// Context の作成
const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

// Provider コンポーネント
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

// カスタムフック
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  const { state, dispatch } = context
  
  // 便利なメソッドを提供
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }
  
  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }
  
  const getItem = (id: number) => {
    return state.items.find(item => item.id === id)
  }
  
  return {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getItem
  }
} 