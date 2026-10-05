# Bài 2: Quản Lý Nhánh và Giải Quyết Xung Đột (Merge Conflict)

---

## 1. Mục Tiêu Bài Thực Hành
- **Làm chủ kỹ thuật phân nhánh (Branching Strategy):** Tạo mới và chuyển đổi qua lại giữa các nhánh (`main` và nhánh tính năng `feature-update`) để phát triển tính năng độc lập.
- **Hiểu sâu bản chất xung đột gộp (Merge Conflict):** Chủ động tái hiện tình huống xung đột khi hai nhánh cùng chỉnh sửa nội dung trên cùng một dòng của tệp tin.
- **Kỹ năng giải quyết xung đột thủ công (Manual Conflict Resolution):**
  - Đọc hiểu các ký hiệu đánh dấu xung đột tiêu chuẩn của Git: `<<<<<<< HEAD` (nhánh hiện tại), `=======` (vùng phân cách), `>>>>>>> <tên_nhánh>` (nhánh đang gộp vào).
  - Loại bỏ các ký hiệu đánh dấu và dung hòa nội dung mã nguồn theo quyết định của lập trình viên.
- **Hoàn thành commit gộp (Merge Commit):** Nắm vững cơ chế gộp 3 vùng (**3-Way Merge**) và hiển thị lịch sử nhánh phân nhánh - hợp nhất bằng lệnh `git log --graph --oneline`.

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `git checkout -b feature-update` | Tạo nhánh mới `feature-update` và chuyển con trỏ `HEAD` sang nhánh này ngay lập tức. |
| **2** | `git checkout main` (hoặc `git switch main`) | Chuyển con trỏ làm việc trở về nhánh chính `main`. |
| **3** | `git merge feature-update` | Ra lệnh gộp nhánh `feature-update` vào nhánh hiện tại (`main`). |
| **4** | `git status` | Kiểm tra các tệp tin đang bị xung đột (hiển thị trạng thái `both modified`). |
| **5** | `git add <file>` | Đánh dấu tệp tin đã được giải quyết xung đột thủ công và đưa vào Staging Area. |
| **6** | `git commit -m "merge: ..."` | Tạo commit gộp (Merge Commit) có 2 commit cha (Parents). |
| **7** | `git log --graph --oneline` | Xuất đồ thị trực quan biểu diễn quá trình rẽ nhánh và hợp nhất mã nguồn. |

---

## 3. Các Bước Triển Khai & Kịch Bản Tạo Xung Đột

### Bước 1: Khởi tạo repository và commit gốc trên nhánh `main`
Tại thư mục `session_04\ex2`, mở PowerShell:
```powershell
git init
git branch -M main
Set-Content -Path "feature.txt" -Value "Phien ban goc: He thong ban dau."
git add feature.txt
git commit -m "feat: initial commit"
```

---

### Bước 2: Tạo nhánh `feature-update` và chỉnh sửa tệp tin
```powershell
# Tạo và chuyển sang nhánh feature-update
git checkout -b feature-update

# Chỉnh sửa nội dung file feature.txt
Set-Content -Path "feature.txt" -Value "Phien ban tinh nang: Cap nhat giao dien moi boi branch feature-update."

# Commit thay đổi trên nhánh feature-update
git add feature.txt
git commit -m "feat: update UI from feature-update branch"
```

---

### Bước 3: Chuyển về nhánh `main` và chỉnh sửa trên CÙNG MỘT DÒNG
```powershell
# Chuyển về nhánh main
git checkout main

# Chỉnh sửa cùng dòng file feature.txt với nội dung khác
Set-Content -Path "feature.txt" -Value "Phien ban chinh: Cap nhat he thong boi branch main."

# Commit thay đổi trên nhánh main
git add feature.txt
git commit -m "fix: update core logic from main branch"
```

---

