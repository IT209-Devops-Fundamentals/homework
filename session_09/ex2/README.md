# Báo Cáo Bài Tập 2: Khởi Chạy Web Server Nginx Với Port Mapping

- **Môn học**: DevOps Fundamentals (IT-209)
- **Session**: 09 - Docker Fundamentals & Containerization
- **Bài tập**: Bài 2 - Khởi chạy Web Server Nginx với Port Mapping
- **Đường dẫn nộp bài trên GitHub**: `homework/session_09/ex2/`
- **Học viên**: HoQuocKhai
- **Email**: khaiho6040@gmail.com

---

## 1. Mục tiêu bài thực hành
1. **Khởi chạy container ở chế độ nền (Detached mode - `-d`)**: Giúp container chạy ngầm trong hệ thống mà không chiếm dụng Terminal.
2. **Cấu hình ánh xạ cổng (Port Mapping - `-p`)**: Chuyển tiếp lưu lượng truy cập từ cổng `8080` trên máy Host (máy cá nhân) vào cổng `80` (cổng mặc định của web server Nginx) bên trong container.
3. **Quản lý vòng đời container**: Đặt tên định danh container với cờ `--name`, kiểm tra trạng thái hoạt động với `docker ps`, và thực hiện dọn dẹp tài nguyên (`docker stop`, `docker rm`) sau khi hoàn thành.

---

## 2. Giải thích các tham số dòng lệnh Docker
Cú pháp khởi chạy:
```bash
docker run -d -p 8080:80 --name my-web nginx:alpine
```

| Tham số / Cờ | Ý nghĩa chi tiết |
| :--- | :--- |
| `docker run` | Tạo mới và khởi chạy một container từ image chỉ định. |
| `-d` (Detached) | Chạy container ở chế độ background, giải phóng Terminal ngay lập tức. |
| `-p 8080:80` | Port Mapping: `<Host Port>:<Container Port>`. Cho phép truy cập container qua địa chỉ `http://localhost:8080`. |
| `--name my-web` | Đặt tên container là `my-web` để dễ dàng quản lý thay vì dùng ID hay tên ngẫu nhiên. |
| `nginx:alpine` | Sử dụng image Nginx nền Alpine Linux siêu nhẹ (~40MB) giúp tải nhanh và tiết kiệm tài nguyên. |

---

## 3. Các bước thực hiện & Kết quả đầu ra (Terminal Outputs)

### Bước 1: Khởi chạy container Nginx
Thực thi lệnh tải image và chạy container ở chế độ nền:
```bash
docker run -d -p 8080:80 --name my-web nginx:alpine
```

**Kết quả đầu ra:**
```text
Unable to find image 'nginx:alpine' locally
alpine: Pulling from library/nginx
43c4264eed91: Pull complete 
05beea78a483: Pull complete 
da56bfb9d038: Pull complete 
c09265f02f90: Pull complete 
7536fcab5dc5: Pull complete 
05e04cb2411e: Pull complete 
54909ae72cd1: Pull complete 
Digest: sha256:2b243b715615d86efec213ec2319ef2a5c1a794931a774db8111956e100fca9b
Status: Downloaded newer image for nginx:alpine
7a1b3c94df28e819b7a421f6a19f2d128d50f83691c28c89a05b10e395e28a41
```

---

### Bước 2: Kiểm tra danh sách container đang chạy
Sử dụng lệnh `docker ps` để xác nhận container đã khởi tạo thành công và đang lắng nghe trên cổng:
```bash
docker ps
```

**Kết quả đầu ra:**
```text
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES
7a1b3c94df28   nginx:alpine   "/docker-entrypoint.…"   8 seconds ago   Up 7 seconds   0.0.0.0:8080->80/tcp   my-web
```

---

### Bước 3: Kiểm tra trang web bằng lệnh `curl`
Gửi truy vấn HTTP GET tới cổng `8080` trên máy Host:
```bash
curl http://localhost:8080
```

**Kết quả đầu ra (Trả về trang chủ mặc định của Nginx):**
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

> **Ghi chú**: Kết quả trả về chứa thẻ `<h1>Welcome to nginx!</h1>`, chứng minh Web Server Nginx đã nhận và xử lý thành công yêu cầu từ cổng máy Host.

---

### Bước 4: Dọn dẹp tài nguyên (Stop & Remove Container)
Dừng container đang chạy và xóa bỏ container khỏi hệ thống:
```bash
docker stop my-web && docker rm my-web
```

**Kết quả đầu ra:**
```text
my-web
my-web
```

Kiểm tra lại danh sách container để đảm bảo container đã được dọn sạch hoàn toàn:
```bash
docker ps -a --filter "name=my-web"
```

**Kết quả đầu ra:**
```text
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```
*(Không còn container nào tồn tại)*
