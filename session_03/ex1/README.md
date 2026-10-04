# Bài 1: Thay Đổi Cổng Kết Nối SSH (SSH Port Hardening)

---

## 1. Mục Tiêu Bài Thực Hành
- **Tăng cường bảo mật (Security Hardening):** Thay đổi cổng dịch vụ SSH mặc định từ `22` sang cổng `2222` nhằm tránh các cuộc tấn công rà quét tự động (Automated Port Scans) và brute-force từ botnet trên mạng Internet.
- **Phòng chống khóa ngoài (Anti-Lockout SOP):** Áp dụng quy tắc an toàn trong vận hành hệ thống — Cấu hình tường lửa UFW mở cổng mới `2222/tcp` **TRƯỚC KHI** khởi động lại dịch vụ SSH daemon.
- **Tuân thủ phân quyền (Least Privilege):** Thực hiện toàn bộ quy trình bằng tài khoản thường `devops` có quyền `sudo`, không đăng nhập trực tiếp bằng `root`.
- **Kiểm chứng đa chiều (Multi-angle Verification):**
  - Cổng mới `2222`: Kết nối thành công qua SSH Key.
  - Cổng cũ `22`: Bị chặn hoàn toàn (Connection refused / Timeout).

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo ufw allow 2222/tcp` | **[QUAN TRỌNG NHẤT]** Mở cổng 2222 trên tường lửa UFW trước để chống bị mất kết nối (Lockout). |
| **2** | `sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak` | Sao lưu file cấu hình gốc trước khi chỉnh sửa (Rollback strategy). |
| **3** | `sudo sed -i 's/^#*Port 22/Port 2222/' /etc/ssh/sshd_config` | Thay đổi chỉ thị `Port` từ 22 sang 2222 trong file cấu hình SSH Daemon. |
| **4** | `sudo sshd -t` | Kiểm tra tính hợp lệ của cú pháp cấu hình SSH trước khi khởi động lại dịch vụ. |
| **5** | `sudo systemctl restart ssh` | Khởi động lại dịch vụ SSH để nạp cổng mới 2222. |
| **6** | `sudo ufw delete allow 22/tcp` | Đóng cổng 22 cũ trên tường lửa sau khi đã kiểm tra cổng 2222 hoạt động ổn định. |
| **7** | `sudo ufw status verbose` | Kiểm tra lại danh sách các cổng được phép trên UFW. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Đăng nhập vào máy chủ bằng tài khoản `devops`
Từ máy cá nhân (PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 devops@103.72.57.112
```

---

### Bước 2: Mở cổng 2222 trên tường lửa UFW trước
> ⚠️ **Quy tắc an toàn sống còn:** Luôn mở cổng trên UFW trước khi đổi cổng dịch vụ.
```bash
sudo ufw allow 2222/tcp
sudo ufw status
```

---

### Bước 3: Cấu hình cổng 2222 cho SSH Daemon
1. Sao lưu cấu hình hiện tại:
   ```bash
   sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
   ```

2. Chỉnh sửa cấu hình cổng SSH:
   Mở file:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   Tìm dòng `#Port 22` hoặc `Port 22` và sửa thành:
   ```text
   Port 2222
   ```
   *(Nhấn `Ctrl + O` ➔ `Enter` để lưu, `Ctrl + X` để thoát).*

3. Kiểm tra cú pháp cấu hình SSH:
   ```bash
   sudo sshd -t
   ```
   *(Nếu không xuất hiện thông báo lỗi nào là cấu hình chính xác 100%)*.

---

### Bước 4: Khởi động lại dịch vụ SSH
```bash
sudo systemctl restart ssh
```
> *(Trên Ubuntu 24.04 LTS có thể kích hoạt socket activation: Nếu cần, chạy thêm `sudo systemctl daemon-reload && sudo systemctl restart ssh.socket ssh.service`)*.

Kiểm tra xem SSH đã lắng nghe trên cổng 2222 chưa:
```bash
sudo ss -tulpn | grep 2222
```

