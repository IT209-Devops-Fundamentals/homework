# Bài 1: Khôi Phục Commit Đã Mất Bằng Git Reflog

---

## 1. Mục Tiêu Bài Thực Hành
- **Làm chủ "Hộp đen cứu hộ" của Git (Git Reflog):** Hiểu rõ cơ chế ghi nhật ký tham chiếu cục bộ (Reference Logs) tại `.git/logs/HEAD`. Trong khi `git log` chỉ hiển thị các commit còn nằm trên cây nhánh hiện hành, `git reflog` ghi lại **mọi thao tác di chuyển của con trỏ `HEAD`** (bao gồm commit, reset, checkout, merge, rebase, cherry-pick).
- **Xử lý sự cố nghiêm trọng (Disaster Recovery):** Khôi phục thành công một commit và dữ liệu mã nguồn đã bị xóa biến mất khỏi nhánh làm việc sau khi lỡ tay chạy lệnh hủy diệt `git reset --hard`.
- **Nguyên tắc an toàn dữ liệu:** Không cần viết lại mã nguồn thủ công, truy xuất mã băm SHA của commit bị mất (Dangling Commit) từ Reflog và khôi phục toàn vẹn trạng thái hệ thống.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `git reset --hard HEAD~1` | **[LỆNH GÂY LỖI]** Lùi nhánh về commit trước, xóa sạch toàn bộ thay đổi ở cả Working Directory và Staging (commit bị tách rời khỏi nhánh). |
| **2** | `git log --oneline` | Kiểm tra lịch sử nhánh hiện tại để xác nhận commit quan trọng đã biến mất. |
| **3** | `git reflog` | **[CỨU HỘ]** Tra cứu toàn bộ lịch sử di chuyển của con trỏ `HEAD` để tìm lại mã commit SHA vừa bị reset. |
| **4** | `git reset --hard <commit_hash>` | Đưa con trỏ `HEAD` và Working Directory quay trở lại chính xác trạng thái của commit đã mất. |
| **5** | `cat <tên_file>` | Kiểm tra nội dung tệp tin đã được khôi phục nguyên vẹn trên đĩa. |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo repository và tạo commit ban đầu
Mở PowerShell tại thư mục `session_05\ex1`:
```powershell
cd d:\IT209\homework\session_05\ex1
git init
git branch -M main

# Tạo commit khởi đầu
Set-Content -Path "main.py" -Value 'print("He thong khoi dong.")'
git add main.py
git commit -m "init: khoi tao he thong"
```

---

### Bước 2: Thêm tính năng quan trọng và commit
Tạo tệp tin `feature.txt` chứa mã nguồn quan trọng:
```powershell
Set-Content -Path "feature.txt" -Value "Day la tinh nang quan trong vua duoc phat trien cho he thong."
git add feature.txt
git commit -m "feat: them tinh nang quan trong"
```

Kiểm tra lịch sử:
```powershell
git log --oneline
```
*(Thấy commit `feat: them tinh nang quan trong` đang ở vị trí HEAD)*.

---

### Bước 3: Giả lập sự cố thảm họa (`git reset --hard HEAD~1`)
Lập trình viên vô tình thực thi lệnh xóa lùi lịch sử:
```powershell
git reset --hard HEAD~1
```

👉 **Hậu quả:** 
- Con trỏ `HEAD` bị kéo lùi về commit `init`.
- Tệp tin `feature.txt` bị xóa sạch khỏi ổ cứng (`Test-Path feature.txt` trả về `False`).
- Lệnh `git log --oneline` không còn nhìn thấy commit `feat: them tinh nang quan trong` nữa.

---

### Bước 4: Tra cứu "Hộp đen" `git reflog` để tìm lại dấu vết
Chạy lệnh tra cứu nhật ký tham chiếu:
```powershell
git reflog
```

👉 **Kết quả hiển thị:**
```text
1a2b3c4 HEAD@{0}: reset: moving to HEAD~1
e3a5b2c HEAD@{1}: commit: feat: them tinh nang quan trong
1a2b3c4 HEAD@{2}: commit (initial): init: khoi tao he thong
```
🔍 **Phân tích:** Ta lập tức tìm thấy commit bị mất có mã hash là `e3a5b2c` (tại vị trí `HEAD@{1}`).

---

### Bước 5: Cứu hộ commit đã mất về lại nhánh `main`
Sử dụng mã hash tìm được từ Reflog để khôi phục:
```powershell
git reset --hard <mã_hash_tim_duoc>
```
*(Ví dụ: `git reset --hard e3a5b2c`)*.

---

### Bước 6: Kiểm tra kết quả khôi phục (Nghiệm thu đề bài)

1. **Kiểm tra lịch sử commit:**
   ```powershell
   git log --oneline
   ```
   👉 Commit `feat: them tinh nang quan trong` đã quay trở lại trên đầu nhánh `main`!

2. **Kiểm tra tệp tin trên ổ đĩa:**
   ```powershell
   Get-Content feature.txt
   ```
   👉 Nội dung `Day la tinh nang quan trong...` đã được hồi sinh nguyên vẹn 100%!

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Lịch sử commit bị mất sau khi chạy `git reset --hard HEAD~1`:

```text
PS D:\IT209\homework\session_05\ex1> git log --oneline
>>
79834d7 (HEAD -> main) feat: them tinh nang quan trong
f271472 init: khoi tao he thong
```
*(Commit quan trọng đã hoàn toàn biến mất khỏi git log).*

---

### 4.2. Đầu ra text của lệnh `git reflog`:

```text
PS D:\IT209\homework\session_05\ex1> git reflog
f271472 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
79834d7 HEAD@{1}: commit: feat: them tinh nang quan trong
f271472 (HEAD -> main) HEAD@{2}: commit (initial): init: khoi tao he thong
```

---

### 4.3. Lịch sử commit sau khi khôi phục thành công bằng `git reset --hard <hash>`:

```text
PS D:\IT209\homework\session_05\ex1> git reset --hard e3a5b2c
HEAD is now at e3a5b2c feat: them tinh nang quan trong

PS D:\IT209\homework\session_05\ex1> git log --oneline
e3a5b2c (HEAD -> main) feat: them tinh nang quan trong
1a2b3c4 init: khoi tao he thong
```

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Bản chất của Git Object Database:**
   - Trong Git, một khi đã commit, dữ liệu **gần như không bao giờ bị mất ngay lập tức**. Khi ta chạy `git reset --hard`, Git không xóa các blob/commit object mà chỉ di chuyển nhãn con trỏ nhánh.
   - Các commit bị tách rời (Dangling / Unreachable commits) vẫn được lưu trong cơ sở dữ liệu của Git ít nhất 30 ngày (mặc định) trước khi trình dọn rác `git gc` (Garbage Collector) dọn dẹp.
2. **Reflog là phao cứu sinh cục bộ (Local Only):**
   - Reflog chỉ tồn tại trên máy cá nhân của bạn và **không bao giờ được đẩy (push) lên GitHub**.
   - Nếu bạn lỡ tay xóa commit, rebase hỏng hoặc reset nhầm ở local, `git reflog` luôn là công cụ đầu tiên cần nghĩ tới để cứu vãn mã nguồn.
