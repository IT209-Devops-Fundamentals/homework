# Bài 3: Bảo Mật Tài Nguyên Bằng HTTP Basic Authentication

---

## 1. Mục Tiêu Bài Thực Hành
- **Kiểm soát truy cập tài nguyên nhạy cảm (Access Control):** Thiết lập cơ chế bảo vệ bằng tài khoản và mật khẩu trực tiếp ở tầng Web Server (Nginx) cho các thư mục hoặc đường dẫn nội bộ (ví dụ: `/admin`).
- **Ứng dụng mã hóa băm mật khẩu (Password Hashing):** Sử dụng tiện ích `htpasswd` từ gói `apache2-utils` để băm mật khẩu theo chuẩn mã hóa an toàn (MD5 APR1 / Crypt / Bcrypt) trước khi lưu vào tệp tin.
- **Tuân thủ quy tắc bảo mật vị trí lưu trữ tệp tin:** Đặt file ẩn `.htpasswd` tại thư mục cấu hình `/etc/nginx/` nằm ngoài cây thư mục web root `/var/www/`, ngăn chặn triệt để nguy cơ người dùng tải về file mật khẩu trực tiếp qua Internet.
- **Kiểm chứng cơ chế xác thực:**
  - Truy cập không có thông tin xác thực: Nginx phản hồi mã `HTTP 401 Unauthorized` kèm header `WWW-Authenticate`.
  - Truy cập kèm tài khoản/mật khẩu hợp lệ: Nginx cho phép truy cập và trả về mã `HTTP 200 OK`.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo apt update && sudo apt install -y apache2-utils` | Cài đặt bộ công cụ tiện ích chứa chương trình tạo mật khẩu `htpasswd`. |
| **2** | `sudo htpasswd -c /etc/nginx/.htpasswd admin_user` | Tạo tệp tin mới (`-c` create) lưu thông tin tài khoản `admin_user` và mật khẩu đã băm. |
| **3** | `sudo chmod 640 /etc/nginx/.htpasswd` | Phân quyền bảo mật: Chỉ cho phép root và group `www-data` đọc file mật khẩu. |
| **4** | `sudo chown root:www-data /etc/nginx/.htpasswd` | Gán group sở hữu cho `www-data` để tiến trình Nginx đọc được file xác thực. |
| **5** | `sudo mkdir -p /var/www/my-web/html/admin` | Tạo thư mục quản trị nội bộ cho đường dẫn `/admin`. |
| **6** | `sudo nginx -t` | Kiểm tra tính hợp lệ của cú pháp cấu hình Nginx trước khi nạp lại. |
| **7** | `sudo systemctl reload nginx` | Nạp lại cấu hình Nginx không gây gián đoạn dịch vụ. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Kết nối tới máy chủ qua cổng 2222
Từ máy cá nhân (PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 -p 2222 devops@103.72.57.112
```

---

### Bước 2: Cài đặt tiện ích `htpasswd` và tạo tệp mật khẩu
1. Cài đặt `apache2-utils`:
```bash
sudo apt update
sudo apt install -y apache2-utils
```

2. Tạo tài khoản `admin_user` và file mật khẩu ẩn tại `/etc/nginx/.htpasswd`:
```bash
sudo htpasswd -c /etc/nginx/.htpasswd admin_user
```
- Nhập mật khẩu bạn muốn đặt (ví dụ: `Admin@2026`).
- Nhập lại mật khẩu để xác nhận.

3. Phân quyền tệp tin an toàn để Nginx đọc được:
```bash
sudo chown root:www-data /etc/nginx/.htpasswd
sudo chmod 640 /etc/nginx/.htpasswd
```

---

### Bước 3: Tạo thư mục và nội dung trang quản trị `/admin`
Để khi đăng nhập thành công hiển thị nội dung trang quản trị đẹp mắt:
```bash
# Tạo thư mục admin
sudo mkdir -p /var/www/my-web/html/admin

# Tạo file index.html cho khu vực admin
sudo tee /var/www/my-web/html/admin/index.html << 'EOF'
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Khu Vực Quản Trị Hệ Thống | PTIT DevOps</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: #1e293b;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            text-align: center;
            border: 1px solid #334155;
        }
        h1 { color: #38bdf8; margin-bottom: 1rem; }
        .tag { background: #059669; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Bảng Điều Khiển Quản Trị (Admin Portal)</h1>
        <p>Chào mừng <strong>admin_user</strong> đã đăng nhập thành công qua HTTP Basic Auth.</p>
        <br>
        <span class="tag">Authenticated Access Granted</span>
    </div>
</body>
</html>
EOF

sudo chown -R $USER:www-data /var/www/my-web/html/admin
sudo chmod -R 755 /var/www/my-web/html/admin
```

