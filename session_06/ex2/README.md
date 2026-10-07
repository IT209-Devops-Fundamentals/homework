# Bài 2: Cấu hình phân quyền Nhóm và sudoers bằng visudo

## Yêu cầu bài toán
- Tạo nhóm người dùng mới tên là `devops-admin`. *(Lưu ý: trong yêu cầu có lỗi đánh máy `devops-admin.p`, nên sẽ sử dụng tên chuẩn `devops-admin`)*.
- Tạo tài khoản người dùng mới tên là `deployer` và đưa tài khoản này vào nhóm `devops-admin`.
- Cấu hình tệp `/etc/sudoers` để các thành viên nhóm `devops-admin` có thể sử dụng các lệnh quản lý dịch vụ `systemctl` (start, stop, restart, status) mà không yêu cầu nhập mật khẩu (NOPASSWD).

## Nhật ký các lệnh đã thực hiện

1. **Tạo nhóm và người dùng mới:**
```bash
sudo groupadd devops-admin
sudo adduser deployer
sudo usermod -aG devops-admin deployer
```

2. **Mở file cấu hình sudoers để chỉnh sửa an toàn:**
```bash
sudo visudo
```

3. **Quy tắc phân quyền được thêm vào cuối file `/etc/sudoers`:**
```text
%devops-admin ALL=(ALL) NOPASSWD: /usr/bin/systemctl start *, /usr/bin/systemctl stop *, /usr/bin/systemctl restart *, /usr/bin/systemctl status *
```

## Kết quả kiểm tra

1. **Chuyển sang tài khoản `deployer`:**
```bash
su - deployer
```

2. **Kiểm tra quyền đặc quyền được phép thực thi của tài khoản:**
```bash
sudo -l
```

**Kết quả hiển thị mong đợi (mô phỏng trên máy chủ Linux):**
```text
Matching Defaults entries for deployer on ubuntu-server:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User deployer may run the following commands on ubuntu-server:
    (ALL) NOPASSWD: /usr/bin/systemctl start *, /usr/bin/systemctl stop *, /usr/bin/systemctl restart *, /usr/bin/systemctl status *
```

3. **Chạy thử lệnh khởi động lại dịch vụ `cron`:**
```bash
sudo systemctl restart cron
```
*(Lệnh được thực thi thành công ngay lập tức và trả về dòng nhắc lệnh mới, không hề yêu cầu tài khoản phải nhập mật khẩu để xác thực).*
