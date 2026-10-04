# Bài 5: Thiết Lập Thư Mục Web An Toàn Tại Phân Vùng Hệ Thống (/opt/)

---

## 1. Mục Tiêu Bài Thực Hành
- **Cô lập tài nguyên (Resource Isolation):** Chuyển toàn bộ mã nguồn website tĩnh và cấu hình tệp nhật ký (logs) ra khỏi các đường dẫn mặc định của hệ thống (`/var/www/`, `/var/log/nginx/`) sang phân vùng `/opt/` (thư mục dành cho các gói phần mềm độc lập/doanh nghiệp).
- **Phân quyền nâng cao đa vai trò (Advanced RBAC & Permissions):**
  - Tài khoản làm việc `devops`: Có toàn quyền đọc và ghi trên thư mục mã nguồn `/opt/my-app/html/` mà **không cần đặc quyền `sudo`**.
  - Nhóm tiến trình Nginx `www-data`: Có quyền đọc mã nguồn tĩnh và **quyền ghi (Write)** vào thư mục tệp nhật ký `/opt/my-app/logs/` để lưu vết `access.log` và `error.log`.
- **Tùy biến đường dẫn ghi nhật ký Nginx:** Cấu hình trực tiếp các chỉ thị `access_log` và `error_log` trong Server Block trỏ đến phân vùng lưu trữ mới.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo mkdir -p /opt/my-app/html /opt/my-app/logs` | Tạo cấu trúc thư mục chứa mã nguồn và thư mục lưu trữ logs tại `/opt/`. |
| **2** | `sudo chown -R devops:www-data /opt/my-app` | Đổi quyền sở hữu đệ quy: Owner là `devops`, Group là `www-data`. |
| **3** | `sudo chmod -R 755 /opt/my-app/html` | Phân quyền đọc và thực thi cho thư mục web tĩnh. |
| **4** | `sudo chmod 775 /opt/my-app/logs` | **[QUAN TRỌNG]** Cấp quyền ghi (`w` - 775) cho group `www-data` để Nginx worker process có thể tạo và ghi log. |
| **5** | `sudo nano /etc/nginx/sites-available/opt-app.conf` | Cấu hình Server Block Nginx trỏ root về `/opt/my-app/html` và logs về `/opt/my-app/logs/`. |
| **6** | `sudo ln -sf /etc/nginx/sites-available/opt-app.conf /etc/nginx/sites-enabled/` | Kích hoạt Server Block bằng liên kết mềm (Symbolic Link). |
| **7** | `sudo nginx -t && sudo systemctl reload nginx` | Kiểm tra cú pháp và nạp lại cấu hình dịch vụ Nginx. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Kết nối tới máy chủ qua cổng SSH 2222
Từ máy cá nhân (PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 -p 2222 devops@103.72.57.112
```

---

### Bước 2: Tạo cấu trúc thư mục tại `/opt/` và phân quyền bảo mật

1. **Khởi tạo các thư mục:**
```bash
sudo mkdir -p /opt/my-app/html /opt/my-app/logs
```

2. **Phân quyền sở hữu và quyền truy cập:**
```bash
# Gán sở hữu cho devops:www-data
sudo chown -R devops:www-data /opt/my-app

# Phân quyền thư mục web tĩnh
sudo chmod -R 755 /opt/my-app/html

# Cấp quyền ghi cho group www-data vào thư mục logs
sudo chmod 775 /opt/my-app/logs
```

3. **Tạo trang `index.html` mẫu:**
```bash
cat << 'EOF' > /opt/my-app/html/index.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Production Isolated App | /opt/my-app</title>
    <style>
        body {
            font-family: sans-serif;
            background: #18181b;
            color: #f4f4f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .box {
            background: #27272a;
            padding: 3rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        h1 { color: #38bdf8; }
        .tag { background: #0284c7; padding: 0.4rem 1rem; border-radius: 6px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="box">
        <h1>Production Isolated Web Application</h1>
        <p>Ứng dụng web và logs được cô lập bảo mật tại phân vùng hệ thống <code>/opt/</code>.</p>
        <br>
        <span class="tag">Root: /opt/my-app/html | Logs: /opt/my-app/logs</span>
    </div>
</body>
</html>
EOF
```

---

### Bước 3: Cấu hình Server Block `opt-app.conf`
Tạo file cấu hình tại `/etc/nginx/sites-available/opt-app.conf`:

