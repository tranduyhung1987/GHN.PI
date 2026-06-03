# 🤝 Hướng dẫn Đóng góp - CONTRIBUTING

Cảm ơn bạn đã quan tâm đến dự án **GHN.PI**!  
Mọi đóng góp từ cộng đồng đều được hoan nghênh ❤️

---

## 📋 Quy trình đóng góp

### 1. Fork dự án
- Vào trang GitHub của dự án này.
- Click nút **"Fork"** ở góc trên bên phải.
- Chọn tài khoản của bạn để tạo bản sao.

### 2. Clone repo về máy
```bash
git clone https://github.com/your-username/GHN.PI.git
cd GHN.PI

### 3. Tạo branch mới
```bash
git checkout -b feature/tinh-nang-moi

### 4. Thực hiện thay đổi

Mở dự án bằng VS Code hoặc editor yêu thích.
Thêm/sửa code, tài liệu, giao diện...
Test bằng lệnh:Bashdocker-compose up --build
```bash
docker-compose up --build

### 5. Commit thay đổi
```bash
git add .
git commit -m "Add: mô tả ngắn gọn những gì bạn đã làm"

### 6. Push và tạo Pull Request
```bash
git push origin feature/tinh-nang-moi

📝 Quy tắc Code (Rất quan trọng)

- **Code sạch, dễ đọc**, có comment khi cần thiết.
- **Test trước khi gửi Pull Request**: chạy `cd frontend && npm run test:run` (và `npm run build` nếu cần).
- **Tuân thủ "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN"**: Khi chỉnh sửa các trang Home, Profile, CreateShipment, ShippingFee, Order, Tracking, BottomNav, RegisterRole... **CHỈ thêm logic/functional** (modals, buttons, calculations, guards, flows). Tuyệt đối KHÔNG thay đổi các giá trị style inline (padding, font-size, colors, border-radius, widths, shadows, feeBoxStyle, inputStyle, card sizes, avatar 60px, v.v.).
- **constants.ts là nguồn chân lý duy nhất** cho 6 vai trò (ROLES, ROLE_INFO, REGISTRABLE_ROLES). Mọi nơi (Home, BottomNav, Profile, Register, guards) phải dùng từ đây.
- **Frontend-first**: Dự án chủ yếu là React SPA (frontend/). Backend (Express/Mongo) là optional/demo. Làm việc chủ yếu trong `frontend/`.
- **Pi Testnet & localStorage primary**: Dữ liệu nhanh/offline-first. Firebase chỉ qua env vars trên Cloudflare.
- Sử dụng Dev Role Switcher (chỉ local DEV) để test tất cả vai trò mà không cần Pi thật.

✅ Những đóng góp được khuyến khích
- Thêm flow thực tế như GHN (Danh bạ, live fee, journey, QR, driver pipeline...).
- Cải thiện Pi SDK handling, error states, offline sync.
- Bổ sung test (vitest), docs, templates.
- Tối ưu mobile/Pi Browser viewport (containment, không tràn).

❓ Hỗ trợ

Mở Issue trên GitHub repository hoặc tham gia thảo luận cộng đồng Pi Network.


Cùng nhau xây dựng GHN.PI trở thành ứng dụng giao hàng nhanh tốt nhất trên Pi Network! 🚀

**Made with ❤️ for the Pi Network community**

