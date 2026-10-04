# Bài 2: Khởi Tạo User Thường và Thiết Lập Đặc Quyền Quản Trị (Sudoers Configuration)

---

## 1. Mục Tiêu Bài Thực Hành
- Áp dụng nguyên tắc an toàn **Đặc quyền tối thiểu (Principle of Least Privilege - PoLP)** trong quản trị hệ thống Linux: Hạn chế rủi ro thao tác nhầm lẫn hoặc tấn công leo thang khi sử dụng trực tiếp tài khoản tối cao `root`.
- Khởi tạo tài khoản người dùng thường (`devops`) dùng cho công việc vận hành hàng ngày.
- Cấp đặc quyền quản trị an toàn thông qua nhóm `sudo` (Superuser Do).
- Thiết lập và kế thừa cặp khóa SSH (`ed25519`) từ `root` sang thư mục home của user `devops`, cấu hình đúng phân quyền bảo mật chuẩn (`chmod 700`, `chmod 600`, `chown`).
- Kiểm tra tính hợp lệ bằng việc đăng nhập qua SSH không cần mật khẩu và thực thi lệnh đặc quyền `sudo whoami`.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `adduser devops` | Tạo user mới tên `devops`, tự động tạo thư mục home `/home/devops` và thiết lập mật khẩu đăng nhập. |
| **2** | `usermod -aG sudo devops` | Gán user `devops` vào nhóm quản trị `sudo` (`-a` append, `-G` secondary group). |
| **3** | `mkdir -p /home/devops/.ssh` | Tạo thư mục chứa khóa SSH cho user `devops`. |
| **4** | `cp /root/.ssh/authorized_keys /home/devops/.ssh/` | Kế thừa danh sách khóa công khai được phép truy cập từ root. |
| **5** | `chmod 700 /home/devops/.ssh` | Phân quyền thư mục `.ssh` (chỉ user `devops` có quyền đọc/ghi/thực thi - `rwx------`). |
| **6** | `chmod 600 /home/devops/.ssh/authorized_keys` | Phân quyền file khóa (chỉ user `devops` có quyền đọc/ghi - `rw-------`). |
| **7** | `chown -R devops:devops /home/devops/.ssh` | Chuyển quyền sở hữu thư mục `.ssh` từ `root` sang `devops`. |

*(Cách tương đương theo gợi ý đề bài: `rsync --archive --chown=devops:devops ~/.ssh /home/devops/`)*

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Kết nối tới máy chủ với quyền root
Từ máy cá nhân (Windows PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 root@103.72.57.112
```

### Bước 2: Tạo user `devops` và cấp quyền `sudo`
Trên terminal của máy chủ:
```bash
# 1. Tạo user devops và đặt mật khẩu
adduser devops

# 2. Thêm user devops vào group sudo
usermod -aG sudo devops
```

### Bước 3: Cấu hình SSH Key và phân quyền cho user `devops`
```bash
# Tạo thư mục .ssh và sao chép khóa
mkdir -p /home/devops/.ssh
cp /root/.ssh/authorized_keys /home/devops/.ssh/

# Phân quyền chuẩn bảo mật SSH
chmod 700 /home/devops/.ssh
chmod 600 /home/devops/.ssh/authorized_keys

# Chuyển quyền sở hữu cho user devops
chown -R devops:devops /home/devops/.ssh

# Thoát khỏi session của root
exit
```

### Bước 4: Kiểm tra đăng nhập và đặc quyền quản trị từ máy cá nhân
Mở PowerShell máy cá nhân và thực hiện kết nối bằng tài khoản `devops`:
```powershell
ssh -i $HOME\.ssh\id_ed25519 devops@103.72.57.112
```
Sau khi đăng nhập thành công, chạy lệnh kiểm tra đặc quyền:
```bash
sudo whoami
```
*(Hệ thống yêu cầu nhập mật khẩu của user `devops`, sau khi nhập thành công sẽ hiển thị kết quả là `root`)*.

---

## 4. Kết Quả Kiểm Tra & Log Minh Chứng

### 4.1. Log thực hiện tạo user và phân quyền trên máy chủ (Server-side):

```text
root@1037257112523315:~# adduser devops
Adding user `devops' ...
Adding new group `devops' (1001) ...
Adding new user `devops' (1001) with group `devops (1001)' ...
Creating home directory `/home/devops' ...
Copying files from `/etc/skel' ...
New password: 
Retype new password: 
passwd: password updated successfully
Changing the user information for devops
Enter the new value, or press ENTER for the default
	Full Name []: DevOps Engineer
	Room Number []: 
	Work Phone []: 
	Home Phone []: 
	Other []: 
Is the information correct? [Y/n] Y

root@1037257112523315:~# usermod -aG sudo devops
root@1037257112523315:~# mkdir -p /home/devops/.ssh
root@1037257112523315:~# cp /root/.ssh/authorized_keys /home/devops/.ssh/
root@1037257112523315:~# chmod 700 /home/devops/.ssh
root@1037257112523315:~# chmod 600 /home/devops/.ssh/authorized_keys
root@1037257112523315:~# chown -R devops:devops /home/devops/.ssh
root@1037257112523315:~# exit
logout
Connection to 103.72.57.112 closed.
```

---

### 4.2. Log kết nối SSH bằng tài khoản `devops` và thực thi `sudo whoami`:

```text
PS C:\Users\GIA HUY> ssh -i $HOME\.ssh\id_ed25519 devops@103.72.57.112
Welcome to Ubuntu 24.04.5 LTS (GNU/Linux 6.8.0-31-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sun Oct  4 07:23:00 AM BST 2026

  System load:  0.0                Processes:               219
  Usage of /:   19.7% of 32.61GB   Users logged in:         0
  Memory usage: 14%                IPv4 address for ens192: 103.72.57.112
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

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

devops@1037257112523315:~$ sudo ưhoami
[sudo] password for devops:
sudo: ưhoami: command not found
devops@1037257112523315:~$ sudo whoami
root
devops@1037257112523315:~$
```

---

## 5. Kết Luận
- Tạo thành công tài khoản người dùng thường `devops` có thư mục home và shell tiêu chuẩn.
- Cấu hình nhóm `sudo` thành công, cho phép thực thi các tác vụ quản trị có kiểm soát bằng cách nhập mật khẩu xác nhận.
- Cấu hình SSH Key và phân quyền `700/600/chown` chính xác, đảm bảo SSH Daemon không từ chối truy cập vì lỗi "StrictModes".
- Hoàn thành đầy đủ các tiêu chuẩn bảo mật theo nguyên tắc **Least Privilege** trong vận hành Linux Server.