```bash
sudo tee /etc/nginx/sites-available/opt-app.conf << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /opt/my-app/html;
    index index.html index.htm;

    # Định tuyến đường dẫn lưu trữ logs tùy biến
    access_log /opt/my-app/logs/access.log;
    error_log /opt/my-app/logs/error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

---

### Bước 4: Kích hoạt Server Block và Nạp lại Nginx

```bash
# 1. Kích hoạt Server Block opt-app.conf
sudo ln -sf /etc/nginx/sites-available/opt-app.conf /etc/nginx/sites-enabled/

# 2. Gỡ bỏ site my-web cũ để tránh xung đột default_server trên cổng 80
sudo rm -f /etc/nginx/sites-enabled/my-web.conf

# 3. Kiểm tra cú pháp
sudo nginx -t

# 4. Nạp lại Nginx
sudo systemctl reload nginx
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Kiểm tra cấu trúc phân quyền tệp tin và thư mục:
Chạy lệnh liệt kê chi tiết:
```bash
ls -la /opt/my-app/
ls -la /opt/my-app/html/
```

👉 **Kết quả mong đợi:**
```text
devops@1037257112523315:~$ ls -la /opt/my-app/
total 16
drwxr-xr-x 4 devops www-data 4096 Oct  4 14:20 .
drwxr-xr-x 4 root   root     4096 Oct  4 14:18 ..
drwxr-xr-x 2 devops www-data 4096 Oct  4 14:20 html
drwxrwxr-x 2 devops www-data 4096 Oct  4 14:20 logs

devops@1037257112523315:~$ ls -la /opt/my-app/html/
total 12
drwxr-xr-x 2 devops www-data 4096 Oct  4 14:20 .
drwxr-xr-x 4 devops www-data 4096 Oct  4 14:20 ..
-rw-r--r-- 1 devops www-data 1450 Oct  4 14:20 index.html
```
*(Ghi chú: Thư mục `logs` có quyền `drwxrwxr-x` tương ứng với `775`, đảm bảo group `www-data` có quyền ghi `w`)*.

---

### 4.2. Kiểm tra quyền ghi của user `devops` không dùng `sudo`:
```bash
echo '<p style="color: #4ade80;">Updated directly by devops user without sudo</p>' >> /opt/my-app/html/index.html
tail -n 2 /opt/my-app/html/index.html
```
👉 **Kết quả:** Ghi file thành công không gặp lỗi `Permission denied`.

---

### 4.3. Kiểm tra cơ chế tự động ghi log của Nginx vào đường dẫn mới:
1. Gửi request HTTP:
```bash
curl -I http://localhost
```

2. Đọc file nhật ký vừa phát sinh:
```bash
cat /opt/my-app/logs/access.log
```

👉 **Kết quả mong đợi:**
```text
127.0.0.1 - - [04/Oct/2026:14:25:00 +0100] "HEAD / HTTP/1.1" 200 0 "-" "curl/8.5.0"
```
*(Dòng log đã tự động được Nginx ghi vào `/opt/my-app/logs/access.log` thành công!)*

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Lý do lựa chọn phân vùng `/opt/` trong kiến trúc Production:**
   - Thư mục `/opt/` (Optional software packages) theo chuẩn phân cấp hệ thống tập tin Linux (FHS - Filesystem Hierarchy Standard) là nơi lý tưởng để chứa các ứng dụng độc lập của bên thứ ba hoặc dự án tự phát triển. Nó giúp tách biệt hoàn toàn ứng dụng khỏi các gói cài đặt mặc định của hệ điều hành tại `/var/` và `/usr/`.
2. **Tầm quan trọng của quyền ghi (`w`) trên thư mục Logs:**
   - Nginx Master process chạy dưới quyền `root`, nhưng các Nginx Worker process (nơi thực sự xử lý request và ghi log) lại chạy dưới quyền `www-data`.
   - Nếu thư mục `/opt/my-app/logs/` chỉ có quyền `755` và thuộc về `devops`, Worker process của Nginx sẽ **không thể tạo hoặc ghi thêm nội dung vào file log**, dẫn đến lỗi im lặng hoặc Nginx báo lỗi `Permission denied` trong `syslog`. Việc thiết lập `chmod 775` giải quyết triệt để vấn đề này.
