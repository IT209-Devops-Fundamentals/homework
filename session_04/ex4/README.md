# Bài 4: Quản Lý Tệp Tin Bỏ Qua (.gitignore) và Sửa Lịch Sử (Amend)

---

## 1. Mục Tiêu Bài Thực Hành
- **Bảo mật mã nguồn (Secrets Protection):** Ngăn chặn việc đẩy các thông tin nhạy cảm (API Keys, Passwords, Database credentials) hoặc tệp tin rác hệ thống lên kho lưu trữ Git thông qua tệp tin cấu hình ẩn `.gitignore`.
- **Kỹ thuật gỡ bỏ theo dõi an toàn (`git rm --cached`):** Xóa bỏ một tệp tin đã vô tình được commit hoặc đưa vào Staging Area ra khỏi vùng theo dõi (Index) của Git mà **hoàn toàn giữ nguyên tệp tin vật lý** trên ổ đĩa cục bộ.
- **Làm sạch lịch sử commit (`git commit --amend`):** Chỉnh sửa nội dung và thông điệp của commit gần nhất để loại bỏ vết commit nhầm, đảm bảo lịch sử Git sạch sẽ, chuyên nghiệp trước khi đẩy lên remote repository.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `git rm --cached credentials.txt` | Gỡ bỏ tệp tin khỏi chỉ mục theo dõi (Staging/Index) của Git nhưng **giữ nguyên tệp tin vật lý** trong thư mục làm việc. |
| **2** | `echo "credentials.txt" >> .gitignore` | Bổ sung tên tệp tin nhạy cảm vào `.gitignore` để Git tự động bỏ qua vĩnh viễn. |
| **3** | `git add .gitignore` | Đưa tệp `.gitignore` vào Staging Area để chuẩn bị đóng gói. |
| **4** | `git commit --amend -m "..."` | Ghi đè (amend) vào commit gần nhất, cập nhật lại trạng thái không còn theo dõi `credentials.txt` và sửa thông điệp commit. |
| **5** | `git status` | Xác nhận tệp `credentials.txt` không còn xuất hiện trong danh sách theo dõi của Git (không bị Untracked hay Modified). |
| **6** | `git log -n 1` | Kiểm tra thông điệp và nội dung của commit gần nhất sau khi đã sửa đổi thành công. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo repository và tái hiện tình huống commit nhầm file nhạy cảm
Mở PowerShell tại thư mục `session_04\ex4`:
```powershell
cd d:\IT209\homework\session_04\ex4
git init
git branch -M main

# Tạo file mã nguồn và file bí mật nhạy cảm
Set-Content -Path "app.py" -Value 'print("Application running.")'
Set-Content -Path "credentials.txt" -Value "DB_PASSWORD=SuperSecretPassword123!"

# Lỡ tay commit nhầm cả 2 file
git add .
git commit -m "feat: add application and secret credentials"
```

---

### Bước 2: Gỡ bỏ `credentials.txt` khỏi Index nhưng giữ nguyên trên đĩa
Chạy lệnh `git rm` với cờ `--cached`:
```powershell
git rm --cached credentials.txt
```
> 💡 **Giải thích kỹ thuật:** 
> - Nếu chạy `git rm credentials.txt`, Git sẽ xóa luôn file vật lý trên ổ cứng của bạn (gây mất dữ liệu cấu hình cục bộ).
> - Thêm cờ `--cached`, Git chỉ xóa con trỏ quản lý file đó trong vùng Staging/Index, tệp tin `credentials.txt` trên ổ đĩa của bạn vẫn còn nguyên 100%.

---

### Bước 3: Cấu hình `.gitignore` để bỏ qua file vĩnh viễn
Thêm `credentials.txt` vào file `.gitignore` để Git không bao giờ gợi ý thêm file này nữa:
```powershell
Add-Content -Path ".gitignore" -Value "credentials.txt"
git add .gitignore
```

---

### Bước 4: Sửa lại commit gần nhất bằng `--amend` (Làm sạch lịch sử)
Thay vì tạo một commit mới thông báo "xóa file mật khẩu" (khiến lịch sử Git vẫn lưu vết commit cũ chứa password), ta dùng `--amend` để ghi đè trực tiếp lên commit trước đó:

```powershell
git commit --amend -m "feat: add application code and configure gitignore"
```

---

### Bước 5: Kiểm tra kết quả (Nghiệm thu đề bài)

1. **Kiểm tra trạng thái (`git status`):**
   ```powershell
   git status
   ```
   👉 Kết quả: `working tree clean` (file `credentials.txt` vẫn nằm trên máy nhưng không hề xuất hiện trong danh sách Untracked vì đã bị `.gitignore` chặn).

2. **Kiểm tra file vật lý vẫn tồn tại trên ổ cứng:**
   ```powershell
   Test-Path credentials.txt
   ```
   👉 Kết quả: `True`.

3. **Xem lịch sử commit gần nhất (`git log -n 1`):**
   ```powershell
   git log -n 1
   ```
   👉 Kết quả: Thông điệp commit đã được đổi thành thông điệp sạch sẽ, không còn lưu vết commit nhầm.

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Đầu ra text của lệnh `git status`:

```text
PS D:\IT209\homework\session_04\ex4> git status
>>
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present (use "git add" to track)
PS D:\IT209\homework\session_04\ex4> git log -n 1
>>
commit 9023e148b329a6a2d272cde2ee83fa74c3e5116d (HEAD -> main)
Author: @2imBenn <lamgiahuy002203@gmail.com>
Date:   Mon Oct 5 21:04:26 2026 +0700

    feat: add application code and configure gitignore
PS D:\IT209\homework\session_04\ex4> git ls-files
>>
.gitignore
app.py
```
*(Tệp `credentials.txt` hoàn toàn không còn nằm trong kho theo dõi của Git).*

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Nguy cơ rò rỉ thông tin đăng nhập trong DevOps:**
   - Việc để lọt file mật khẩu hoặc Private Key lên GitHub công khai (Public Repo) chỉ trong vài giây có thể khiến máy chủ bị botnet tự động chiếm quyền điều khiển. Luôn tạo file `.gitignore` ngay từ commit đầu tiên của dự án.
2. **Sự khác biệt giữa `git rm` và `git rm --cached`:**
   - `git rm <file>`: Xóa file khỏi Git VÀ xóa file vật lý trên đĩa cứng.
   - `git rm --cached <file>`: Chỉ xóa file khỏi chỉ mục của Git (Index/Staging), **giữ nguyên file vật lý trên đĩa**.
3. **Quy tắc sử dụng `git commit --amend`:**
   - Chỉ nên dùng `--amend` đối với các commit **ở môi trường cục bộ (local) chưa được `git push`** lên remote branch chung của nhóm. Nếu commit đã push lên remote, việc amend sẽ thay đổi mã hash của commit và gây xung đột lịch sử với các thành viên khác trong nhóm.
