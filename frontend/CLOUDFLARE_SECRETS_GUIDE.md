# 🔐 Hướng dẫn lấy CLOUDFLARE_API_TOKEN và CLOUDFLARE_ACCOUNT_ID

Đây là hướng dẫn **chi tiết từng bước** để lấy 2 giá trị cần thiết cho GitHub Actions deploy lên Cloudflare Pages.

---

## 1. Lấy CLOUDFLARE_ACCOUNT_ID (Dễ)

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Sau khi vào trang chủ, nhìn xuống **góc dưới bên phải** của màn hình.
3. Bạn sẽ thấy dòng chữ:  
   `Account ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
4. Copy toàn bộ giá trị đó.

**Lưu lại** giá trị này, đây là `CLOUDFLARE_ACCOUNT_ID`.

---

## 2. Lấy CLOUDFLARE_API_TOKEN (Quan trọng hơn)

Cloudflare yêu cầu tạo API Token có quyền cụ thể.

### Bước chi tiết:

1. Vào trang quản lý API Tokens:  
   [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)

2. Nhấn nút **Create Token** (màu cam).

3. Ở phần **Custom token**, nhấn **Get started**.

4. Điền thông tin như sau:

   - **Token name**: `GHN.PI - Cloudflare Pages Deploy` (đặt tên gì cũng được)

   - **Permissions** (rất quan trọng):
     - Chọn **Account** → **Cloudflare Pages** → **Edit**

   (Chỉ cần quyền này là đủ cho việc deploy Pages)

5. Ở phần **Account Resources**:
   - Chọn **Include** → **All accounts** (hoặc chọn đúng account bạn đang dùng)

6. Ở phần **Client IP Address Filtering**:
   - Để mặc định (không cần điền)

7. Ở phần **TTL (Time to Live)**:
   - Có thể để trống (token sẽ không hết hạn) hoặc đặt thời hạn nếu muốn.

8. Nhấn nút **Continue to summary**.

9. Kiểm tra lại quyền đã đúng chưa, sau đó nhấn **Create Token**.

10. **Rất quan trọng**: Sau khi tạo xong, Cloudflare sẽ hiển thị token **một lần duy nhất**.

    → **Copy ngay** giá trị đó và lưu vào nơi an toàn (ví dụ: ghi vào file tạm hoặc password manager).

    Ví dụ token sẽ có dạng:
    `x1y2z3abc-...-very-long-string`

    **Đây chính là `CLOUDFLARE_API_TOKEN`**

---

## 3. Thêm vào GitHub Secrets

1. Vào repository GitHub của bạn: `GHN.PI`
2. Vào tab **Settings** → **Secrets and variables** → **Actions**
3. Nhấn **New repository secret**

   - Tạo secret thứ 1:
     - Name: `CLOUDFLARE_API_TOKEN`
     - Value: (dán token vừa copy ở bước trên)

   - Tạo secret thứ 2:
     - Name: `CLOUDFLARE_ACCOUNT_ID`
     - Value: (dán Account ID đã lấy ở phần 1)

4. Nhấn **Add secret** cho từng cái.

---

## Lưu ý bảo mật

- **Không bao giờ** commit API Token vào code.
- Nếu lỡ lộ token, hãy vào Cloudflare xóa token cũ và tạo token mới ngay.
- GitHub Secrets là nơi an toàn để lưu.

---

## Sau khi thêm xong 2 secrets

Bạn có thể push code lên nhánh `main`, workflow sẽ tự động chạy và deploy lên Cloudflare Pages.

---

**Bạn đã lấy xong 2 giá trị này chưa?**

Sau khi làm xong bước này, báo tôi biết để tôi chuyển sang hướng dẫn **B** (Deploy thủ công lần đầu trên Cloudflare Dashboard).