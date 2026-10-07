# Bài 3: Cấu hình tường lửa UFW và chuẩn đoán cổng mạng

## Yêu cầu bài toán
Cấu hình tường lửa UFW (Uncomplicated Firewall) trên máy chủ Cloud VPS để bảo vệ máy chủ và chuẩn bị môi trường triển khai ứng dụng web an toàn.
- Thiết lập chính sách mặc định: chặn toàn bộ kết nối đi vào (deny incoming), cho phép kết nối đi ra (allow outgoing).
- Mở cổng kết nối SSH (port 22) để không bị mất kết nối quản trị.
- Mở cổng kết nối ứng dụng Web (port 8080/tcp).
- Kích hoạt tường lửa và kiểm tra trạng thái hoạt động.

## Nhật ký các lệnh đã thực hiện

1. **Thiết lập chính sách mặc định của UFW:**
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

2. **Thêm quy tắc cho phép lưu lượng vào cổng SSH và Web:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 8080/tcp
```

3. **Kích hoạt tường lửa:**
```bash
sudo ufw enable
```
*(Hệ thống sẽ hiển thị cảnh báo: `Command may disrupt existing ssh connections. Proceed with operation (y|n)?`. Nhấn phím `y` và `Enter` để xác nhận bật tường lửa).*

## Kết quả kiểm tra

1. **Xem trạng thái chi tiết của tường lửa:**
```bash
sudo ufw status verbose
```

**Kết quả hiển thị mong đợi (mô phỏng trên máy chủ Linux):**
```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
8080/tcp                   ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
8080/tcp (v6)              ALLOW IN    Anywhere (v6)
```
*(Đầu ra xác nhận tường lửa đang `active` và các cổng 22, 8080 được cho phép truy cập từ mọi nguồn).*

2. **Kiểm tra các cổng đang lắng nghe thực tế (Socket Statistics):**
```bash
ss -tlnp
```

**Kết quả hiển thị mong đợi (mô phỏng cho dịch vụ ssh và web server):**
```text
State       Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN      0      128          0.0.0.0:22         0.0.0.0:*     users:(("sshd",pid=1021,fd=3))
LISTEN      0      511          0.0.0.0:8080       0.0.0.0:*     users:(("node",pid=2504,fd=18))
LISTEN      0      128             [::]:22            [::]:*     users:(("sshd",pid=1021,fd=4))
```
