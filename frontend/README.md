# GHN.PI Frontend

**React + Vite + TypeScript + Tailwind** cho ứng dụng Giao Hàng Nhanh trên **Pi Browser Testnet**.

Xem README chính của dự án tại [../README.md](../README.md) (root) để biết đầy đủ:

- 6 vai trò (Người mới, Người gửi, Tài xế, Kho, Người nhận, Admin)
- Tích hợp Pi SDK thật (createPayment, onIncomplete)
- Các flow thực tế: Gửi hàng (Danh bạ full), Tra cứu cước live, Đơn hàng của tôi, Theo dõi + journey, QR Scanner cho driver, Đóng góp, Cá nhân + hỗ trợ...
- Dev tools (role switcher + force guest)
- Deploy Cloudflare Pages + env vars (Firebase + VITE_ADMIN_USERNAMES)

## Chạy local

```bash
npm install
npm run dev
```

- Trên localhost: dùng Mock Pi Service (có devMockPiUsername, dev role switcher top-right).
- Pi Browser thật: tự động dùng Real SDK khi hostname phù hợp.

## Build & Deploy

```bash
npm run build
npm run deploy:cloudflare   # cần wrangler + secrets
```

Chi tiết: xem `CLOUDFLARE_*.md`, `DEPLOY_CHECKLIST.md`, `wrangler.toml`, `.github/workflows/deploy-cloudflare-pages.yml`

**Lưu ý**: localStorage primary cho testnet (nhanh, offline). Firebase chỉ qua env (xem CLOUDFLARE_ENV_VARS.md).

**Tech**: Vite 5, React 18, TS, React Router, TanStack Query, Firebase, html5-qrcode (cho QR).

---

**Made for Pi Network Testnet** • Pi Browser optimized (2-col grid, containment, no overflow).