### Bước 4: Thực hiện gộp nhánh và Kích hoạt xung đột (Trigger Conflict)
Tại nhánh `main`, thực thi lệnh gộp:
```powershell
git merge feature-update
```

👉 **Kết quả:** Git phát hiện cả hai nhánh đều sửa đổi cùng một dòng và không thể tự động gộp (Auto-merge failed):
```text
Auto-merging feature.txt
CONFLICT (content): Merge conflict in feature.txt
Automatic merge failed; fix conflicts and then commit the result.
```

---

### Bước 5: Giải quyết xung đột thủ công (Manual Resolution)
1. Mở file `feature.txt`, Git đánh dấu xung đột như sau:
```text
<<<<<<< HEAD
Phien ban chinh: Cap nhat he thong boi branch main.
=======
Phien ban tinh nang: Cap nhat giao dien moi boi branch feature-update.
>>>>>>> feature-update
```

2. **Quy tắc xử lý:** Xóa bỏ toàn bộ các dòng `<<<<<<< HEAD`, `=======`, `>>>>>>> feature-update` và dung hòa nội dung hoàn chỉnh:
```text
Phien ban hoan chinh: Ket hop cap nhat he thong (main) va giao dien moi (feature-update).
```

3. Lưu file `feature.txt`, sau đó đưa vào Staging Area và hoàn tất commit gộp:
```powershell
git add feature.txt
git commit -m "merge: resolve merge conflict between main and feature-update"
```

---

### Bước 6: Kiểm tra đồ thị phân nhánh (Nghiệm thu đề bài)
Chạy lệnh kiểm tra lịch sử dạng đồ thị:
```powershell
git log --graph --oneline
```

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Thông báo phát hiện xung đột khi chạy lệnh `git merge`:

```text
PS D:\IT209\homework\session_04\ex2> git merge feature-update
Auto-merging feature.txt
CONFLICT (content): Merge conflict in feature.txt
Automatic merge failed; fix conflicts and then commit the result.
```

---

### 4.2. Đồ thị commit dạng nhánh (`git log --graph --oneline`):

```text
PS D:\IT209\homework\session_04\ex2> git log --graph --oneline
*   91842fe (HEAD -> main) merge: resolve merge conflict between main and feature-update
|\
| * 8aef0ea (feature-update) feat: update UI from feature-update branch
* | d9c4b32 fix: update core logic from main branch
|/
* 0342d44 feat: initial commit
PS D:\IT209\homework\session_04\ex2> 
```

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Bản chất của thuật toán 3-Way Merge trong Git:**
   - Khi gộp 2 nhánh có chung một tổ tiên xa (Common Ancestor), Git so sánh:
     1. Bản snapshot của commit chung gần nhất (**Base commit**).
     2. Bản snapshot của nhánh hiện tại (`HEAD` / `main`).
     3. Bản snapshot của nhánh muốn gộp vào (`feature-update`).
   - Nếu một dòng code chỉ bị thay đổi ở một nhánh so với Base, Git sẽ tự động gộp. Nhưng nếu dòng code đó bị thay đổi ở **cả 2 nhánh** theo 2 cách khác nhau, Git sẽ dừng lại và bàn giao quyền quyết định cho con người (Merge Conflict).
2. **Ký hiệu đánh dấu xung đột (Conflict Markers):**
   - `<<<<<<< HEAD`: Bắt đầu nội dung của nhánh bạn đang đứng (`main`).
   - `=======`: Vạch phân cách ranh giới giữa 2 sự thay đổi.
   - `>>>>>>> <branch_name>`: Kết thúc nội dung của nhánh đang được kéo về gộp.
3. **Quy tắc vàng khi xử lý xung đột trong dự án thực tế:**
   - Tuyệt đối không xóa bừa code của đồng nghiệp khi gặp conflict. Luôn trao đổi với người viết nhánh đó để hiểu rõ mục đích và dung hòa mã nguồn an toàn nhất.
