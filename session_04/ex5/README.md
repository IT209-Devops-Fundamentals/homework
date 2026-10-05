# Bài 5: Khôi Phục Trạng Thái và Đảo Ngược Commit (Reset vs Revert)

---

## 1. Mục Tiêu Bài Thực Hành
- **Làm chủ 2 cơ chế hoàn tác kinh điển trong Git:**
  - `git reset`: Di chuyển con trỏ nhánh lùi về quá khứ, viết lại lịch sử (chuyên dùng cho môi trường cục bộ/Local).
  - `git revert`: Tạo một commit mới đảo ngược các thay đổi của commit cũ, bảo toàn tính toàn vẹn của lịch sử (bắt buộc khi làm việc nhóm trên Remote).
- **Phân biệt chuyên sâu các chế độ của `git reset`:**
  - `--soft`: Chỉ lùi commit, giữ nguyên thay đổi trong Staging Area (Index).
  - `--mixed` (Mặc định): Lùi commit, đưa thay đổi về Working Directory ở trạng thái chưa chuẩn bị (Unstaged).
  - `--hard` (Nguy hiểm): Xóa sạch toàn bộ thay đổi ở cả Commit, Staging và Working Directory.
- **Thực hành quy tắc an toàn DevOps (Zero Destructive Action):**
  - Trong Trường hợp 1: Sử dụng `git reset` an toàn (không dùng `--hard`) để bảo toàn mã nguồn.
  - Trong Trường hợp 2: Sử dụng `git revert` tạo commit phủ định rõ ràng.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `git reset HEAD~1` (hoặc `git reset --mixed HEAD~1`) | Lùi con trỏ `HEAD` lại 1 commit, giữ các thay đổi trong Working Directory để tiếp tục chỉnh sửa. |
| **2** | `git revert HEAD --no-edit` | Tự động tạo một commit mới phủ định lại toàn bộ thay đổi của commit gần nhất mà không cần mở trình soạn thảo văn bản. |
| **3** | `git revert <commit_hash>` | Đảo ngược một commit cụ thể trong lịch sử bằng cách áp dụng một bản vá đối nghịch (Inverse Patch). |
| **4** | `git status` | Kiểm tra trạng thái các tệp tin trong Working Directory và Staging Area sau khi reset. |
| **5** | `git log --oneline -n 5` | Xem 5 commit gần nhất để đối chiếu sự thay đổi của lịch sử. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo repository và commit gốc
Mở PowerShell tại thư mục `session_04\ex5`:
```powershell
cd d:\IT209\homework\session_04\ex5
git init
git branch -M main

# Tạo file mã nguồn ban đầu
Set-Content -Path "app.py" -Value 'print("Version 1.0: Working perfectly")'
git add app.py
git commit -m "feat: initial stable version 1.0"
```

---

### TRƯỜNG HỢP 1: Khôi phục lịch sử cục bộ bằng `git reset` (Local Undo)

1. **Tạo một commit chứa code lỗi ở máy cá nhân:**
```powershell
Add-Content -Path "app.py" -Value 'print("Buggy code introduced locally")'
git add app.py
git commit -m "feat: unfinished buggy feature"
```

2. **Xem lịch sử trước khi reset:**
```powershell
git log --oneline
```
*(Thấy commit `feat: unfinished buggy feature` đang nằm trên đầu HEAD)*.

3. **Thực thi `git reset HEAD~1` để lùi lại 1 commit mà không mất code:**
```powershell
git reset HEAD~1
```

4. **Kiểm tra trạng thái:**
```powershell
git status
```
👉 **Kết quả:** File `app.py` quay về trạng thái **Modified (chưa Staged)** trong Working Directory. Mã nguồn không hề bị mất! Bạn có thể sửa lại code cho chuẩn xác rồi commit lại:
```powershell
Set-Content -Path "app.py" -Value 'print("Version 1.0: Working perfectly")'
Add-Content -Path "app.py" -Value 'print("Version 1.1: Fixed feature cleanly")'
git add app.py
git commit -m "feat: version 1.1 properly implemented"
```

---

### TRƯỜNG HỢP 2: Đảo ngược an toàn cho làm việc nhóm bằng `git revert` (Remote-Safe Undo)

1. **Giả lập một commit đã push lên remote nhưng phát hiện lỗi:**
```powershell
Set-Content -Path "broken_feature.py" -Value 'raise SystemError("Critical crash on staging!")'
git add broken_feature.py
git commit -m "feat: bad feature that broke staging"
```

2. **Xem lịch sử trước khi revert:**
```powershell
git log --oneline
```

3. **Thực thi lệnh đảo ngược commit bằng `git revert`:**
```powershell
git revert HEAD --no-edit
```

👉 **Kết quả:** Git không hề xóa commit cũ, mà tạo ra ngay một commit mới có tiêu đề `Revert "feat: bad feature that broke staging"`, đồng thời tệp tin lỗi `broken_feature.py` tự động bị gỡ bỏ một cách an toàn!

4. **Kiểm tra lại lịch sử commit (`git log --oneline -n 5`):**
```powershell
git log --oneline -n 5
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Kết quả lệnh `git status` sau khi thực hiện `git reset HEAD~1` (Trường hợp 1):

```text
PS D:\IT209\homework\session_04\ex5> git reset HEAD~1
Unstaged changes after reset:
M       app.py

PS D:\IT209\homework\session_04\ex5> git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   app.py

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

---

### 4.2. Đầu ra text của lệnh `git log --oneline -n 5` sau khi thực hiện `git revert` (Trường hợp 2):

```text
PS D:\IT209\homework\session_04\ex5> git log --oneline -n 5
3e218f2 (HEAD -> main) Revert "feat: bad feature that broke staging"
8593c19 feat: bad feature that broke staging
32c71ad feat: version 1.1 properly implemented
6684b03 feat: initial stable version 1.0
```
*(Commit `Revert ...` xuất hiện trên đầu nhánh, ghi lại lịch sử hoàn tác minh bạch).*

---

## 5. Bảng So Sánh Toàn Diện: Reset vs Revert Trong Thực Tế

| Tiêu chí | `git reset` | `git revert` |
| :--- | :--- | :--- |
| **Bản chất hoạt động** | **Di chuyển con trỏ lùi về quá khứ**, viết lại lịch sử commit (Rewrite History). | **Tiến về phía trước**, tạo một commit mới phủ định thay đổi cũ (Forward-moving Undo). |
| **Ảnh hưởng lịch sử** | Commit cũ bị xóa khỏi nhánh hiện tại. | Giữ nguyên 100% commit cũ, thêm commit mới ghi rõ lý do revert. |
| **Môi trường khuyến nghị** | **Chỉ dùng ở Local** cho các commit cá nhân chưa bao giờ `git push`. | **Bắt buộc dùng trên Remote / Nhánh chung** (`main`, `develop`) khi làm việc nhóm. |
| **Mức độ rủi ro** | Rất cao nếu dùng nhầm `--hard` (mất code vĩnh viễn), gây xung đột lịch sử nghiêm trọng cho đồng nghiệp nếu đã push. | An toàn tuyệt đối, không gây xung đột nhánh với các thành viên khác trong nhóm. |
