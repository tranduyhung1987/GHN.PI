# ✅ Checklist Deploy Cloudflare Pages (Siêu Ngắn)

Làm theo đúng thứ tự:

- [ ] 1. Mở terminal, cd vào thư mục frontend
- [ ] 2. Chạy lệnh:
       git add .
       git commit -m "deploy to cloudflare"
       git push
- [ ] 3. Vào https://dash.cloudflare.com
- [ ] 4. Click Pages → Create a project → Connect to Git
- [ ] 5. Chọn repo GHN.PI
- [ ] 6. Điền Build settings:
       - Framework: Vite
       - Build command: npm run build
       - Output: dist
       - Root directory: frontend
- [ ] 7. Click Save and Deploy
- [ ] 8. Chờ build xong, copy link *.pages.dev (ví dụ: https://ghn-pi.pages.dev)
- [ ] 9. **QUAN TRỌNG - Khai báo domain cho Pi Developer Portal**:
       - Vào Pi Browser → Developer (hoặc https://developers.minepi.com)
       - Mở app của bạn trong phần **Develop**
       - Trong 10 mục cấu hình (thường có mục Web / Domains / Allowed URLs / Pi Browser Link)
       - Thêm / khai báo link: `https://ghn-pi.pages.dev` (và nếu có thể thêm `*.pages.dev`)
       - Lưu và chờ propagate (1-2 phút)
- [ ] 10. **Xác minh domain bằng validation-key.txt** (nếu Pi yêu cầu):
       - Pi sẽ cung cấp cho bạn một mã xác minh (dạng chuỗi dài).
       - Tạo/cập nhật file `public/validation-key.txt` trong frontend/ với đúng nội dung là mã đó (không có gì khác).
       - Commit và push (để Cloudflare build lại và file được serve tại root).
       - Sau deploy, kiểm tra trực tiếp: https://ghn-pi.pages.dev/validation-key.txt phải trả về đúng mã.
- [ ] 11. Mở link *.pages.dev **trong Pi Browser** (không phải trình duyệt thường)
- [ ] 12. Hard refresh (kéo mạnh xuống) và test Pi login thật
- [ ] 13. Báo kết quả cho tôi

**Lưu ý**: 
- Bước 9 (khai báo domain) và bước 10 (validation-key.txt) là bắt buộc để Pi Browser cho phép dùng Real Pi SDK (thay vì chỉ mock).
- Sau khi có validation key từ Pi, file `public/validation-key.txt` phải chứa đúng mã đó, rồi push để deploy.
- File này được Vite copy từ public/ vào dist/ và serve tại root của site.

Xong các bước trên là coi như đã deploy + cấu hình Pi thành công.
