# Bài 3: Viết Dockerfile 3 dòng đóng gói trang Web HTML tĩnh

## Mục tiêu
- Viết tệp `Dockerfile` tinh gọn đóng gói trang web HTML tĩnh.
- Tự build Docker Image và khởi chạy container kiểm tra sản phẩm.

---

## 1. Cấu trúc Dự án

```text
ss9/b3/
├── Dockerfile
├── index.html
└── README.md
```

### Nội dung `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Docker Session 09</title>
</head>
<body>
    <h1>Hello Docker Session 09!</h1>
</body>
</html>
```

### Nội dung `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

---

## 2. Các Bước Thực thi & Kiểm tra

### Bước 1: Build Docker Image
```bash
docker build -t my-html-app:v1 .
```

### Bước 2: Khởi chạy Container từ Image vừa build trên cổng 8081
```bash
docker run -d -p 8081:80 --name html-container my-html-app:v1
```

### Bước 3: Kiểm tra phản hồi HTTP
```bash
$ curl http://localhost:8081
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello Docker Session 09</title>
</head>
<body>
    <h1>Hello Docker Session 09!</h1>
</body>
</html>
```

---

## 3. Dọn dẹp
```bash
docker rm -f html-container
```
