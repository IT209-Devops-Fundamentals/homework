# Bài 2: Tái Cấu Trúc Lịch Sử Commit Bằng Interactive Rebase

---

## 1. Mục Tiêu Bài Thực Hành
- **Làm chủ kỹ thuật tái cấu trúc lịch sử (Git History Refactoring):** Sử dụng công cụ tương tác mạnh mẽ `git rebase -i` (Interactive Rebase) để dọn dẹp, tái tổ chức các commit trước khi tích hợp vào nhánh chính.
- **Áp dụng các chỉ thị cốt lõi của Rebase:**
  - `pick` (`p`): Giữ nguyên commit.
  - `squash` (`s`): Gộp commit vào commit liền trước nó và kết hợp các thông điệp commit.
  - `reword` (`r`): Giữ nguyên mã nguồn nhưng sửa đổi lại thông điệp commit.
  - `drop` (`d`): Xóa bỏ hoàn toàn commit và loại bỏ các thay đổi của commit đó ra khỏi cây lịch sử.
- **Chuẩn hóa thông điệp Commit (Conventional Commits):** Biến chuỗi commit rời rạc, thử nghiệm ("fix typo", "temp") thành một commit duy nhất có ý nghĩa: `feat: hoan thien module authentication`.

---

## 2. Bảng Chỉ Thị Trong Interactive Rebase (Rebase Cheat Sheet)

| Lệnh / Phím tắt | Tên chỉ thị | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **`pick` / `p`** | Pick | Giữ lại commit này trong lịch sử. |
| **`squash` / `s`** | Squash | Gộp commit này vào commit đứng ngay phía trước nó, cho phép ghép thông điệp commit. |
| **`fixup` / `f`** | Fixup | Tương tự squash nhưng tự động bỏ qua thông điệp commit của nó (không hiện cửa sổ chỉnh sửa). |
| **`reword` / `r`** | Reword | Giữ lại nội dung code của commit nhưng mở cửa sổ cho phép viết lại thông điệp. |
| **`drop` / `d`** | Drop | Xóa bỏ hoàn toàn commit khỏi lịch sử nhánh (toàn bộ code của commit này bị loại bỏ). |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo repository tại thư mục `session_05\ex2`
Mở PowerShell:
```powershell
cd d:\IT209\homework\session_05\ex2
git init
git branch -M main

# Tạo commit gốc nền tảng
Set-Content -Path "README.md" -Value "# Authentication Project"
git add README.md
git commit -m "init: khoi tao du an"
```

---

### Bước 2: Tạo lần lượt 4 commit thử nghiệm theo kịch bản đề bài
1. **Commit 1:** Tạo file `auth.js`:
   ```powershell
   Set-Content -Path "auth.js" -Value 'function login() { return true; }'
   git add auth.js
   git commit -m "feat: khoi tao module auth"
   ```

2. **Commit 2:** Sửa lỗi nhỏ (fix typo):
   ```powershell
   Add-Content -Path "auth.js" -Value '// Fixed typo'
   git add auth.js
   git commit -m "fix typo"
   ```

3. **Commit 3:** Bổ sung hàm tiện ích:
   ```powershell
   Add-Content -Path "auth.js" -Value 'function logout() { return false; }'
   git add auth.js
   git commit -m "adds utility functions"
   ```

4. **Commit 4:** Tạo file rác debug `temp.txt`:
   ```powershell
   Set-Content -Path "temp.txt" -Value "Day la file rac tam thoi cho debug."
   git add temp.txt
   git commit -m "add temp file for debug"
   ```

Kiểm tra lịch sử 5 commit vừa tạo:
```powershell
git log --oneline
```
*(Thấy 4 commit vụn vặt đang nằm trên đầu nhánh main)*.

---

### Bước 3: Khởi chạy Interactive Rebase lùi lại 4 commit
> 💡 **Mẹo cho Windows:** Đặt trình soạn thảo tạm thời là **Notepad** để giao diện mở ra trực quan, dễ chỉnh sửa:
```powershell
$env:GIT_EDITOR="notepad"
git rebase -i HEAD~4
```

---

### Bước 4: Cấu hình kịch bản Rebase trong tệp tin soạn thảo
Cửa sổ Notepad sẽ mở ra hiển thị danh sách 4 commit theo thứ tự từ cũ đến mới:

```text
pick 1a2b3c4 feat: khoi tao module auth
pick 2b3c4d5 fix typo
pick 3c4d5e6 adds utility functions
pick 4d5e6f7 add temp file for debug
```

Bạn chỉnh sửa 4 dòng này thành:
```text
pick 1a2b3c4 feat: khoi tao module auth
squash 2b3c4d5 fix typo
squash 3c4d5e6 adds utility functions
drop 4d5e6f7 add temp file for debug
```
*(Nhấn `Ctrl + S` để lưu và đóng Notepad lại)*.

---

### Bước 5: Soạn thảo thông điệp commit gộp cuối cùng
Ngay sau khi đóng Notepad, Git sẽ mở tiếp một cửa sổ Notepad thứ hai để bạn đặt tên cho commit gộp (Squashed Commit).

Bạn xóa toàn bộ các dòng thông điệp cũ và thay bằng đúng yêu cầu đề bài:
```text
feat: hoan thien module authentication
```
*(Nhấn `Ctrl + S` để lưu và đóng Notepad lại)*.

👉 **Git in ra thông báo thành công:**
```text
Successfully rebased and updated refs/heads/main.
```

---

### Bước 6: Kiểm tra kết quả tái cấu trúc (Nghiệm thu đề bài)

1. **Xem lịch sử commit rút gọn:**
   ```powershell
   git log --oneline
   ```
   👉 Toàn bộ 4 commit vụn vặt đã được gộp và làm sạch thành duy nhất 1 commit chuẩn:
   ```text
   xxxxxxx (HEAD -> main) feat: hoan thien module authentication
   xxxxxxx init: khoi tao du an
   ```

2. **Kiểm tra file rác `temp.txt` đã bị xóa hoàn toàn:**
   ```powershell
   Test-Path temp.txt
   ```
   👉 Kết quả: **`False`** (File `temp.txt` đã bị loại bỏ hoàn toàn nhờ chỉ thị `drop`).

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Cấu hình bảng chỉ thị trong tệp Interactive Rebase:

```text
pick a1b2c3d feat: khoi tao module auth
squash b2c3d4e fix typo
squash c3d4e5f adds utility functions
drop d4e5f6a add temp file for debug
```

---

### 4.2. Lịch sử commit sau khi hoàn tất Interactive Rebase (`git log --oneline`):

```text
PS D:\IT209\homework\session_05\ex2> git log --oneline
>>
f237ecd (HEAD -> main) feat: hoan thien module authentication
de4fdcf init: khoi tao du an
```

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Tại sao cần thực hiện Interactive Rebase trước khi mở Pull Request?**
   - Trong quá trình phát triển (Local Development), lập trình viên thường commit liên tục để lưu code thử nghiệm (với các message như "test", "wip", "fix typo").
   - Nếu đẩy nguyên cây lịch sử lộn xộn này lên nhánh chung của dự án, người review code (Reviewer) sẽ rất khó theo dõi. Sử dụng `squash` giúp cô đọng toàn bộ tính năng vào một commit logic duy nhất.
2. **Quy tắc vàng của Rebase (The Golden Rule of Rebasing):**
   - **Tuyệt đối không bao giờ rebase
