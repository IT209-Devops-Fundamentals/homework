# Báo Cáo Bài Tập 5: Khởi Chạy Dịch Vụ Đơn Giản Với Docker Compose

- **Môn học**: DevOps Fundamentals (IT-209)
- **Session**: 09 - Docker Fundamentals & Containerization
- **Bài tập**: Bài 5 - Khởi chạy dịch vụ đơn giản với Docker Compose
- **Đường dẫn nộp bài trên GitHub**: `homework/session_09/ex5/`
- **Học viên**: HoQuocKhai
- **Email**: khaiho6040@gmail.com

---

## 1. Mục tiêu bài thực hành
1. **Làm quen với Docker Compose CLI v2**: Sử dụng cú pháp dòng lệnh mới `docker compose` (plugin tích hợp sẵn trong Docker CLI) thay cho công cụ cũ `docker-compose` v1.
2. **Khai báo dịch vụ dạng mã (Infrastructure as Code - Declarative)**: Định nghĩa cấu hình container (image, port mapping, tên service) tập trung trong tệp `docker-compose.yml`, giảm thiểu việc phải ghi nhớ các lệnh CLI dài dòng.
3. **Quản lý vòng đời dịch vụ bằng 1 lệnh duy nhất**: Khởi động toàn bộ stack bằng `docker compose up -d` và dọn dẹp sạch sẽ toàn bộ tài nguyên (container, network mặc định) bằng `docker compose down`.

---

## 2. Cấu trúc thư mục bài làm
```text
homework/session_09/ex5/
├── docker-compose.yml
└── README.md
```

---

## 3. Nội dung tệp cấu hình `docker-compose.yml`
```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8082:80"
```

> **Giải thích cấu hình:**
> - `services`: Khối định nghĩa các dịch vụ (containers) trong ứng dụng.
> - `web`: Tên định danh của service.
> - `image: nginx:alpine`: Docker image được sử dụng để tạo container (Nginx chạy trên Alpine Linux).
> - `ports`: Danh sách ánh xạ cổng từ Host vào Container. Cổng `8082` trên máy chủ ánh xạ vào cổng `80` của Nginx bên trong container (`"8082:80"`).

---

## 4. Các bước thực hiện & Kết quả đầu ra

### Bước 1: Khởi chạy dịch vụ ở chế độ chạy ngầm
Thực thi lệnh khởi tạo stack tại thư mục chứa file `docker-compose.yml`:
```bash
docker compose up -d
```

**Kết quả đầu ra mẫu:**
```text
[+] Running 2/2
 ✔ Network 5_default  Created                                              0.1s 
 ✔ Container 5-web-1  Started                                              0.4s 
```

---

### Bước 2: Kiểm tra trạng thái dịch vụ (docker compose ps)
Xác nhận trạng thái hoạt động của các container do Compose quản lý:
```bash
docker compose ps
```

**Kết quả đầu ra:**
```text
NAME      IMAGE          COMMAND                  SERVICE   CREATED          STATUS          PORTS
5-web-1   nginx:alpine   "/docker-entrypoint.…"   web       10 seconds ago   Up 10 seconds   0.0.0.0:8082->80/tcp
```
> **Đánh giá**: Service `web` đang ở trạng thái `Up`, lắng nghe trên cổng `8082` và chuyển tiếp đến cổng `80/tcp` của container.

---

### Bước 3: Kiểm tra phản hồi Web Server qua lệnh `curl`
Gửi HTTP request tới cổng `8082` của máy Host:
```bash
curl http://localhost:8082
```

**Kết quả đầu ra (Trang chào mừng mặc định của Nginx):**
```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

---

### Bước 4: Hạ dịch vụ và dọn dẹp tài nguyên
Dừng container, gỡ bỏ container và mạng ảo mặc định được tạo bởi Compose:
```bash
docker compose down
```

**Kết quả đầu ra:**
```text
[+] Running 2/2
 ✔ Container 5-web-1  Removed                                              0.3s 
 ✔ Network 5_default  Removed                                              0.1s 
```

Kiểm tra lại trạng thái sau khi hạ dịch vụ:
```bash
docker compose ps
```

**Kết quả đầu ra:**
```text
NAME      IMAGE     COMMAND   SERVICE   CREATED   STATUS    PORTS
```
*(Toàn bộ dịch vụ và network đã được dọn dẹp sạch sẽ).*
