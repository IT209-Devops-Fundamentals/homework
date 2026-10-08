# Bài 1: Quản lý người dùng giới hạn và Truyền tải dữ liệu qua SFTP trên Windows

## 1. Yêu cầu
Tạo tài khoản người dùng giới hạn phục vụ cho các tác vụ truyền nhận tệp tin từ xa, kết nối SFTP bằng phần mềm client trên Windows và tải tệp tin log từ máy chủ về.

## 2. Các bước thực hiện trên VPS

1. **Khởi tạo tài khoản người dùng:**
   ```bash
   sudo adduser sftp-user
   ```

2. **Tạo thư mục log giả lập và gán quyền đọc:**
   ```bash
   sudo mkdir -p /var/log/app-backup/
   sudo touch /var/log/app-backup/backup-check.log
   sudo bash -c 'echo "Backup status: SUCCESS at $(date)" > /var/log/app-backup/backup-check.log'
   sudo chown -R root:sftp-user /var/log/app-backup
   sudo chmod 750 /var/log/app-backup
   sudo chmod 640 /var/log/app-backup/backup-check.log
   ```

3. **Kiểm tra thông tin:**
   ```bash
   id sftp-user
   ls -l /var/log/app-backup/backup-check.log
   ```

## 3. Kết nối SFTP trên Windows (Sử dụng Bitvise SSH Client / WinSCP)
1. Mở phần mềm SFTP Client.
2. Điền IP của VPS vào ô Host.
3. Điền `sftp-user` vào ô Username.
4. Chọn Method là Password và nhập mật khẩu đã tạo.
5. Khi kết nối thành công, truy cập vào thư mục `/var/log/app-backup/` ở khung Remote files.
6. Kéo thả tệp `backup-check.log` sang thư mục máy tính ở khung Local files.

## 4. Báo cáo kết quả
*(Học viên chèn ảnh chụp màn hình giao diện kết nối SFTP từ Windows đã kết nối thành công và tải được file log về máy tính cá nhân tại đây)*

![SFTP Connection Success Screenshot](./screenshot_sftp.png)
