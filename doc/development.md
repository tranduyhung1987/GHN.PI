# 🛠 Development Guide - GHN.PI

Hướng dẫn cài đặt và chạy dự án **GHN.PI** ở chế độ phát triển (local).

---

## 📋 Yêu cầu hệ thống

- Node.js 18.x hoặc 20.x
- Git
- Pi Browser (để test Pi SDK thật)
- (Optional) Backend: xem backend/ + docker cho Pi platform demo (hiện tại UI dùng localStorage + Firebase chủ yếu)

---

## 🚀 Cài đặt nhanh bằng Docker (Khuyến nghị cho full stack)

```bash
git clone https://github.com/tranduyhung1987/GHN.PI.git   # official repo (hoặc fork trước nếu muốn đóng góp)
cd GHN.PI
cp .env.example .env
docker-compose up --build
```

> **Lưu ý**: Docker chủ yếu cho backend + mongo. Frontend vẫn deploy riêng Cloudflare Pages.

## ⚡ Chạy chỉ Frontend (nhanh nhất cho dev UI)

Từ gốc repo (sau khi root package.json proxy):
```bash
npm run install:frontend
npm run dev
npm test
```

Hoặc thủ công:
```bash
cd frontend
npm install
npm run dev
```

- Mọi script chính (dev/test/build) ở **gốc** đều tự động vào `frontend/`.
- Xem root `package.json` và phần "📁 Cấu trúc dự án (Monorepo)" trong root README.
- Frontend local không cần .env (Mock Pi + localStorage primary). Backend mới cần .env.example.
