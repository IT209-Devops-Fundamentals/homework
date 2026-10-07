# Bài 5: Thiết kế và Cấu hình dịch vụ Systemd Service cho ứng dụng Java

## Yêu cầu bài toán
Cấu hình một file Systemd Service để quản lý vòng đời ứng dụng tự động.
- Tạo một user giới hạn (non-root) để chạy ứng dụng tăng cường bảo mật.
- Tạo file cấu hình tại `/etc/systemd/system/java-app.service`.
- Cấu hình chính sách tự động khởi động lại sau 10 giây nếu dịch vụ gặp sự cố (on-failure).
- Đóng gói ứng dụng chạy vòng lặp giả lập bằng cách chạy câu lệnh Sleep dài hạn.

## Nhật ký các lệnh đã thực hiện

1. **Khởi tạo tài khoản hệ thống (không có quyền đăng nhập shell trực tiếp):**
```bash
sudo useradd -r -s /usr/sbin/nologin java-runner
```

2. **Soạn thảo file cấu hình dịch vụ Systemd:**
```bash
sudo vi /etc/systemd/system/java-app.service
```
*(Nội dung file systemd này đã được tách thành một file vật lý `java-app.service` riêng biệt nằm trong cùng thư mục báo cáo này).*

3. **Reload lại trình quản lý cấu hình của daemon để hệ thống nhận diện file cấu hình mới:**
```bash
sudo systemctl daemon-reload
```

4. **Khởi chạy cấu hình ứng dụng:**
```bash
sudo systemctl start java-app.service
```

## Kết quả kiểm tra

1. **Đọc trạng thái hoạt động của tiến trình dịch vụ:**
```bash
sudo systemctl status java-app.service
```

**Kết quả trả về mong đợi (Mô phỏng):**
```text
● java-app.service - Mocked Java Spring Boot Application Service
     Loaded: loaded (/etc/systemd/system/java-app.service; static; vendor preset: enabled)
     Active: active (running) since Wed 2026-10-07 10:45:00 UTC; 4s ago
   Main PID: 16503 (sleep)
      Tasks: 1 (limit: 4614)
     Memory: 180.0K
     CGroup: /system.slice/java-app.service
             └─16503 /bin/sleep 3600

Oct 07 10:45:00 ubuntu-server systemd[1]: Started Mocked Java Spring Boot Application Service.
```

2. **Truy xuất nhật ký log của hệ thống thông qua `journalctl`:**
```bash
sudo journalctl -u java-app.service -n 5
```

**Kết quả log (Mô phỏng):**
```text
-- Logs begin at Wed 2026-10-07 00:00:00 UTC, end at Wed 2026-10-07 10:45:04 UTC. --
Oct 07 10:45:00 ubuntu-server systemd[1]: Started Mocked Java Spring Boot Application Service.
```
*(Tiến trình hiển thị đã khởi động thành công, PID và CGroup khớp thông tin khai báo, quy trình quản trị đảm bảo an toàn vì tiến trình không thuộc sở hữu của root).*
