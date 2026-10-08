# Bài 5: Báo cáo chẩn đoán và xử lý xung đột cổng mạng (Address Already in Use)

## 1. Chẩn đoán vấn đề

Khi ứng dụng Spring Boot báo lỗi không thể khởi động do cổng 8082 bị chiếm dụng, tôi đã thực hiện lệnh sau để kiểm tra:

```bash
sudo ss -tlnp | grep 8082
```
Hoặc dùng lsof:
```bash
sudo lsof -i :8082
```

**Kết quả nhận được (ví dụ):**
```
LISTEN    0         50                 0.0.0.0:8082             0.0.0.0:*        users:(("python3",pid=12345,fd=3))
```

Từ kết quả trên, tôi xác định được PID của tiến trình đang chiếm cổng là `12345` (tên tiến trình là python3).

## 2. Giải phóng cổng 8082

Để giải phóng cổng bị chiếm giữ, tôi đã thực hiện lệnh kill để kết thúc tiến trình này:

```bash
sudo kill 12345
```

Trong trường hợp tiến trình không kết thúc, tôi sử dụng SIGKILL:
```bash
sudo kill -9 12345
```

## 3. Xác nhận và Khởi động lại dịch vụ

Sau khi kill tiến trình, tôi khởi động lại dịch vụ Spring Boot:
```bash
sudo systemctl restart spring-app.service
```

Sau đó kiểm tra lại cổng mạng 8082:
```bash
sudo ss -tlnp | grep 8082
```

**Kết quả:**
```
LISTEN    0         100                     *:8082                   *:*         users:(("java",pid=12388,fd=14))
```
Cổng 8082 hiện tại đã được giải phóng và đang được lắng nghe bởi tiến trình `java` (PID: 12388) của ứng dụng Spring Boot, ứng dụng đã hoạt động bình thường.
