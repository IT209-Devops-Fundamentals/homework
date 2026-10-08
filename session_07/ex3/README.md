# Bài 3: Thiết lập Cơ sở dữ liệu và Tự cấu hình dịch vụ Systemd cho Spring Boot

## 1. Thiết lập Cơ sở dữ liệu và User
- Trong MySQL, tạo database và user:
```sql
CREATE DATABASE springboot_db;
CREATE USER 'spring-admin'@'localhost' IDENTIFIED BY 'SpringSecure@123';
GRANT ALL PRIVILEGES ON springboot_db.* TO 'spring-admin'@'localhost';
FLUSH PRIVILEGES;
```

## 2. Tạo user hệ thống Linux `spring-runner`
```bash
sudo useradd -r -s /sbin/nologin spring-runner
```

## 3. Tệp dịch vụ `spring-app.service`
Tệp cấu hình được đặt tại `/etc/systemd/system/spring-app.service`.
Đã bao gồm cấu hình chạy ngầm ứng dụng dưới quyền user `spring-runner`, khởi động lại sau 10 giây nếu bị lỗi.

Kích hoạt và chạy dịch vụ:
```bash
sudo systemctl daemon-reload
sudo systemctl enable spring-app.service
sudo systemctl start spring-app.service
```

## 4. Kết quả kiểm tra

1. **Trạng thái dịch vụ:**
```bash
sudo systemctl status spring-app.service
```
*(Học viên chèn ảnh chụp màn hình trạng thái active (running) tại đây)*
![Service Status Screenshot](./service_status.png)

2. **Cổng lắng nghe của ứng dụng:**
```bash
ss -tlnp | grep 8082
```
*(Học viên chèn ảnh chụp màn hình port 8082 đang được lắng nghe bởi ứng dụng Java của spring-runner tại đây)*
![Listening Port Screenshot](./listening_port.png)
