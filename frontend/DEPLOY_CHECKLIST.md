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
- [ ] 8. Chờ build xong, copy link *.pages.dev
- [ ] 9. Mở link đó trong Pi Browser và test
- [ ] 10. Báo kết quả cho tôi

Xong 10 bước trên là coi như đã deploy thành công.

Không cần làm thêm gì khác lúc này.
