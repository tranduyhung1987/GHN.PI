## 📋 Mô tả Pull Request

Mô tả ngắn gọn những gì PR này làm và tại sao.

## 🔗 Liên quan
- Issue #: (nếu có)
- Loại thay đổi: Bug fix / Feature / Docs / Test / Refactor / Other

## ✅ Checklist (bắt buộc)
- [ ] Tôi đã chạy `cd frontend && npm run test:run` và tất cả test pass.
- [ ] Tôi đã chạy `cd frontend && npm run build` (nếu có thay đổi code).
- [ ] **KHÔNG vi phạm "NGHIÊM CẤM THAY ĐỔI GIAO DIỆN"**: Chỉ thêm/sửa logic, modals, calculations, guards, flows. KHÔNG động vào bất kỳ giá trị style inline nào (sizes, colors, paddings, feeBoxStyle, Profile header, cards, BottomNav...).
- [ ] Đã sử dụng `src/utils/constants.ts` (ROLES, ROLE_INFO, REGISTRABLE_ROLES, helpers) làm nguồn duy nhất nếu liên quan vai trò.
- [ ] Cập nhật docs (README, FLOWS, CHANGELOG, CONTRIBUTING) nếu cần.
- [ ] Đã test trên Dev Role Switcher cho ít nhất 2-3 vai trò (guest + sender + driver).
- [ ] PR nhắm vào `main` branch.

## 📸 Screenshots / Demo (nếu có thay đổi UI logic)
Thêm ảnh hoặc mô tả flow mới (chỉ logic, không style thay đổi).

## 📝 Ghi chú thêm
- Dùng localStorage primary + optional Firebase.
- Pi SDK: real trên minepi.com/pibrowser, Mock dev.
- Nếu thêm page mới → nhớ lazy import + route + AuthGuard nếu cần.

**Cảm ơn bạn đã đóng góp cho cộng đồng Pi Network!** ❤️

**Made with ❤️ for the Pi Network community**
