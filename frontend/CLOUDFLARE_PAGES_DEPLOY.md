# 🚀 GHN.PI - Deploy Lên Cloudflare Pages (Cách Siêu Đơn Giản)

**Mục tiêu**: Bỏ Vercel và đưa app lên Cloudflare Pages để test trên Pi Browser.

Chúng ta sẽ dùng cách **đơn giản nhất** hiện nay: Kết nối Git trực tiếp trên Cloudflare.  
**Không cần tạo API Token, không cần thêm secret.**

---

## Bước 1: Push code lên GitHub

Mở terminal và chạy các lệnh sau:

```bash
cd "C:\Users\ENTER NODE\Documents\GitHub\GHN.PI\frontend"

git add .
git commit -m "chore: migrate to Cloudflare Pages"
git push
```

Nếu nó hỏi commit message, bạn có thể dùng lệnh trên.

---

## Bước 2: Deploy trên Cloudflare (Chỉ 5 phút)

1. Mở trình duyệt và vào: [https://dash.cloudflare.com](https://dash.cloudflare.com)

2. Ở cột bên trái, click vào **Pages**

3. Click nút **Create a project**

4. Chọn **Connect to Git**

5. Tìm và chọn repository tên **GHN.PI**

6. Cloudflare sẽ hỏi **Build settings**. Điền đúng như sau:

   - **Framework preset**: Chọn **Vite**
   - **Build command**: Gõ `npm run build`
   - **Build output directory**: Gõ `dist`
   - **Root directory**: Gõ `frontend`   ← Quan trọng!

7. Cuối cùng click nút **Save and Deploy**

Chờ khoảng 1-3 phút cho Cloudflare build xong.

---

## Bước 3: Lấy link mới

Sau khi build xong, Cloudflare sẽ cho bạn một link dạng:

**https://ghn-pi.pages.dev**  
hoặc tương tự (tên có thể khác một chút).

**Đây là link bạn sẽ dùng để mở trên Pi Browser.**

**Lưu ý quan trọng về Pi Domain**:
- Pi Browser chỉ cho phép app của bạn dùng Real Pi SDK (window.Pi) nếu domain đã được khai báo trong Pi Developer Portal.
- Nếu chưa khai báo, code sẽ tự động rơi về Mock (demo) dù bạn mở trong Pi Browser.
- Sau khi fix code detection (đã làm), bước khai báo domain trong "Develop" section là bước quyết định để có Pi thật.

---

## Bước 4: Khai báo Domain vào Pi Developer Portal (BẮT BUỘC cho Real Pi)

Sau khi có link `https://ghn-pi.pages.dev`:

1. Mở **Pi Browser**.
2. Vào phần **Developer** (hoặc mở https://developers.minepi.com trong Pi Browser).
3. Chọn app GHN.PI (hoặc app bạn đang dùng).
4. Vào tab **Develop** (hoặc phần cấu hình app).
5. Tìm trong **10 mục** cấu hình (thường có các mục như: App Info, Sandbox, Production, Web Settings, Domains, Allowed Origins, Pi Browser URLs...).
6. **Khai báo / thêm link**:
   - `https://ghn-pi.pages.dev`
   - Nếu có ô "Allowed Domains" hoặc "Web App URL" hoặc "Pi Browser Link" → paste link vào.
7. Save và chờ 30-60 giây.

**Đây là bước quan trọng nhất để dùng Pi thật (không phải Mock).** Nếu bỏ qua, dù mở trong Pi Browser bạn vẫn chỉ thấy demo.

## Bước 5: Test trên Pi Browser

1. Copy link `*.pages.dev` vừa có.
2. Mở **Pi Browser**.
3. Dán link vào và thử dùng app.
4. **Hard refresh**: Kéo thật mạnh xuống hoặc đóng tab mở lại.
5. Nhấn nút "Đăng nhập với Pi Network" → phải hiện popup Pi thật.

**Sau khi test xong, hãy báo tôi kết quả**:
- Có hiện popup đăng nhập Pi thật không?
- Sau login có hiện username thật của bạn không?
- Khi tạo đơn có thanh toán Pi thật không (không phải mock)?

---

## Những file đã chuẩn bị sẵn (không cần làm gì thêm)

Tôi đã tạo giúp bạn:
- `public/_headers` → Cấu hình bảo mật hỗ trợ Pi SDK
- `public/_redirects` → Để React Router hoạt động đúng

Những file này sẽ tự động được dùng khi Cloudflare build.

---

## Tiếp theo bạn muốn làm gì?

Sau khi test trên Pi Browser xong, bạn có thể chọn:

**A.** Hướng dẫn cách gán domain đẹp sau này (khi mua domain thật)

**B.** Hướng dẫn cách làm cho app tự động deploy mỗi khi push code (không cần vào dashboard thủ công)

**C.** Khắc phục lỗi nếu app vẫn bị chặn trên Pi Browser

**D.** Làm gì khác (bạn nói rõ)

---

---

## Hỗ trợ nhanh

Tôi đã tạo thêm file **DEPLOY_CHECKLIST.md** (checklist siêu ngắn) để bạn dễ làm theo.

**Bạn muốn làm gì tiếp theo?**

- Muốn tôi giải thích rõ hơn bước nào trong hướng dẫn?
- Muốn tôi tạo thêm file hướng dẫn mua domain sau này?
- Hay bạn đã sẵn sàng bắt đầu deploy và muốn tôi ở đây hỗ trợ khi bạn làm?

Cứ nói thẳng bạn cần gì. Tôi sẽ làm ngay.