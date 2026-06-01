# 🔐 Hướng dẫn thiết lập Environment Variables cho Firebase trên Cloudflare Pages

Mục tiêu: Loại bỏ hoàn toàn việc dùng Firebase config hardcoded trong production.

## Bước 1: Chuẩn bị giá trị

Bạn cần lấy 6 giá trị từ Firebase Console:

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project **ghn-pi**
3. Vào **Project settings** (biểu tượng bánh răng) → **General**
4. Cuộn xuống phần **Your apps** → Chọn app web
5. Copy các giá trị sau:

   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Bước 2: Thêm vào Cloudflare Pages

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn **Pages**
3. Chọn project **ghn-pi**
4. Vào tab **Settings** → **Environment variables**
5. Click **Add variable** và thêm từng biến sau (chọn cả **Production** và **Preview**):

   | Variable Name                        | Giá trị                              |
   |--------------------------------------|--------------------------------------|
   | `VITE_FIREBASE_API_KEY`              | (dán apiKey)                         |
   | `VITE_FIREBASE_AUTH_DOMAIN`          | (dán authDomain)                     |
   | `VITE_FIREBASE_PROJECT_ID`           | (dán projectId)                      |
   | `VITE_FIREBASE_STORAGE_BUCKET`       | (dán storageBucket)                  |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID`  | (dán messagingSenderId)              |
   | `VITE_FIREBASE_APP_ID`               | (dán appId)                          |

6. Sau khi thêm xong tất cả 6 biến → Click **Save and Deploy**

## Bước 3: Redeploy

Cloudflare sẽ tự động trigger một bản deploy mới sau khi bạn lưu biến môi trường.

Hoặc bạn có thể chủ động redeploy bằng cách push thêm một commit nhỏ lên GitHub.

## Bước 4: Kiểm tra

Sau khi deploy xong, mở lại `https://ghn-pi.pages.dev` và kiểm tra Console (F12):

- Cảnh báo `[Firebase] Đang dùng config hardcoded trong production...` **phải biến mất**.

---

**Lưu ý quan trọng:**
- Tên biến phải bắt đầu bằng `VITE_` (đây là quy ước của Vite).
- Sau khi thêm biến môi trường, **bắt buộc phải redeploy** mới có hiệu lực.
- Không bao giờ commit file `.env` thật lên GitHub.