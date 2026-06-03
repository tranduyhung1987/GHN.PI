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
- [ ] 10. Mở link *.pages.dev **trong Pi Browser** (không phải trình duyệt thường)
- [ ] 11. Hard refresh (kéo mạnh xuống) và test Pi login thật
- [ ] 12. Báo kết quả cho tôi

**Lưu ý**: Nếu không khai báo domain trong Pi Developer Portal (bước 9), dù code đã fix detection, bạn vẫn chỉ thấy Mock / demo. Đây là yêu cầu bắt buộc của Pi để dùng Real SDK từ domain bên ngoài.

Xong các bước trên là coi như đã deploy + cấu hình Pi thành công.