> ⚠️ **LƯU Ý CỰC KỲ QUAN TRỌNG:**
> **KHÔNG ĐƯỢC ĐÓNG CỬA SỔ TERMINAL HIỆN TẠI!** 
> Giữ nguyên cửa sổ này để đề phòng sự cố. Mở một cửa sổ Terminal/PowerShell **MỚI** trên máy tính cá nhân để thực hiện Bước 5.

---

### Bước 5: Kiểm tra kết nối từ máy tính cá nhân

Mở một cửa sổ **PowerShell mới** trên máy cá nhân:

1. **Kiểm tra kết nối qua cổng mới 2222 (Phải thành công):**
   ```powershell
   ssh -i $HOME\.ssh\id_ed25519 -p 2222 devops@103.72.57.112
   ```
   👉 Kết quả: Đăng nhập thành công vào máy chủ qua cổng 2222.

2. **Đóng cổng 22 cũ trên máy chủ (Dọn dẹp bảo mật):**
   Sau khi cổng 2222 đã chạy ổn định, tại terminal máy chủ chạy:
   ```bash
   sudo ufw delete allow 22/tcp
   sudo ufw status verbose
   ```

3. **Kiểm tra cổng 22 cũ (Phải bị chặn hoàn toàn):**
   Từ PowerShell máy cá nhân, chạy:
   ```powershell
   ssh -i $HOME\.ssh\id_ed25519 -p 22 devops@103.72.57.112
   ```
   👉 Kết quả mong đợi: `ssh: connect to host 103.72.57.112 port 22: Connection refused` hoặc `Connection timed out`.

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Trạng thái lắng nghe cổng trên máy chủ:

```text
devops@1037257112523315:~$ sudo ss -tulpn | grep ssh
tcp   LISTEN 0      128          0.0.0.0:2222      0.0.0.0:*    users:(("sshd",pid=1234,fd=3))
tcp   LISTEN 0      128             [::]:2222         [::]:*    users:(("sshd",pid=1234,fd=4))
```

---

### 4.2. Log kết nối thành công qua cổng 2222 (Terminal PowerShell máy cá nhân):

```text
PS C:\Users\GIA HUY> ssh -i $HOME\.ssh\id_ed25519 -p 2222 devops@103.72.57.112
Welcome to Ubuntu 24.04.5 LTS (GNU/Linux 6.8.0-31-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sun Oct  4 08:00:44 AM BST 2026

  System load:  0.0                Processes:               224
  Usage of /:   19.8% of 32.61GB   Users logged in:         1
  Memory usage: 15%                IPv4 address for ens192: 103.72.57.112
  Swap usage:   0%

 * Canonical Workshop gives developers fast, composable, reproducible, and
   secure developer environments that are perfect for agentic workflows.

   https://ubuntu.com/workshop

Expanded Security Maintenance for Applications is not enabled.

8 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

New release '26.04.1 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


*** System restart required ***
Last login: Sun Oct  4 08:00:45 2026 from 118.69.116.50
devops@1037257112523315:~$ exit
logout
Connection to 103.72.57.112 closed.
```

---

### 4.3. Log kiểm tra cổng 22 cũ bị chặn:

```text
PS C:\Users\GIA HUY> ssh -i $HOME\.ssh\id_ed25519 -p 22 devops@103.72.57.112
ssh: connect to host 103.72.57.112 port 22: Connection refused
PS C:\Users\GIA HUY>
```

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Chiến lược "Security through Obscurity" (Bảo mật qua tính mơ hồ):**
   - Đổi cổng SSH không giải quyết triệt để các lỗ hổng phần mềm của OpenSSH, nhưng nó loại bỏ đến **99% các đợt tấn công dò quét tự động (Brute-force script bots)** quét hàng loạt cổng 22 trên toàn mạng Internet.
2. **Quy tắc vàng chống Lockout:**
   - Khi thay đổi cấu hình kết nối từ xa, luôn giữ lại ít nhất một phiên kết nối còn sống (Active Session) và mở cổng tường lửa trước khi khởi động lại dịch vụ.
3. **Quản lý cấu hình an toàn:**
   - Việc tạo bản sao lưu `.bak` trước khi chỉnh sửa `/etc/ssh/sshd_config` và chạy `sshd -t` kiểm tra cú pháp là thói quen bắt buộc của kỹ sư DevOps chuyên nghiệp.
