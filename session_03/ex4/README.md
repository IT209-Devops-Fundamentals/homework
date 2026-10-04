# Bài 4: Chạy Song Song Nhiều Cổng Dịch Vụ (Nginx Virtual Hosts)

---

## 1. Mục Tiêu Bài Thực Hành
- **Mô hình Virtual Hosting đa cổng (Multi-port Virtual Hosting):** Cấu hình Web Server Nginx để phục vụ song song nhiều website tĩnh độc lập trên cùng một địa chỉ IP máy chủ thông qua việc phân tách cổng dịch vụ mạng (Port `8080` và Port `8090`).
- **Phân tách không gian lưu trữ mã nguồn:**
  - Trang Beta App (Môi trường kiểm thử): Lưu trữ tại `/var/www/beta-app/html/`, lắng nghe trên cổng `8080`.
  - Trang Internal App (Hệ thống nội bộ): Lưu trữ tại `/var/www/internal-app/html/`, lắng nghe trên cổng `8090`.
- **Tích hợp bảo mật mạng:** Cấu hình mở cổng `8080/tcp` và `8090/tcp` trên tường lửa UFW để cho phép lưu lượng bên ngoài truy cập đúng định tuyến.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo mkdir -p /var/www/beta-app/html /var/www/internal-app/html` | Tạo cây thư mục chứa mã nguồn cho 2 trang web độc lập. |
| **2** | `sudo chown -R $USER:www-data /var/www/beta-app /var/www/internal-app` | Phân quyền sở hữu thư mục cho user `devops` và group `www-data`. |
| **3** | `sudo nano /etc/nginx/sites-available/multi-port.conf` | Tạo file cấu hình chứa 2 khối `server { ... }` lắng nghe cổng 8080 và 8090. |
| **4** | `sudo ln -sf /etc/nginx/sites-available/multi-port.conf /etc/nginx/sites-enabled/` | Kích hoạt cấu hình Virtual Host bằng Symbolic Link. |
| **5** | `sudo ufw allow 8080/tcp && sudo ufw allow 8090/tcp` | Mở 2 cổng dịch vụ trên tường lửa UFW. |
| **6** | `sudo nginx -t` | Kiểm tra tính hợp lệ của toàn bộ cú pháp cấu hình Nginx. |
| **7** | `sudo systemctl reload nginx` | Nạp lại cấu hình Nginx để bắt đầu lắng nghe trên 2 cổng mới. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Kết nối tới máy chủ qua cổng SSH 2222
Từ máy cá nhân (PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 -p 2222 devops@103.72.57.112
```

---

### Bước 2: Tạo thư mục mã nguồn và file `index.html` cho từng ứng dụng

1. **Khởi tạo thư mục và phân quyền:**
```bash
sudo mkdir -p /var/www/beta-app/html /var/www/internal-app/html
sudo chown -R $USER:www-data /var/www/beta-app /var/www/internal-app
sudo chmod -R 755 /var/www/beta-app /var/www/internal-app
```

2. **Tạo trang `index.html` cho Beta App (Cổng 8080):**
```bash
cat << 'EOF' > /var/www/beta-app/html/index.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Beta Application | Port 8080</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #09203f 0%, #537895 100%);
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            padding: 3rem 4rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
        p { color: #e2e8f0; font-size: 1.1rem; }
        .badge {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 0.4rem 1.2rem;
            border-radius: 9999px;
            font-weight: bold;
            margin-top: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Beta Application</h1>
        <p>Môi trường thử nghiệm tính năng mới (Testing Environment)</p>
        <div class="badge">Running on Port 8080</div>
    </div>
</body>
</html>
EOF
```

3. **Tạo trang `index.html` cho Internal App (Cổng 8090):**
```bash
cat << 'EOF' > /var/www/internal-app/html/index.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Internal Application | Port 8090</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(12px);
            padding: 3rem 4rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
        p { color: #f0fdf4; font-size: 1.1rem; }
        .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 0.4rem 1.2rem;
            border-radius: 9999px;
            font-weight: bold;
            margin-top: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Internal Application</h1>
        <p>Hệ thống thông tin nội bộ doanh nghiệp (Internal Systems)</p>
        <div class="badge">Running on Port 8090</div>
    </div>
</body>
</html>
EOF
```

---

### Bước 3: Cấu hình Server Block `multi-port.conf`
Tạo file cấu hình tại `/etc/nginx/sites-available/multi-port.conf`:

```bash
sudo tee /etc/nginx/sites-available/multi-port.conf << 'EOF'
# Virtual Host 1: Beta App (Cổng 8080)
server {
    listen 8080;
    listen [::]:8080;

    server_name _;

    root /var/www/beta-app/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}

# Virtual Host 2: Internal App (Cổng 8090)
server {
    listen 8090;
    listen [::]:8090;

    server_name _;

    root /var/www/internal-app/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

---

### Bước 4: Kích hoạt Server Block và Mở tường lửa UFW

```bash
# 1. Kích hoạt cấu hình
sudo ln -sf /etc/nginx/sites-available/multi-port.conf /etc/nginx/sites-enabled/

# 2. Mở cổng 8080 và 8090 trên UFW
sudo ufw allow 8080/tcp
sudo ufw allow 8090/tcp
sudo ufw status

# 3. Kiểm tra cú pháp Nginx
sudo nginx -t

# 4. Nạp lại cấu hình Nginx
sudo systemctl reload nginx
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Kiểm tra trạng thái lắng nghe cổng trên Server:
```bash
sudo ss -tulpn | grep -E '8080|8090'
```
👉 Kết quả hiển thị cả 2 cổng đều ở trạng thái `LISTEN`:
```text
tcp   LISTEN 0      511          0.0.0.0:8080      0.0.0.0:*    users:(("nginx",pid=...,fd=...))
tcp   LISTEN 0      511          0.0.0.0:8090      0.0.0.0:*    users:(("nginx",pid=...,fd=...))
```

---

### 4.2. Kiểm tra truy cập qua curl:

1. **Truy cập cổng 8080 (Beta App):**
```bash
curl http://localhost:8080 | grep "Beta Application"
```
👉 Kết quả: `<h1>Beta Application</h1>`

2. **Truy cập cổng 8090 (Internal App):**
```bash
curl http://localhost:8090 | grep "Internal Application"
```
👉 Kết quả: `<h1>Internal Application</h1>`

---

### 4.3. Kiểm tra trực tiếp trên Trình duyệt Web (Browser)
- **Truy cập Beta App:** `http://103.72.57.112:8080` ➔ Hiển thị giao diện màu xanh dương với huy hiệu *Running on Port 8080*.
- **Truy cập Internal App:** `http://103.72.57.112:8090` ➔ Hiển thị giao diện màu xanh lá với huy hiệu *Running on Port 8090*.

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Khái niệm Virtual Hosting dựa trên Cổng (Port-based Virtual Hosting):**
   - Nginx cho phép định tuyến các yêu cầu HTTP đến các thư mục gốc (Web Root) khác nhau dựa trên cổng TCP mà client kết nối đến.
   - Đây là giải pháp cực kỳ phổ biến trong môi trường kiểm thử (Staging / Testing / Demo) khi doanh nghiệp chưa kịp cấu hình tên miền (Domain Name) riêng cho từng dịch vụ.
2. **Quản lý tường lửa trong môi trường nhiều cổng:**
   - Mỗi khi mở một cổng dịch vụ mới trên Nginx, kỹ sư DevOps luôn phải đồng bộ mở cổng trên Tường lửa (UFW và Cloud Security Groups). Nếu quên mở cổng, gói tin từ Internet sẽ bị chặn trước khi đến được Web Server.
