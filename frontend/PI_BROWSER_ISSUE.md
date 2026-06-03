# Pi Browser & Real Pi SDK - Diagnosis & Setup

## Current Status (Updated)

- ✅ Trang load tốt trên Cloudflare Pages (`ghn-pi.pages.dev`) trong Pi Browser (không còn bị chặn như Vercel).
- ✅ Code đã fix detection: Khi mở trong Pi Browser thật (có `window.Pi` hoặc userAgent `pibrowser`), sẽ dùng **Real Pi SDK** thay vì Mock, ngay cả trên `*.pages.dev`.
- ❌ **Vấn đề phổ biến còn lại**: Dù mở trong Pi Browser, vẫn chỉ thấy **Mock / Demo** nếu **chưa khai báo domain** trong Pi Developer Portal.

## Root Cause (Real Pi không hoạt động)

Pi Network yêu cầu bạn **phải khai báo link web** của app trong Pi Developer Console để Real SDK (authenticate + createPayment) được phép chạy từ domain đó.

Cụ thể:
- Vào **Pi Browser → Developer** (hoặc https://developers.minepi.com)
- Mở app của bạn
- Vào phần **Develop** (có khoảng 10 mục cấu hình)
- Tìm mục liên quan đến **Web / Domain / Allowed URLs / Pi Browser Link / Sandbox Web App**
- Thêm `https://ghn-pi.pages.dev` (và `*.pages.dev` nếu cho phép)

Nếu không làm bước này → Pi Browser sẽ không inject quyền real Pi cho domain lạ → code rơi về Mock.

## Hướng dẫn đầy đủ

Xem chi tiết tại:
- `CLOUDFLARE_PAGES_DEPLOY.md` (có phần Bước 4: Khai báo Domain vào Pi Developer Portal)
- `DEPLOY_CHECKLIST.md` (có checklist rõ ràng bước khai báo domain)

## Code đã hỗ trợ tốt

- Detection thông minh trong `src/core/pi/piService.ts`: Ưu tiên Real khi phát hiện Pi Browser.
- RealPiService đã có graceful fallback và log rõ.
- UI có thông báo "Đã kết nối Pi thật" khi thành công.

## Checklist nhanh khi test Real Pi

1. Deploy thành công lên Cloudflare → lấy link `*.pages.dev`
2. **Khai báo domain trong Pi Developer Portal (Develop section)**
3. Mở link **bằng Pi Browser** (không browser thường)
4. Hard refresh
5. Nhấn "Đăng nhập với Pi" → phải hiện popup Pi thật
6. Sau login → nút hiển thị username thật của bạn (không phải mock)

Last updated: 2026 (sau khi fix detection + cập nhật docs)
