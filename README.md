# 🚀 GHN.PI - Giao Hàng Nhanh Thanh Toán Bằng Pi

[![Live Demo](https://img.shields.io/badge/Live_Demo-ghn--pi.pages.dev-brightgreen?style=for-the-badge)](https://ghn-pi.pages.dev)
[![GitHub license](https://img.shields.io/github/license/tranduyhung1987/GHN.PI)](LICENSE.md)
[![Stars](https://img.shields.io/github/stars/tranduyhung1987/GHN.PI?style=social)](https://github.com/tranduyhung1987/GHN.PI)

**Ứng dụng giao hàng nhanh thực tế trên Pi Browser (Testnet)** – 6 vai trò Việt Nam, Pi Payment thật (sdk.minepi.com), trải nghiệm như GHN với localStorage primary + Cloudflare Pages.

---

## ✨ Giới thiệu

GHN.PI là frontend **React + Vite + TypeScript + Tailwind** dành riêng cho **Pi Browser**, mang lại trải nghiệm giao hàng nhanh (GHN) thực tế trên Pi Network Testnet.

- **Tình trạng**: Testnet sẵn sàng, deploy Cloudflare Pages
- **Đặc điểm**: 6 vai trò bất biến (Người mới/guest, Người gửi, Tài xế, Kho trung chuyển, Người nhận, Admin), tích hợp **Pi SDK thật** (createPayment + onIncompletePaymentFound), localStorage primary cho tốc độ/offline + Firebase (chỉ qua env vars, không hardcode)
- **Quy tắc dev**: "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN" cho một số phần (chỉ thêm logic, modals, guards, flow)
- **Tối ưu Pi Browser**: 2-col grid trên mobile, box-sizing containment, no overflow trên viewport hẹp, dev tools cho test role mà không cần Pi login thật.

---

## 📁 Cấu trúc dự án (Monorepo)

```
GHN.PI/
├── frontend/          # ❤️ CHÍNH: React 18 + Vite + TS + Tailwind (Pi Browser app)
│   ├── src/           # Toàn bộ UI, 6 roles, engines, pages (Home, Create, Driver, Order, Tracking...)
│   ├── public/        # manifest, _headers (CSP + camera), favicon
│   └── package.json   # Đúng deps hiện tại (React 18, vitest, html5-qrcode, firebase...)
├── backend/           # Optional: Express + Mongo (demo Pi payment/session). Không bắt buộc.
├── doc/               # Development, deployment, docker guides
├── .github/workflows/ # CI test + Cloudflare deploy (đều trỏ vào frontend/)
├── docker-compose.yml # (Optional) full stack với backend + mongo
├── .env.example       # Chủ yếu cho backend/docker (frontend dùng Cloudflare env vars)
├── CHANGELOG.md
├── FLOWS.md
├── CONTRIBUTING.md
└── README.md          # Bạn đang đọc
```

**Quan trọng**:
- **Luôn làm việc chính trong `frontend/`**.
- Chạy lệnh ở **gốc repo** (`npm run dev`) sẽ tự động cd vào frontend (xem root package.json đã được dọn).
- Tránh `npm install` trực tiếp ở gốc nếu không cần backend (sẽ chỉ cài frontend qua script).

---

## 🚀 Tính năng chính (như GHN thật trên Pi)

### Vai trò & Giao diện
- **6 vai trò** (single source: `src/utils/constants.ts`): 
  - Người mới (guest): 8 thẻ khóa, phải Pi login → đăng ký vai trò.
  - Người gửi: Gửi hàng (Danh bạ đầy đủ CRUD, copy, prefill, COD toggle, moTaHang bắt buộc, weight/dims 0+placeholder, live fee), Đơn hàng của tôi (stats + 5 tabs + hủy + tạo lại + PullToRefresh), Tra cứu cước (live useMemo với COD/khaiGia/volume/zone, history, apply), Theo dõi, Đóng góp.
  - Tài xế: Đơn hàng của tôi (active pipeline + next status update + COD), Bản đồ (simulated route map + animation), Lịch sử giao (driver-specific completed + COD collected), Tracking (role-aware), Quét QR (modal camera sim + quick list + manual + thực update status/journey).
  - Kho trung chuyển, Người nhận, Admin (hardcode VITE_ADMIN_USERNAMES).
- Home cards + 4-tab BottomNav **role-specific**, no role-switch in functional pages (chỉ ở Cá nhân).
- Dev tools (chỉ DEV): Dropdown 6 vai trò + force guest toggle (top-right) để test nhanh.

### Chức năng chính
- **Gửi hàng**: Form GHN thực (sender/receiver sections, searchable Danh bạ modal select/edit/delete/add, copy sender→receiver, inline validation, post-success reset, volume/weight/COD/khaiGia fee).
- **Tra cứu cước**: Province selects (20+), live recalc useMemo, service toggle, COD enabled + "Thu hộ COD (người nhận thanh toán)" line, "Tạo đơn với cước này".
- **Đơn hàng & Theo dõi**: Stats, search, 5 tabs, rich cards, chi tiết modal, journey timeline, hủy pipeline (OrderEngine + journeyStore), role actions.
- **Đóng góp cộng đồng**: 3 tabs (Gửi góp ý / Bảng tin / Thống kê), persist local, like/comment modal.
- **Cá nhân**: Header restructured (avatar left 60px + ID/role/rating + small pill "🔄 Đổi vai trò" top-right), stats, activity, settings, Hỗ trợ & Trợ giúp (form + my tickets + chat modal auto-reply), SenderProfileCard.
- **Pi tích hợp**: Real SDK khi hostname minepi.com / pibrowser, Mock dev, incomplete payments handling.
- **Khác**: PullToRefresh, live fee/volume calc (max(weight, dims/6000)), VN phone validation, prefill from mySenderInfo/lastReceiver + profile.

**Lưu trữ**: localStorage primary (testnet speed/offline) + Firebase (env-enforced only).

**Deploy**: Cloudflare Pages (frontend/dist, wrangler.toml, GitHub workflow, _headers CSP cho Pi SDK + Firebase).

---

## 📱 Xem Demo Trực Tiếp

**[→ Mở GHN.PI ngay (Pi Browser khuyến nghị)](https://ghn-pi.pages.dev)**

- Dùng **Dev Role Switcher** (chỉ local DEV) để test tất cả 6 vai trò mà không cần Pi login thật.
- Trên Pi Browser thật: 
  1. Mở link `ghn-pi.pages.dev` **bên trong Pi Browser**.
  2. **Bắt buộc**: Vào Pi Developer Portal (Developer section) → app của bạn → Develop → khai báo domain `https://ghn-pi.pages.dev` (trong 10 mục cấu hình, thường ở phần Web/Domains/Allowed URLs).
  3. Hard refresh → login Pi thật → chọn vai trò → full features (Real SDK).

---

## 🛠 Hướng dẫn & Tài liệu

**Chạy nhanh từ gốc repo (khuyến nghị sau khi dọn monorepo)**:
```bash
npm install          # hoặc npm run install:frontend
npm run dev          # tự động vào frontend + start Vite
npm test             # chạy vitest ở frontend
npm run build
```

**Frontend (chính)**:
- `cd frontend && npm install && npm run dev` (cách cũ vẫn hoạt động)
- Hoặc dùng script ở gốc: `npm run dev`
- Dev tools (Role Switcher) xuất hiện tự động khi `import.meta.env.DEV`.
- Pi mock trên localhost / pages.dev / vercel; real Pi SDK chỉ khi hostname chứa minepi.com hoặc userAgent pibrowser.
- Xem chi tiết deploy & env:
  - [CLOUDFLARE_ENV_VARS.md](./frontend/CLOUDFLARE_ENV_VARS.md) (Firebase keys + VITE_ADMIN_USERNAMES=your_admin_username)
  - [CLOUDFLARE_PAGES_DEPLOY.md](./frontend/CLOUDFLARE_PAGES_DEPLOY.md)
  - [PI_BROWSER_ISSUE.md](./frontend/PI_BROWSER_ISSUE.md)
  - [DEPLOY_CHECKLIST.md](./frontend/DEPLOY_CHECKLIST.md)

**Khác**:
- [Development Guide](./doc/development.md)
- [Luồng chức năng](./FLOWS.md)
- [Hướng dẫn đóng góp](./CONTRIBUTING.md)
- Backend (nếu dùng): xem backend/README.md + doc/docker-setup.md
- Xem cấu trúc chi tiết ở phần "📁 Cấu trúc dự án (Monorepo)" phía trên.

**Admin**: Chỉ gán qua `VITE_ADMIN_USERNAMES` (Cloudflare Variables/Secrets) hoặc dev override `localStorage.setItem('devAdminUsernames', 'username')`.

---

## 🤝 Đóng góp

Rất hoan nghênh sự đóng góp từ cộng đồng Pi!  
- Thêm flow thực tế GHN, cải thiện Pi SDK handling, tối ưu mobile viewport.
- **Lưu ý**: Tuân thủ "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN" khi edit Home cards, form inputs, fee box, Profile header v.v. (chỉ thêm logic/functional).

Xem chi tiết tại [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📜 License

Project tuân thủ **PiOS License** của Pi Core Team.

---

**Made with ❤️ for the Pi Network community**

**Testnet sẵn sàng trên Pi Browser** • Deploy Cloudflare Pages • 6 vai trò đầy đủ như GHN thật.

⭐ Nếu bạn thấy dự án hữu ích, hãy tặng **1 Star** nhé!
