'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // サーバー状態管理のデフォルト設定
            staleTime: 60 * 1000, // 1分間は新鮮と判断
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動リフレッシュを無効
            retry: 1, // エラー時のリトライ回数
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 開発環境でのみデバッグツールを表示 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}