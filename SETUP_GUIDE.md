# 📘 Phase 1: Setup & Foundation — Hướng dẫn từng bước

> **Cập nhật**: 2026-03-16  
> **Trạng thái tiến độ**: Đang thực hiện Bước 2

---

## Bước 1: Khởi tạo Vite + React + TypeScript ✅ DONE

```bash
npm create vite@latest ./ -- --template react-ts
npm install
npm run dev
```

- ✅ Project đã khởi tạo thành công
- ✅ `npm run dev` chạy được tại `http://localhost:5173`

---

## Bước 2: Cài TailwindCSS v4 🟡 ĐANG LÀM

> [!WARNING]
> **Lỗi gặp phải**: Vite v8.0.0 chưa được `@tailwindcss/vite` hỗ trợ.
> **Giải pháp**: Downgrade Vite xuống v7 trước khi cài TailwindCSS.

### 2.1. Downgrade Vite xuống v7

```bash
npm install vite@7 @vitejs/plugin-react@5 --save-dev
```

### 2.2. Cài TailwindCSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

### 2.3. Cấu hình `vite.config.ts`

Mở file `vite.config.ts` và sửa thành:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### 2.4. Cấu hình CSS

Mở file `src/index.css`, **XÓA TOÀN BỘ nội dung cũ** và thay bằng:

```css
@import "tailwindcss";
```

### 2.5. Test TailwindCSS

Mở file `src/App.tsx`, **XÓA TOÀN BỘ nội dung cũ** và thay bằng:

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">
        Crypto Dashboard 🚀
      </h1>
    </div>
  )
}

export default App
```

### 2.6. Chạy kiểm tra

```bash
npm run dev
```

> ✅ **Kết quả mong đợi**: Trang web nền đen, chữ trắng lớn "Crypto Dashboard 🚀" ở giữa màn hình

---

## Bước 3: Cấu hình Path Aliases ⬜ CHƯA LÀM

> shadcn/ui yêu cầu path alias `@/` để import components.

### 3.1. Cài @types/node

```bash
npm install -D @types/node
```

### 3.2. Cấu hình `tsconfig.json`

Mở file `tsconfig.json` (file root, KHÔNG phải tsconfig.app.json), sửa thành:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 3.3. Cấu hình `tsconfig.app.json`

Mở file `tsconfig.app.json`, thêm 2 dòng sau vào bên trong `"compilerOptions"`:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

### 3.4. Cấu hình Vite alias

Cập nhật `vite.config.ts` thành:

```ts
import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

## Bước 4: Cài shadcn/ui ⬜ CHƯA LÀM

### 4.1. Khởi tạo shadcn/ui

```bash
npx shadcn@latest init
```

Chọn options khi được hỏi:
- **Style**: `New York`
- **Base color**: `Zinc` hoặc `Slate`
- **CSS variables**: `Yes`

### 4.2. Cài thử component Button

```bash
npx shadcn@latest add button
```

### 4.3. Test shadcn/ui

Cập nhật `src/App.tsx`:

```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-white">
        Crypto Dashboard 🚀
      </h1>
      <Button variant="default">Connect Wallet</Button>
      <Button variant="outline">View Portfolio</Button>
    </div>
  )
}

export default App
```

### 4.4. Chạy kiểm tra

```bash
npm run dev
```

> ✅ **Kết quả mong đợi**: Tiêu đề + 2 button shadcn/ui được styled đẹp

---

## Bước 5: Cài wagmi + viem + TanStack Query ⬜ CHƯA LÀM

```bash
npm install wagmi viem@2.x @tanstack/react-query
```

> **Chưa cần config gì**, sẽ config ở Bước 7.

---

## Bước 6: Chuẩn bị môi trường Blockchain ⬜ CHƯA LÀM

> Bước này làm trên trình duyệt, không liên quan code.

### 6a. Cài MetaMask
- Vào [metamask.io](https://metamask.io/) → Download extension
- Tạo wallet mới → **LƯU SEED PHRASE an toàn!**

### 6b. Thêm Sepolia Testnet
- Mở MetaMask → Settings → Networks → Add Network
- Hoặc vào [chainlist.org](https://chainlist.org/) search "Sepolia" → Add to MetaMask
- Chain ID: `11155111`

### 6c. Lấy Sepolia ETH miễn phí
- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- Nhập wallet address → Request ETH → Đợi vài giây

### 6d. Đăng ký Alchemy (free)
- Vào [dashboard.alchemy.com](https://dashboard.alchemy.com/)
- Đăng ký free → Tạo App → chọn **Ethereum** → **Sepolia**
- Copy **API Key** (dạng: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`)

---

## Bước 7: Config wagmi & Environment ⬜ CHƯA LÀM

### 7.1. Tạo file `.env` ở root project

```env
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

### 7.2. Kiểm tra `.gitignore` có dòng:

```
.env
.env.local
```

### 7.3. Tạo file `src/lib/wagmi.ts`

```ts
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`),
  },
})
```

### 7.4. Cập nhật `src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './lib/wagmi'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
```

### 7.5. Chạy kiểm tra

```bash
npm run dev
```

> ✅ **Kết quả mong đợi**: App chạy bình thường, không lỗi trong console

---

## 📊 Checklist tổng Phase 1

| # | Bước | Trạng thái |
|---|---|---|
| 1 | Vite + React + TypeScript | ✅ Done |
| 2 | TailwindCSS v4 | 🟡 Đang làm (cần fix Vite version) |
| 3 | Path alias `@/` | ⬜ Chưa làm |
| 4 | shadcn/ui | ⬜ Chưa làm |
| 5 | wagmi + viem + TanStack Query | ⬜ Chưa làm |
| 6 | MetaMask + Sepolia ETH + Alchemy | ⬜ Chưa làm |
| 7 | wagmi config + .env | ⬜ Chưa làm |

---

## 🐛 Lỗi đã gặp & cách sửa

| Lỗi | Nguyên nhân | Giải pháp |
|---|---|---|
| `@tailwindcss/vite` ERESOLVE | Vite v8 chưa được TailwindCSS v4 hỗ trợ | `npm install vite@7 @vitejs/plugin-react@5 --save-dev` |
