# Bài 1: Khởi Tạo Droplet Trên DigitalOcean
---

## 1. Mục Tiêu Bài Thực Hành
- Thực hành đăng ký tài khoản, lựa chọn cấu hình phần cứng phù hợp và khởi tạo thành công Droplet chạy hệ điều hành Ubuntu Server trên hạ tầng đám mây DigitalOcean.
- Cấu hình xác thực an toàn bằng cặp khóa SSH (SSH Keypair) thay vì mật khẩu thô và thực hiện kết nối thành công từ máy cá nhân.

---

## 2. Thông Số Cấu Hình Droplet Lựa Chọn

| Mục cấu hình | Giá trị lựa chọn | Giải thích / Lý do |
| :--- | :--- | :--- |
| **Datacenter Region** | **Singapore (SGP1)** | Trung tâm dữ liệu gần Việt Nam nhất, tối ưu độ trễ mạng (Ping thấp ~30-40ms). |
| **Choose an Image (OS)** | **Ubuntu 22.04 (LTS) x64** | Hệ điều hành mã nguồn mở ổn định, hỗ trợ dài hạn, chuẩn công nghiệp cho DevOps. |
| **Droplet Type** | **Basic (Shared CPU)** | Lựa chọn tối giản, tiết kiệm chi phí thử nghiệm theo đúng yêu cầu đề bài. |
| **CPU Options** | **Regular SSD ($4/tháng hoặc $6/tháng)** | 1 vCPU, 1GB RAM (hoặc 512MB RAM), 25GB SSD Storage. |
| **Authentication Method** | **SSH Keys** | Bắt buộc sử dụng cặp khóa bảo mật (Public Key / Private Key) thay cho Password. |
| **Key Type** | **Ed25519** | Chuẩn mã hóa đường cong elip hiện đại, kích thước nhỏ gọn và an toàn cao. |
| **Finalize Details** | 1 Droplet, Hostname: `ubuntu-droplet` | Tên gợi nhớ máy chủ thử nghiệm. |

---

## 3. Chi Tiết Các Bước Triển Khai

### Bước 1: Tạo cặp khóa SSH trên máy tính cá nhân (Windows PowerShell)
Mở PowerShell trên máy cá nhân và chạy lệnh tạo khóa với thuật toán `ed25519`:

```powershell
ssh-keygen -t ed25519 -C "student@devops-lab"
```

- Nhấn `Enter` để lưu file mặc định tại: `~/.ssh/id_ed25519` (Private Key).
- Nhấn `Enter` 2 lần để trống Passphrase (phục vụ đăng nhập tự động không cần mật khẩu).
- Khóa công khai (Public Key) được tạo ra tại: `~/.ssh/id_ed25519.pub`.

Xuất nội dung Public Key để chuẩn bị dán vào DigitalOcean:
```powershell
Get-Content $HOME\.ssh\id_ed25519.pub
```

---

### Bước 2: Khởi tạo Droplet trên DigitalOcean Console
1. Đăng nhập vào trang quản trị [DigitalOcean Cloud Console](https://cloud.digitalocean.com/).
2. Nhấn nút **Create** ➔ Chọn **Droplets**.
3. **Region:** Chọn **Singapore**.
4. **Choose an image:** Chọn **Ubuntu 22.04 LTS (x64)**.
5. **Droplet Type:** Chọn **Basic** ➔ CPU options chọn **Regular SSD** ($4 hoặc $6/tháng).
6. **Authentication:**
   - Chọn mục **SSH Keys**.
   - Bấm **New SSH Key** (hoặc *Add SSH Key*).
   - Dán toàn bộ nội dung của file `id_ed25519.pub` vào ô **SSH Key Content**.
   - Đặt tên định danh: `my-local-laptop`.
   - Tích chọn khóa vừa thêm vào Droplet.
7. **Finalize Details:** Đặt Hostname: `ubuntu-droplet`.
8. Bấm **Create Droplet** và đợi hệ thống cấp phát địa chỉ IPv4 công cộng.

---

### Bước 3: Kết nối SSH từ máy cá nhân tới Droplet
Sau khi Droplet được tạo thành công và có địa chỉ IPv4, mở PowerShell thực hiện lệnh:

```powershell
ssh -i $HOME\.ssh\id_ed25519 root@<IP_ADDRESS_DROPLET>
```

- Trong lần kết nối đầu tiên, hệ thống hỏi xác nhận fingerprint của host, gõ `yes` và nhấn `Enter`.
- Hệ thống lập tức đăng nhập thành công vào giao diện dòng lệnh của máy chủ với quyền `root` mà **không yêu cầu nhập mật khẩu**.

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

```text
ssh -i $HOME\.ssh\id_ed25519 root@103.72.57.112
Welcome to Ubuntu 24.04.5 LTS (GNU/Linux 6.8.0-31-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sun Oct  4 07:04:51 AM BST 2026

  System load:  0.0                Processes:               218
  Usage of /:   19.7% of 32.61GB   Users logged in:         0
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
Last login: Sun Oct  4 05:58:16 2026 from 118.69.116.50
root@1037257112523315:~# uname -a
Linux 1037257112523315 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC Sat Apr 20 00:40:06 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
root@1037257112523315:~# lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.5 LTS
Release:        24.04
Codename:       noble
root@1037257112523315:~# free -h
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       635Mi       2.0Gi       516Ki       1.4Gi       3.2Gi
Swap:          1.9Gi       1.3Mi       1.9Gi
root@1037257112523315:~# df -h
Filesystem                         Size  Used Avail Use% Mounted on
tmpfs                              387M  1.2M  386M   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv   33G  6.5G   25G  21% /
tmpfs                              1.9G     0  1.9G   0% /dev/shm
tmpfs                              5.0M     0  5.0M   0% /run/lock
/dev/sda2                          1.7G  200M  1.4G  13% /boot
tmpfs                              387M   16K  387M   1% /run/user/0
root@1037257112523315:~#
```


---

## 5. Kết Luận
- Khởi tạo và cấu hình thành công máy chủ Ubuntu chạy trên nền tảng đám mây.
- Thiết lập thành công cơ chế xác thực an toàn bằng cặp khóa SSH `ed25519`, đáp ứng nguyên tắc bảo mật thông tin, vô hiệu hóa nguy cơ bị tấn công Brute-force qua cổng SSH.
- Kết nối thành công tới tài khoản `root` từ xa bằng lệnh SSH trên máy tính cá nhân.
