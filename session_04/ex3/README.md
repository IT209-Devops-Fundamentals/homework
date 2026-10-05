# Bài 3: Cấu Hình Xác Thực SSH và Đẩy Dự Án Lên GitHub

---

## 1. Mục Tiêu Bài Thực Hành
- **Nâng cao bảo mật kết nối từ xa (Remote Authentication Hardening):** Khởi tạo và thiết lập cặp khóa SSH theo thuật toán mã hóa đường cong elip hiện đại `Ed25519` để xác thực với máy chủ GitHub thay cho phương thức mật khẩu/Personal Access Token truyền thống.
- **Loại bỏ thao tác thủ công (Zero Manual Operation):** Đăng ký Public Key lên tài khoản GitHub để mỗi lần thực hiện các thao tác `git push`, `git fetch`, `git pull` đều được xác thực tự động, an toàn và tức thì.
- **Chuyển đổi giao thức Remote URL:** Cấu hình chuyển đổi remote repository từ giao thức `HTTPS` sang giao thức `SSH` (`git@github.com:...`).
- **Kiểm chứng xác thực:** Sử dụng lệnh `ssh -T git@github.com` và `git remote -v`.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `ssh-keygen -t ed25519 -C "your_email@example.com"` | Khởi tạo cặp khóa SSH sử dụng thuật toán Ed25519 (256-bit elliptic curve). |
| **2** | `Get-Content $HOME\.ssh\id_ed25519.pub \| Set-Clipboard` | Sao chép toàn bộ nội dung khóa công khai (Public Key) vào bộ nhớ tạm để thêm lên GitHub. |
| **3** | `ssh -T git@github.com` | Kiểm tra kết nối và xác nhận danh tính với máy chủ GitHub qua giao thức SSH. |
| **4** | `git remote set-url origin git@github.com:<org>/<repo>.git` | Chuyển đổi địa chỉ remote `origin` sang giao thức SSH. |
| **5** | `git remote -v` | Kiểm tra danh sách URL fetch và push của remote repository. |
| **6** | `git push origin main` | Đẩy commit và mã nguồn lên GitHub an toàn thông qua kết nối SSH. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo cặp khóa SSH Ed25519 (Nếu chưa có)
Mở PowerShell trên máy cá nhân:
```powershell
ssh-keygen -t ed25519 -C "giahuy.devops@example.com"
```
*(Nhấn `Enter` liên tục 3 lần để lưu tại đường dẫn mặc định `~/.ssh/id_ed25519` và không đặt passphrase)*.

---

### Bước 2: Sao chép Public Key và Thêm vào GitHub
1. Sao chép nội dung Public Key vào Clipboard:
```powershell
Get-Content $HOME\.ssh\id_ed25519.pub | Set-Clipboard
```

2. Đăng ký khóa trên GitHub:
   - Truy cập trang cài đặt SSH của GitHub: [https://github.com/settings/keys](https://github.com/settings/keys)
   - Nhấn nút **New SSH key**.
   - **Title:** Đặt tên gợi nhớ máy tính của bạn (ví dụ: `Laptop-DevOps-Ed25519`).
   - **Key type:** Chọn `Authentication Key`.
   - **Key:** Dán nội dung vừa sao chép (`Ctrl + V`) vào ô này.
   - Nhấn **Add SSH key**.

---

### Bước 3: Kiểm tra kết nối SSH tới GitHub (Nghiệm thu)
Chạy lệnh kiểm tra xác thực:
```powershell
ssh -T git@github.com
```

👉 **Kết quả mong đợi:**
```text
Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### Bước 4: Chuyển đổi Remote URL sang giao thức SSH
1. Kiểm tra URL hiện tại của kho lưu trữ:
```powershell
git remote -v
```

2. Chuyển đổi sang định dạng SSH (`git@github.com:...`):
```powershell
git remote set-url origin git@github.com:IT209-Devops-Fundamentals/homework.git
```

3. Xác nhận lại URL đã chuyển sang SSH:
```powershell
git remote -v
```

---

### Bước 5: Đẩy mã nguồn lên GitHub qua SSH
```powershell
git push origin main
```
Hệ thống sẽ đồng bộ toàn bộ commit lên GitHub bằng khóa SSH mà không đòi hỏi nhập mật khẩu.

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Đầu ra text của lệnh kiểm tra kết nối SSH (`ssh -T git@github.com`):

```text
PS D:\IT209\homework> ssh -T git@github.com
Hi 2imBenne! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### 4.2. Đầu ra text của lệnh kiểm tra Remote URL (`git remote -v`):

```text
PS D:\IT209\homework> git remote -v
origin  git@github.com:IT209-Devops-Fundamentals/homework.git (fetch)
origin  git@github.com:IT209-Devops-Fundamentals/homework.git (push)
```

---

### 4.3. Đường dẫn Remote Repository:
- **Repository URL (SSH):** `git@github.com:IT209-Devops-Fundamentals/homework.git`
- **Web URL:** `https://github.com/IT209-Devops-Fundamentals/homework`

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Lợi thế vượt trội của SSH so với HTTPS trong DevOps & CI/CD:**
   - Khi sử dụng HTTPS, GitHub đã khai tử xác thực bằng mật khẩu tài khoản và bắt buộc dùng Personal Access Token (PAT). PAT thường có thời hạn hết hạn (Expiration), gây đứt gãy các pipeline tự động khi token bị hết hạn.
   - Sử dụng SSH Keypair với Ed25519 cho phép xác thực vĩnh viễn, an toàn bằng mật mã học bất đối xứng, không bao giờ lo hết hạn token và loại bỏ nguy cơ rò rỉ token trong command line.
2. **Quy tắc bảo mật khóa riêng tư (Private Key Security):**
   - **Tuyệt đối không bao giờ chia sẻ hay nộp file Private Key (`id_ed25519`) lên Git repository**. Chỉ có file Public Key (`id_ed25519.pub`) được phép đưa lên máy chủ GitHub.