---

### Bước 4: Cấu hình Server Block Nginx yêu cầu xác thực
Chỉnh sửa cấu hình `/etc/nginx/sites-available/my-web.conf` để thêm khối `location /admin`:

```bash
sudo tee /etc/nginx/sites-available/my-web.conf << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/my-web/html;
    index index.html index.htm;

    # Cấu hình Custom Error Page 404 (từ Bài 2)
    error_page 404 /404.html;
    location = /404.html {
        root /var/www/my-web/html;
        internal;
    }

    # Cấu hình Basic Authentication cho /admin
    location /admin {
        auth_basic "Restricted Admin Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
        try_files $uri $uri/ =404;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

---

### Bước 5: Kiểm tra cú pháp và Nạp lại Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Kiểm tra khi chưa có thông tin xác thực (Trả về mã 401 Unauthorized):
Chạy lệnh curl kiểm tra header:
```bash
curl -I http://103.72.57.112/admin/
```

👉 **Kết quả:** Nginx từ chối truy cập và gửi kèm thử thách đăng nhập `WWW-Authenticate`:
```text
HTTP/1.1 401 Unauthorized
Server: nginx/1.24.0 (Ubuntu)
Date: Sun, 04 Oct 2026 14:10:00 GMT
Content-Type: text/html
Content-Length: 188
Connection: keep-alive
WWW-Authenticate: Basic realm="Restricted Admin Area"
```

---

### 4.2. Kiểm tra khi truyền thông tin đăng nhập hợp lệ (Trả về mã 200 OK):
Chạy lệnh curl kèm tùy chọn `-u admin_user:<PASSWORD>`:
```bash
curl -I -u admin_user:Admin@2026 http://103.72.57.112/admin/
```

👉 **Kết quả:** Xác thực thành công, mã trạng thái HTTP 200 OK:
```text
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Sun, 04 Oct 2026 14:10:05 GMT
Content-Type: text/html
Content-Length: 1250
Connection: keep-alive
ETag: "66ff0000-4e2"
Accept-Ranges: bytes
```

---

### 4.3. Kiểm tra thực tế trên Trình duyệt Web (Browser)
- Truy cập vào đường dẫn: `http://103.72.57.112/admin/`
- Trình duyệt sẽ bật lên một khung popup dạng Sign-in yêu cầu nhập:
  - **Username:** `admin_user`
  - **Password:** `<Mật khẩu bạn đã tạo>`
- Sau khi nhấn Đăng nhập (Sign In), trang web hiển thị bảng điều khiển quản trị thành công.

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Quy tắc an toàn về vị trí lưu tệp tin `.htpasswd`:**
   - Tuyệt đối không lưu file mật khẩu bên trong thư mục Web Root (ví dụ `/var/www/my-web/html/.htpasswd`). Nếu lưu ở đó, kẻ tấn công có thể tải trực tiếp file băm này về qua URL và sử dụng kỹ thuật Rainbow Table hoặc Hashcat để bẻ khóa mật khẩu offline.
   - Luôn lưu tại `/etc/nginx/.htpasswd` và phân quyền nghiêm ngặt `chmod 640`, chỉ cho phép `root` và tiến trình `www-data` đọc.
2. **Nguyên lý hoạt động của HTTP Basic Authentication:**
   - Cơ chế này sử dụng tiêu đề HTTP chuẩn `Authorization: Basic <base64(user:password)>`.
   - Do Base64 chỉ là một dạng mã hóa chuỗi (Encoding) chứ không phải mã hóa bảo mật (Encryption), bất kỳ ai bắt được gói tin qua mạng HTTP không mã hóa đều có thể giải mã ra mật khẩu thô. Vì vậy trong môi trường Production, **HTTP Basic Authentication bắt buộc phải đi kèm với HTTPS (SSL/TLS)** để đảm bảo an toàn tuyệt đối.
