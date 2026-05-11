# 🚀 GHN.PI - Giao Hàng Nhanh Thanh Toán Bằng Pi

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click%20Here-brightgreen?style=for-the-badge)](https://ghn-pi.vercel.app)  
[![GitHub license](https://img.shields.io/github/license/tranduyhung1987/GHN.PI?style=for-the-badge)](LICENSE.md)  
[![Pi Network](https://img.shields.io/badge/Powered%20by-Pi%20Network-9B59B6?style=for-the-badge)](https://minepi.com)

**Ứng dụng giao hàng nhanh đầu tiên trên Pi Network** – Kết nối shipper và khách hàng, thanh toán nhanh chóng bằng Pi.

---

## ✨ Giới thiệu

**GHN.PI** là dự án **Giao Hàng Nhanh** được xây dựng trên nền tảng **Pi Network**, cho phép người dùng đặt hàng, theo dõi đơn hàng và thanh toán trực tiếp bằng Pi mà không cần chuyển đổi tiền fiat.

- **Tình trạng**: Đang phát triển (Testnet) → Sắp Mainnet
- **Phiên bản**: L14Pro (nâng cấp nhiều tính năng)
- **Fork từ**: [Pi Demo App](https://github.com/pi-apps/demo) chính thức

---

## 🚀 Tính năng nổi bật

### ✅ Đã hoàn thành
- Xác thực người dùng qua **Pi SDK**
- Thanh toán **Pi Payment** (User-to-App)
- Quản lý đơn hàng (tạo, theo dõi, cập nhật trạng thái)
- Hệ thống shipper (nhận đơn, cập nhật vị trí)
- Reverse Proxy & Docker support
- Backend API với Express + MongoDB

### 🔄 Đang phát triển
- Bản đồ theo dõi thời gian thực
- Hệ thống đánh giá & feedback
- Tích hợp API GHN chính thức (khi có)
- Multi-language (VN/EN)

---

## 🛠 Công nghệ sử dụng

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + MongoDB
- **Container**: Docker + docker-compose
- **Authentication & Payment**: Pi SDK + Pi Platform API
- **Deployment**: Vercel / Render / Self-host

---

## 📱 Xem Demo Trực Tiếp

**[→ Mở GHN.PI ngay](https://ghn-pi.vercel.app)** *(thay bằng link Vercel/Netlify thật của bạn)*

---

## 🛠 Hướng dẫn cài đặt & Chạy local

Xem chi tiết trong thư mục [`doc/`](./doc/):

- [Development Guide](./doc/development.md)
- [Deployment Guide](./doc/deployment.md)

**Cách nhanh nhất:**

```bash
git clone https://github.com/tranduyhung1987/GHN.PI.git
cd GHN.PI
cp .env.example .env
docker-compose up --build
