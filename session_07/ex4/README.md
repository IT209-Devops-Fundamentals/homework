# Bài 4: Cấu hình Reverse Proxy Nginx cho ứng dụng Spring Boot

## 1. Yêu cầu
Cấu hình máy chủ ảo Nginx làm Reverse Proxy, đường dẫn `/` phục vụ tệp tĩnh, đường dẫn `/api/` chuyển tiếp đến backend Spring Boot cổng 8082.

## 2. Các bước thực hiện
1. **Tạo trang web tĩnh:**
```bash
sudo mkdir -p /var/www/html/
sudo bash -c 'echo "<h1>Nguyen Van A - Ma lop: J01</h1>" > /var/www/html/index.html'
```

2. **Tạo tệp cấu hình Nginx:** 
Tạo tệp `/etc/nginx/sites-available/spring-proxy.conf` với nội dung đã được đính kèm trong thư mục này.

3. **Kích hoạt cấu hình:**
```bash
sudo ln -s /etc/nginx/sites-available/spring-proxy.conf /etc/nginx/sites-enabled/
```

4. **Kiểm tra cú pháp Nginx và khởi động lại:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 3. Báo cáo kết quả

1. **Kiểm tra cấu hình Nginx (`sudo nginx -t`):**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

2. **Kết quả truy cập trang web (lệnh curl):**

Truy cập đường dẫn tĩnh `/`:
```bash
curl -I http://localhost/
```
**Kết quả:**
```
HTTP/1.1 200 OK
Server: nginx/...
Content-Type: text/html
...
```

Truy cập đường dẫn API `/api/health`:
```bash
curl -I http://localhost/api/health
```
**Kết quả:**
```
HTTP/1.1 200 OK
Server: nginx/...
...
```
