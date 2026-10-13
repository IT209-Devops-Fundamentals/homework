# Bài 2: Đóng gói ứng dụng Web Backend bằng Single-stage Dockerfile

## 1. Giới thiệu
Dự án này thực hiện đóng gói ứng dụng REST API Web Backend (Node.js/Express) thành Docker Image bằng kỹ thuật **Single-stage Dockerfile** nhằm phục vụ triển khai lên môi trường chạy thử nghiệm.

## 2. Cấu trúc thư mục
```text
homework/session_10/ex2/
├── .dockerignore
├── Dockerfile
├── package.json
├── server.js
└── README.md
```

## 3. Nội dung Dockerfile và giải thích các chỉ thị
Dockerfile được xây dựng với đầy đủ các chỉ thị theo tiêu chuẩn:

```dockerfile
# Base Image sử dụng Node.js v18 trên nền tảng Alpine Linux nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file định nghĩa package để tối ưu bộ nhớ đệm (Docker layer caching)
COPY package*.json ./

# Cài đặt các thư viện phụ thuộc (dependencies)
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Thiết lập biến môi trường PORT mặc định là 3000
ENV PORT=3000

# Khai báo port lắng nghe của container
EXPOSE 3000

# Lệnh khởi chạy ứng dụng (exec form)
CMD ["node", "server.js"]
```

### Chi tiết các chỉ thị:
- **`FROM node:18-alpine`**: Sử dụng base image chính thức của Node.js phiên bản 18 xây dựng trên nền tảng Alpine Linux có dung lượng nhỏ gọn, tối ưu tài nguyên.
- **`WORKDIR /app`**: Đặt thư mục `/app` làm thư mục làm việc mặc định cho tất cả các chỉ thị tiếp theo (`COPY`, `RUN`, `CMD`).
- **`COPY package*.json ./`**: Tận dụng cơ chế Docker Layer Caching bằng cách copy file dependencies trước. Nếu mã nguồn thay đổi nhưng `package.json` không đổi, Docker sẽ tái sử dụng layer cache của bước cài đặt.
- **`RUN npm install`**: Thực thi lệnh cài đặt các thư viện phụ thuộc (Express framework) được định nghĩa trong `package.json`.
- **`COPY . .`**: Sao chép toàn bộ file mã nguồn còn lại vào container (ngoại trừ các file trong `.dockerignore`).
- **`ENV PORT=3000`**: Định nghĩa biến môi trường `PORT=3000` bên trong container.
- **`EXPOSE 3000`**: Khai báo rằng container sẽ lắng nghe tại cổng `3000` trong runtime (tài liệu hóa port ứng dụng).
- **`CMD ["node", "server.js"]`**: Định dạng Exec form để khởi chạy ứng dụng khi container bắt đầu chạy.

---

## 4. Hướng dẫn Build và Kiểm tra

### Bước 1: Điều hướng vào thư mục bài tập
```bash
cd homework/session_10/ex2
```

### Bước 2: Build Docker Image
Xây dựng Docker image với tên `hw-backend:v1`:
```bash
docker build -t hw-backend:v1 .
```

### Bước 3: Khởi chạy container
Chạy container ở chế độ detached (`-d`), đặt tên container là `app-single-stage`, ánh xạ port từ máy chủ `8080` sang port `3000` của container:
```bash
docker run -d --name app-single-stage -p 8080:3000 hw-backend:v1
```

### Bước 4: Kiểm tra trạng thái container
Kiểm tra danh sách container đang chạy:
```bash
docker ps
```
> Trạng thái (STATUS) phải hiển thị là `Up ...`.

### Bước 5: Xem log của ứng dụng
```bash
docker logs app-single-stage
```
> Kết quả hiển thị: `Server listening on port 3000`.

### Bước 6: Kiểm tra phản hồi API với `curl`
```bash
curl -i http://localhost:8080/
```

### Kết quả mong đợi:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 64
ETag: W/"40-..."
Date: ...
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"success","message":"Hello from Docker Single-stage!"}
```

---

## 5. Dọn dẹp tài nguyên (khi cần)
Dừng và xóa container sau khi hoàn tất kiểm tra:
```bash
docker stop app-single-stage
docker rm app-single-stage
```
Xóa image (tùy chọn):
```bash
docker rmi hw-backend:v1
```
