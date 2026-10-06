# Bài 3: Xử Lý Xung Đột Phức Tạp Trong Quá Trình Rebase

---

## 1. Mục Tiêu Bài Thực Hành
- **Hiểu sâu bản chất cơ chế "Tái hiện commit" (Commit Replay) của Git Rebase:**
  - Khác với `git merge` (chỉ giải quyết xung đột **1 lần duy nhất** tại commit gộp), `git rebase` bóc tách từng commit của nhánh tính năng và áp dụng tuần tự (Replay) lên trên đỉnh của nhánh đích.
  - Xung đột có thể xuất hiện tại **từng commit** trong quá trình replay, đòi hỏi kỹ sư phải giải quyết xung đột theo từng chặng (Step-by-step resolution).
- **Làm chủ quy trình xử lý xung đột trong Rebase:**
  - Phát hiện conflict ➔ Sửa thủ công ➔ `git add <file>` ➔ `git rebase --continue` (**tuyệt đối không dùng `git commit`**).
  - Sử dụng các tùy chọn cứu hộ khi cần: `git rebase --abort` (hủy bỏ quay về trạng thái cũ) hoặc `git rebase --skip`.
- **Đạt được lịch sử thẳng hàng (Linear Git History):** Sau khi rebase thành công, toàn bộ commit của nhánh `feature-api` nối tiếp ngay sau commit mới nhất của `main` mà không tạo ra bất kỳ merge commit rác nào.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `git rebase main` | Ra lệnh nhấc toàn bộ nhánh hiện tại (`feature-api`) đặt lên trên đỉnh của nhánh `main`. |
| **2** | `git status` | Xác định commit đang bị tạm dừng do xung đột và các tệp tin `both modified`. |
| **3** | `git add <file>` | Đánh dấu tệp tin đã giải quyết xung đột ở commit hiện tại. |
| **4** | `git rebase --continue` | Tiếp tục tiến trình Rebase sang commit tiếp theo sau khi đã `add` bản vá. |
| **5** | `git rebase --abort` | Lệnh khẩn cấp: Hủy bỏ toàn bộ quá trình rebase, khôi phục nhánh về nguyên trạng trước khi rebase. |
| **6** | `git log --graph --oneline` | Kiểm tra cây lịch sử dạng thẳng hàng (Linear Graph). |

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Khởi tạo repository và commit ban đầu trên `main`
Mở PowerShell tại thư mục `session_05\ex3`:
```powershell
cd d:\IT209\homework\session_05\ex3
git init
git branch -M main

# Tạo file config.json ban đầu
Set-Content -Path "config.json" -Value @'
{
  "port": 8080,
  "debug": false
}
'@
git add config.json
git commit -m "init config"
```

---

### Bước 2: Tạo nhánh `feature-api` và thực hiện 2 commit
```powershell
# Tạo và chuyển sang nhánh feature-api
git checkout -b feature-api

# Commit 1 trên feature-api: Đổi port thành 9000
Set-Content -Path "config.json" -Value @'
{
  "port": 9000,
  "debug": false
}
'@
git add config.json
git commit -m "feat: change port"

# Commit 2 trên feature-api: Bật debug thành true
Set-Content -Path "config.json" -Value @'
{
  "port": 9000,
  "debug": true
}
'@
git add config.json
git commit -m "feat: enable debug"
```

---

### Bước 3: Chuyển về `main` và thực hiện 2 commit đi trước
```powershell
git checkout main

# Commit 1 trên main: Đổi port thành 8081
Set-Content -Path "config.json" -Value @'
{
  "port": 8081,
  "debug": false
}
'@
git add config.json
git commit -m "update port on main"

# Commit 2 trên main: Bổ sung thêm trường env
Set-Content -Path "config.json" -Value @'
{
  "port": 8081,
  "debug": false,
  "env": "production"
}
'@
git add config.json
git commit -m "add env config"
```

---

### Bước 4: Chuyển sang `feature-api` và kích hoạt Rebase
```powershell
git checkout feature-api
git rebase main
```

👉 **Xung đột Chặng 1 bùng nổ:** Git đang cố gắng áp dụng commit đầu tiên `feat: change port` nhưng dòng `"port"` trên `main` đã thành `8081`.
```text
Auto-merging config.json
CONFLICT (content): Merge conflict in config.json
error: could not apply a1b2c3d... feat: change port
```

