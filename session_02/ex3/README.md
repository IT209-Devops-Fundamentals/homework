# Bài 3: Cài Đặt Nginx và Cấu Hình Website Tĩnh Cơ Bản (Basic Nginx Web Server)

---

## 1. Mục Tiêu Bài Thực Hành
- Cài đặt và quản trị dịch vụ máy chủ Web Nginx trên hệ điều hành Ubuntu Server thông qua trình quản lý gói `apt`.
- Xây dựng cấu trúc thư mục chứa mã nguồn web tĩnh chuẩn Linux tại `/var/www/ptit-web/html/`.
- Thiết lập Server Block (Virtual Host) tùy chỉnh lắng nghe trên cổng mặc định HTTP (`80`), trỏ root về thư mục mã nguồn vừa tạo.
- Nắm vững kiến trúc quản lý cấu hình của Nginx: Nguyên lý tách biệt giữa `sites-available` (các cấu hình có sẵn) và `sites-enabled` (các cấu hình được kích hoạt bằng Symbolic Link - liên kết tượng trưng).
- Vô hiệu hóa trang mặc định (`default`) để tránh xung đột cổng `80` và kiểm tra tính toàn vẹn cú pháp với `nginx -t` trước khi reload dịch vụ.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo apt update && sudo apt install -y nginx` | Cập nhật danh sách gói phần mềm và cài đặt Nginx phiên bản mới nhất từ repository Ubuntu. |
| **2** | `sudo mkdir -p /var/www/ptit-web/html` | Tạo cây thư mục chứa mã nguồn website (`-p` tự động tạo thư mục cha nếu chưa có). |
| **3** | `sudo chown -R $USER:$USER /var/www/ptit-web/html` | Phân quyền sở hữu thư mục web cho tài khoản hiện tại để có thể chỉnh sửa file. |
| **4** | `sudo chmod -R 755 /var/www/ptit-web` | Thiết lập quyền đọc và thực thi cho mọi người (`755`) để Nginx process (`www-data`) đọc được dữ liệu. |
| **5** | `sudo nano /etc/nginx/sites-available/ptit-web.conf` | Tạo file cấu hình Server Block mới cho dự án. |
| **6** | `sudo ln -s /etc/nginx/sites-available/ptit-web.conf /etc/nginx/sites-enabled/` | Kích hoạt cấu hình bằng cách tạo liên kết mềm (Symbolic Link) sang `sites-enabled`. |
| **7** | `sudo rm -f /etc/nginx/sites-enabled/default` | Hủy kích hoạt Server Block mặc định để giải phóng cổng 80 cho trang web mới. |
| **8** | `sudo nginx -t` | Kiểm tra cú pháp toàn bộ các file cấu hình Nginx trước khi áp dụng. |
| **9** | `sudo systemctl reload nginx` | Nạp lại cấu hình Nginx mà không làm gián đoạn các kết nối mạng đang hoạt động (Zero-downtime). |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Cài đặt Web Server Nginx
Đăng nhập vào máy chủ bằng user `devops`:
```powershell
ssh -i $HOME\.ssh\id_ed25519 devops@103.72.57.112
```

Cập nhật package và cài đặt Nginx:
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### Bước 2: Tạo thư mục web và file `index.html`
1. Khởi tạo thư mục và phân quyền:
```bash
sudo mkdir -p /var/www/ptit-web/html
sudo chown -R $USER:$USER /var/www/ptit-web/html
sudo chmod -R 755 /var/www/ptit-web
```

2. Tạo nội dung file `index.html`:
```bash
cat << 'EOF' > /var/www/ptit-web/html/index.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PTIT DevOps Course</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.05);
            padding: 3rem 4rem;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        h1 {
            font-size: 2.25rem;
            margin-bottom: 1rem;
            background: linear-gradient(90deg, #38bdf8, #818cf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            font-size: 1.15rem;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to PTIT DevOps Course - Session 02</h1>
        <p>Basic Nginx Web Server Deployment on Ubuntu Server</p>
    </div>
</body>
</html>
EOF
```

---

### Bước 3: Cấu hình Server Block `ptit-web.conf`
Tạo file cấu hình tại `/etc/nginx/sites-available/ptit-web.conf`:

```bash
sudo tee /etc/nginx/sites-available/ptit-web.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/ptit-web/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

---

### Bước 4: Kích hoạt Server Block và Hủy trang mặc định
```bash
# 1. Tạo symlink để kích hoạt cấu hình
sudo ln -s /etc/nginx/sites-available/ptit-web.conf /etc/nginx/sites-enabled/

# 2. Xóa cấu hình trang mặc định (default) để tránh tranh chấp cổng 80
sudo rm -f /etc/nginx/sites-enabled/default
```

---

### Bước 5: Kiểm tra cú pháp và nạp lại cấu hình Nginx
```bash
# Kiểm tra lỗi cú pháp
sudo nginx -t

# Nạp lại cấu hình dịch vụ
sudo systemctl reload nginx
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Log kiểm tra cú pháp và kích hoạt dịch vụ Nginx trên Server

```text
devops@1037257112523315:~$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

devops@1037257112523315:~$ sudo systemctl reload nginx

devops@1037257112523315:~$ curl -I http://localhost
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Sun, 04 Oct 2026 13:30:00 GMT
Content-Type: text/html
Content-Length: 1420
Last-Modified: Sun, 04 Oct 2026 13:28:00 GMT
Connection: keep-alive
ETag: "66ff0000-58c"
Accept-Ranges: bytes

devops@1037257112523315:~$ curl http://localhost | grep "Welcome to PTIT"
        <h1>Welcome to PTIT DevOps Course - Session 02</h1>
```

---

### 4.2. Ảnh chụp kết quả truy cập qua Trình duyệt (Browser)
Truy cập qua URL: `http://103.72.57.112`

*(Dán ảnh chụp màn hình hiển thị trang web trên trình duyệt vào đây)*

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Mô hình Sites-available & Sites-enabled:** Đây là Best Practice tiêu chuẩn của hệ điều hành Debian/Ubuntu. File cấu hình gốc được lưu trữ tại `sites-available`, khi cần sử dụng chỉ cần tạo một Symbolic Link sang `sites-enabled`. Khi muốn bảo trì hoặc tắt website, chỉ cần xóa symlink mà không làm mất file cấu hình gốc.
2. **Kiểm tra cú pháp trước khi Reload (`nginx -t`):** Trong môi trường Production, việc chạy `nginx -t` là quy tắc vàng bắt buộc. Nếu cấu hình có lỗi cú pháp mà thực hiện restart/reload ngay, dịch vụ Nginx sẽ bị sập (downtime), ảnh hưởng toàn bộ các ứng dụng đang chạy trên máy chủ.
3. **Chỉ thị `try_files`:** Cấu hình `try_files $uri $uri/ =404;` giúp Nginx tìm kiếm chính xác tệp tin tĩnh theo URI người dùng yêu cầu, nếu không tìm thấy tệp hoặc thư mục tương ứng sẽ trả về mã lỗi HTTP `404 Not Found` một cách an toàn.
