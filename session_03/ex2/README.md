# Bài 2: Cấu Hình Trang Lỗi Tùy Chỉnh (Custom Error Page 404)

---

## 1. Mục Tiêu Bài Thực Hành
- **Cải thiện trải nghiệm người dùng (UX):** Cấu hình Web Server Nginx hiển thị giao diện báo lỗi `404 Not Found` được thiết kế đồng bộ với nhận diện thương hiệu của dự án, thay thế trang lỗi mặc định trắng đen đơn điệu của hệ thống.
- **Bảo mật tệp tin tài nguyên với chỉ thị `internal`:** Sử dụng chỉ thị `internal` của Nginx để ngăn chặn người dùng từ Internet truy cập trực tiếp vào tệp tin `/404.html`, chỉ cho phép Nginx gọi nội bộ khi có sự kiện lỗi thực tế phát sinh.
- **Nắm vững cơ chế xử lý lỗi của Nginx:** Phối hợp giữa chỉ thị `error_page` và các khối `location` đặc biệt (`location = /404.html`).

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo mkdir -p /var/www/my-web/html` | Tạo thư mục web root `/var/www/my-web/html/` theo đúng ràng buộc đề bài. |
| **2** | `sudo chown -R devops:www-data /var/www/my-web` | Phân quyền sở hữu thư mục cho user `devops` và group `www-data`. |
| **3** | `sudo nano /var/www/my-web/html/404.html` | Tạo tệp tin giao diện báo lỗi HTML tùy biến. |
| **4** | `sudo nano /etc/nginx/sites-available/my-web.conf` | Cấu hình Server Block với chỉ thị `error_page 404 /404.html;` và `internal;`. |
| **5** | `sudo ln -sf /etc/nginx/sites-available/my-web.conf /etc/nginx/sites-enabled/` | Kích hoạt Server Block bằng Symbolic Link sang `sites-enabled`. |
| **6** | `sudo nginx -t` | Kiểm tra tính toàn vẹn cú pháp của các file cấu hình Nginx trước khi nạp lại. |
| **7** | `sudo systemctl reload nginx` | Nạp lại cấu hình Nginx trong thời gian thực (Zero Downtime). |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Kết nối tới máy chủ qua cổng 2222
Từ máy cá nhân (PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 -p 2222 devops@103.72.57.112
```

---

### Bước 2: Tạo thư mục web và các tệp tin HTML
1. Tạo thư mục và phân quyền:
```bash
sudo mkdir -p /var/www/my-web/html
sudo chown -R $USER:www-data /var/www/my-web
sudo chmod -R 755 /var/www/my-web
```

2. Tạo trang chủ `index.html` cơ bản (nếu chưa có):
```bash
cat << 'EOF' > /var/www/my-web/html/index.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Trang Chủ | PTIT DevOps</title>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
    <h1>Hệ Thống Web PTIT DevOps</h1>
    <p>Trang web đang hoạt động bình thường trên cổng 80.</p>
</body>
</html>
EOF
```

3. Tạo tệp tin lỗi tùy biến `404.html`:
```bash
cat << 'EOF' > /var/www/my-web/html/404.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Không Tìm Thấy Trang | PTIT DevOps</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 1.5rem;
        }
        .error-card {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            border-radius: 24px;
            padding: 3.5rem 3rem;
            text-align: center;
            max-width: 540px;
            width: 100%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }
        .error-code {
            font-size: 6.5rem;
            font-weight: 900;
            line-height: 1;
            letter-spacing: -2px;
            background: linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #f59e0b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
        }
        p {
            font-size: 1.05rem;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: #ffffff;
            font-weight: 600;
            text-decoration: none;
            padding: 0.85rem 2rem;
            border-radius: 9999px;
            transition: all 0.2s ease;
        }
    </style>
</head>
<body>
    <div class="error-card">
        <div class="error-code">404</div>
        <h1>Không Tìm Thấy Trang</h1>
        <p>Đường dẫn bạn vừa yêu cầu không tồn tại trên hệ thống máy chủ hoặc đã được di chuyển sang địa chỉ khác.</p>
        <a href="/" class="btn">Quay Về Trang Chủ</a>
    </div>
</body>
</html>
EOF
```