---

### Bước 5: Giải quyết xung đột Chặng 1 & Tiếp tục Rebase
1. Mở file `config.json`, Git đánh dấu xung đột giữa `8081` (từ main) và `9000` (từ feature-api).
2. Chúng ta sửa lại kết hợp: giữ `port: 9000` và bảo toàn trường `env: "production"` từ main:
```powershell
Set-Content -Path "config.json" -Value @'
{
  "port": 9000,
  "debug": false,
  "env": "production"
}
'@
```

3. Đưa vào Staging và ra lệnh tiếp tục Rebase:
```powershell
git add config.json
git rebase --continue
```

👉 **Xung đột Chặng 2 tiếp tục xuất hiện:** Git áp dụng commit tiếp theo `feat: enable debug` và gặp xung đột ở dòng `"debug"`!
```text
Auto-merging config.json
CONFLICT (content): Merge conflict in config.json
error: could not apply b2c3d4e... feat: enable debug
```

---

### Bước 6: Giải quyết xung đột Chặng 2 & Hoàn tất Rebase
1. Mở file `config.json`, chỉnh sửa dung hòa hoàn chỉnh (chọn `"debug": true`, giữ `"port": 9000` và `"env": "production"`):
```powershell
Set-Content -Path "config.json" -Value @'
{
  "port": 9000,
  "debug": true,
  "env": "production"
}
'@
```

2. Đưa vào Staging và kết thúc Rebase:
```powershell
git add config.json
git rebase --continue
```

👉 **Kết quả:** Git in ra thông báo hoàn tất:
```text
Applying: feat: enable debug
Successfully rebased and updated refs/heads/feature-api.
```

---

### Bước 7: Kiểm tra đồ thị lịch sử thẳng hàng (Nghiệm thu đề bài)
Chạy lệnh kiểm tra lịch sử:
```powershell
git log --graph --oneline
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Thông báo lỗi conflict và tiến trình Rebase:

```text
PS D:\IT209\homework\session_05\ex3> git rebase main
Auto-merging config.json
CONFLICT (content): Merge conflict in config.json
error: could not apply 7a8b9c0... feat: change port
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".

PS D:\IT209\homework\session_05\ex3> git add config.json
PS D:\IT209\homework\session_05\ex3> git rebase --continue
Auto-merging config.json
CONFLICT (content): Merge conflict in config.json
error: could not apply 8b9c0d1... feat: enable debug

PS D:\IT209\homework\session_05\ex3> git add config.json
PS D:\IT209\homework\session_05\ex3> git rebase --continue
Applying: feat: enable debug
Successfully rebased and updated refs/heads/feature-api.
```

---

### 4.2. Đồ thị commit thẳng hàng (`git log --graph --oneline`):

```text
PS D:\IT209\homework\session_05\ex3> git log --graph --oneline
* f4e5d6c (HEAD -> feature-api) feat: enable debug
* e3d2c1b feat: change port
* d2c1b0a (main) add env config
* c1b0a9f update port on main
* b0a9f8e init config
```
*(Toàn bộ các commit của `feature-api` nằm nối tiếp ngay sau các commit mới nhất của `main`, tạo thành một đường thẳng tắp không có rẽ nhánh hay merge commit).*

---

## 5. Đánh Giá & So Sánh Chuyên Sâu: Merge vs Rebase

| Tiêu chí | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| **Xử lý xung đột** | Diễn ra **1 lần duy nhất** tại thời điểm gộp. | Diễn ra **từng bước tại từng commit** bị xung đột trong quá trình replay. |
| **Hình thái lịch sử** | Phân nhánh và hợp nhất (Non-linear), tạo ra 1 Merge Commit phụ. | Tuyến tính thẳng hàng (Linear History), giữ lịch sử cực kỳ sạch sẽ và dễ đọc. |
| **Mã Hash của Commit** | Giữ nguyên mã hash của tất cả commit cũ. | **Tạo ra mã hash hoàn toàn mới** cho các commit được áp dụng lại. |
| **Trường hợp áp dụng** | Khi tích hợp nhánh lớn vào nhánh chính (`main`, `master`) để lưu vết thời điểm tích hợp. | Khi muốn đồng bộ code mới nhất từ `main` về nhánh tính năng cá nhân trước khi mở Pull Request. |
