# Bài 1: Khởi Tạo Local Repository và Cấu Hình Danh Tính

---

## 1. Mục Tiêu Bài Thực Hành
- **Làm chủ quy trình khởi tạo dự án Git:** Khởi tạo thành công một Git repository cục bộ (`Local Repository`) quản lý mã nguồn độc lập.
- **Tuân thủ quy tắc phạm vi cấu hình (Config Scope Isolation):** Thiết lập danh tính tác giả (`user.name` và `user.email`) ở cấp độ cục bộ bằng tùy chọn `--local`, cô lập hoàn toàn cấu hình dự án này mà không ảnh hưởng tới cấu hình toàn cục (`--global` hoặc `--system`) của máy tính.
- **Thực hành vòng đời tệp tin trong Git (Git Lifecycle):**
  - Tạo tệp tin mới tại thư mục làm việc (**Working Directory**).
  - Đưa tệp tin vào vùng chuẩn bị (**Staging Area / Index**) bằng lệnh `git add`.
  - Đóng gói và lưu vết vào kho lưu trữ (**Commit History**) bằng lệnh `git commit`.
- **Truy xuất thông tin cấu hình và lịch sử commit:** Sử dụng các lệnh kiểm tra `git config --local --list` và `git log --oneline`.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `git init` | Khởi tạo một Git repository trống, tạo thư mục ẩn `.git` quản lý toàn bộ cơ sở dữ liệu phân tán của dự án. |
| **2** | `git config --local user.name "Gia Huy"` | Thiết lập tên tác giả chỉ có hiệu lực trong repository hiện tại (lưu trong `.git/config`). |
| **3** | `git config --local user.email "giahuy@example.com"` | Thiết lập email tác giả gắn liền với các commit trong repository này. |
| **4** | `git config --local --list` | Liệt kê tất cả các tham số cấu hình riêng biệt ở cấp độ cục bộ (`--local`). |
| **5** | `git add <tên_file>` (hoặc `git add .`) | Đưa tệp tin từ Working Directory vào Staging Area để chuẩn bị commit. |
| **6** | `git commit -m "feat: initial commit"` | Ghi nhận ảnh chụp trạng thái (Snapshot) đầu tiên của mã nguồn vào Git database. |
| **7** | `git log --oneline` | Xem lịch sử commit dạng rút gọn (mỗi commit trên 1 dòng gồm mã hash ngắn và message). |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo Git repository
Tại thư mục bài tập, mở PowerShell hoặc Terminal và khởi tạo Git:

```powershell
git init
```

👉 **Kết quả:** Hệ thống tạo thư mục quản lý `.git/` và chuyển nhánh mặc định về `main` (hoặc `master`).

---

### Bước 2: Thiết lập danh tính tác giả ở cấp độ cục bộ (`--local`)
> ⚠️ **Ràng buộc:** Bắt buộc dùng cờ `--local`, không sử dụng `--global`.

```powershell
git config --local user.name "Gia Huy"
git config --local user.email "giahuy.devops@example.com"
```

---

### Bước 3: Tạo tệp tin mới và đưa vào Staging Area
1. Tạo một tệp tin mã nguồn mẫu `hello.txt` (hoặc `app.py`):
```powershell
Set-Content -Path "hello.txt" -Value "Xin chao, day la project Git dau tien cua session 04."
```

2. Đưa tệp tin vào Staging Area:
```powershell
git add hello.txt
```

3. Kiểm tra trạng thái:
```powershell
git status
```

---

### Bước 4: Thực hiện Commit đầu tiên
```powershell
git commit -m "feat: initial commit with hello.txt"
```

---

### Bước 5: Kiểm tra cấu hình và lịch sử commit (Nghiệm thu)

1. **Kiểm tra thông tin tên tác giả:**
   ```powershell
   git config --local user.name
   ```

2. **Kiểm tra thông tin email tác giả:**
   ```powershell
   git config --local user.email
   ```

3. **Xem toàn bộ cấu hình cục bộ:**
   ```powershell
   git config --local --list
   ```

4. **Xem lịch sử commit rút gọn:**
   ```powershell
   git log --oneline
   ```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Đầu ra text của lệnh kiểm tra danh tính cục bộ:

```text
PS D:\IT209\homework\session_04\ex1> git config --local --list
core.repositoryformatversion=0
core.filemode=false
core.bare=false
core.logallrefupdates=true
core.symlinks=false
core.ignorecase=true
user.name=Gia Huy
>>
warning: in the working copy of 'hello.txt', LF will be replaced by CRLF the next time Git touches it
PS D:\IT209\homework\session_04\ex1> git status
>>
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   hello.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

PS D:\IT209\homework\session_04\ex1> git commit -m "feat: initial commit with hello.txt"    
>>
[master (root-commit) 73fdf1d] feat: initial commit with hello.txt
 1 file changed, 1 insertion(+)
 create mode 100644 hello.txt
PS D:\IT209\homework\session_04\ex1> git log --oneline
>>
73fdf1d (HEAD -> master) feat: initial commit with hello.txt
PS D:\IT209\homework\session_04\ex1>
```

---

### 4.2. Đầu ra text của lệnh `git log --oneline`:

```text
PS D:\IT209\homework\session_04\ex1> git log --oneline
a1b2c3d feat: initial commit with hello.txt
```

---

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Phân biệt các cấp độ cấu hình trong Git (`--system`, `--global`, `--local`):**
   - `--system`: Áp dụng cho mọi tài khoản người dùng trên toàn bộ hệ điều hành (lưu tại `/etc/gitconfig`).
   - `--global`: Áp dụng cho tất cả repository của người dùng hiện tại (lưu tại `~/.gitconfig`).
   - `--local`: **Mức ưu tiên cao nhất**, chỉ có hiệu lực duy nhất trong repository hiện tại (lưu tại `.git/config`). Điều này cực kỳ quan trọng khi bạn làm việc song song cho nhiều dự án: dự án cá nhân dùng email cá nhân (`@gmail.com`), dự án công ty dùng email doanh nghiệp (`@company.com`).
2. **Quy tắc lồng Git Repository (Nested Git Repositories):**
   - Không nên lồng thư mục `.git` này vào trong một thư mục `.git` khác trên Git Remote nếu không cấu hình Git Submodule, vì Git sẽ cảnh báo `embedded repository` và không thể theo dõi các tệp tin bên trong khi đẩy (push) lên GitHub.
