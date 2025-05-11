export function UdondoLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 opacity-70 blur-md" />
      <div className="relative flex items-center justify-center w-full h-full rounded-full bg-black border-2 border-purple-500/30">
        <div className="text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 text-center">
          惑星の<br />
          ウドンド
        </div>
      </div>
    </div>
  )
}