---

### Bước 3: Cấu hình Server Block `my-web.conf`
Tạo file cấu hình tại `/etc/nginx/sites-available/my-web.conf`:

```bash
sudo tee /etc/nginx/sites-available/my-web.conf << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/my-web/html;
    index index.html index.htm;

    # Định tuyến trang báo lỗi 404
    error_page 404 /404.html;

    # Khối bảo vệ chỉ thị internal
    location = /404.html {
        root /var/www/my-web/html;
        internal;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

---

### Bước 4: Kích hoạt cấu hình và Nạp lại Nginx
```bash
# 1. Kích hoạt Server Block my-web.conf
sudo ln -sf /etc/nginx/sites-available/my-web.conf /etc/nginx/sites-enabled/

# 2. Gỡ bỏ các site khác nếu có tranh chấp default_server
sudo rm -f /etc/nginx/sites-enabled/ptit-web.conf
sudo rm -f /etc/nginx/sites-enabled/default

# 3. Kiểm tra cú pháp cấu hình
sudo nginx -t

# 4. Nạp lại Nginx
sudo systemctl reload nginx
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Kiểm tra truy cập đường dẫn không tồn tại:
Chạy lệnh kiểm tra từ máy cá nhân hoặc trên server:
```bash
curl -I http://103.72.57.112/invalid-path-demo
```

👉 **Kết quả mong đợi:** Mã trạng thái `HTTP/1.1 404 Not Found` được trả về kèm nội dung giao diện tùy biến `404.html`:
```text
HTTP/1.1 404 Not Found
Server: nginx/1.24.0 (Ubuntu)
Date: Sun, 04 Oct 2026 14:00:00 GMT
Content-Type: text/html
Content-Length: 2840
Connection: keep-alive
ETag: "66ff0000-b18"
```

---

### 4.2. Kiểm tra bảo mật với chỉ thị `internal` (Truy cập trực tiếp file `/404.html`):
Chạy lệnh thử truy cập thẳng tệp tin nguồn:
```bash
curl -I http://103.72.57.112/404.html
```

👉 **Kết quả mong đợi:** Trả về mã lỗi `HTTP/1.1 404 Not Found` (Nginx từ chối truy cập từ client bên ngoài vì tệp tin đã được đánh dấu là `internal`).

```text
HTTP/1.1 404 Not Found
Server: nginx/1.24.0 (Ubuntu)
Date: Sun, 04 Oct 2026 14:00:02 GMT
Content-Type: text/html
Content-Length: 2840
Connection: keep-alive
```

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Ý nghĩa an ninh của chỉ thị `internal` trong Nginx:**
   - Khi không có chỉ thị `internal`, người dùng ngoài Internet có thể truy cập `http://<IP>/404.html` và nhận về mã trạng thái `200 OK`, gây hiểu nhầm cho các công cụ SEO Crawler và tạo ra nguy cơ rò rỉ cấu trúc tệp tin.
   - Thêm chỉ thị `internal;` đảm bảo chỉ có các yêu cầu nội bộ từ chính Nginx (như từ chỉ thị `error_page`, `rewrite`, hay `X-Accel-Redirect`) mới được phép đọc và phân phối nội dung tệp tin này.
2. **Cú pháp so sánh chính xác (`location = /404.html`):**
   - Dấu `=` chỉ định đối sánh chính xác (Exact match) với độ ưu tiên cao nhất trong bảng quy tắc tìm kiếm URI của Nginx, giúp Nginx xử lý phản hồi lỗi cực kỳ nhanh chóng mà không cần duyệt qua các biểu thức chính quy (Regex).
