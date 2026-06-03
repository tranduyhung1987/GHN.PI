# 🛠 Development Guide - GHN.PI

Hướng dẫn cài đặt và chạy dự án **GHN.PI** ở chế độ phát triển (local).

---

## 📋 Yêu cầu hệ thống

- Node.js 18.x hoặc 20.x
- Git
- Pi Browser (để test Pi SDK thật)
- (Optional) Backend: xem backend/ + docker cho Pi platform demo (hiện tại UI dùng localStorage + Firebase chủ yếu)

---

## 🚀 Cài đặt nhanh bằng Docker (Khuyến nghị)

```bash
git clone https://github.com/tranduyhung1987/GHN.PI.git   # official repo (hoặc fork trước nếu muốn đóng góp)
cd GHN.PI
cp .env.example .env
docker-compose up --build
