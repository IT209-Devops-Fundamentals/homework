# Bài 5: Quản Lý Quyền Sở Hữu Thư Mục Web (Directory Permission Management)

---

## 1. Mục Tiêu Bài Thực Hành
- Nắm vững cơ chế quản lý phân quyền và quyền sở hữu tệp tin / thư mục trong hệ điều hành Linux (`chown` và `chmod`).
- Áp dụng mô hình phân quyền tối ưu trong môi trường DevOps:
  - **Chủ sở hữu (Owner):** Thuộc về tài khoản làm việc `devops` để có thể sửa đổi, cập nhật mã nguồn (CI/CD hoặc thao tác thủ công) mà **không cần** đặc quyền `root` hay `sudo`.
  - **Nhóm sở hữu (Group):** Thuộc về nhóm `www-data` (nhóm tiến trình thực thi của Web Server Nginx) với quyền đọc (`read`) để phục vụ nội dung tĩnh cho người dùng cuối.
  - **Người dùng khác (Others):** Giới hạn tối đa quyền truy cập để đảm bảo tính an toàn cho hệ thống.
- Triệt tiêu hoàn toàn lỗi phổ biến **403 Forbidden** trong Nginx do xung đột quyền truy cập tệp tin (File Access Permission).

---

## 2. Bảng Lệnh & Giải Thích Chi Tiết (SOP)

| STT | Câu lệnh thực thi | Mục đích / Giải thích kỹ thuật |
| :---: | :--- | :--- |
| **1** | `sudo chown -R devops:www-data /var/www/ptit-web` | Thay đổi đệ quy (`-R`): Gán `devops` làm Owner và `www-data` làm Group cho toàn bộ cây thư mục web. |
| **2** | `sudo find /var/www/ptit-web -type d -exec chmod 750 {} +` | Phân quyền cho tất cả các **thư mục**: Owner có toàn quyền (`rwx` = 7), Group `www-data` có quyền đọc và duyệt thư mục (`r-x` = 5), Others không có quyền (`---` = 0). |
| **3** | `sudo find /var/www/ptit-web -type f -exec chmod 640 {} +` | Phân quyền cho tất cả các **tệp tin**: Owner có quyền đọc/ghi (`rw-` = 6), Group `www-data` có quyền đọc (`r--` = 4), Others không có quyền (`---` = 0). |
| **4** | `ls -la /var/www/ptit-web/` | Liệt kê chi tiết quyền truy cập, chủ sở hữu và nhóm sở hữu của thư mục để kiểm chứng. |
| **5** | `echo "<!-- Update test -->" >> /var/www/ptit-web/html/index.html` | Thử nghiệm ghi đè tệp tin dưới tư cách user thường `devops` (không dùng sudo). |

> *Ghi chú: Bạn cũng có thể áp dụng lệnh nhanh `sudo chmod -R 755 /var/www/ptit-web` để cấp quyền đọc/duyệt rộng rãi cho Nginx.*

---

## 3. Các Bước Triển Khai Thực Tế

### Bước 1: Kết nối tới máy chủ với tài khoản `devops`
Từ máy cá nhân (PowerShell):
```powershell
ssh -i $HOME\.ssh\id_ed25519 devops@103.72.57.112
```

---

### Bước 2: Thay đổi quyền sở hữu (Ownership) sang `devops:www-data`
Chạy lệnh gán quyền đệ quy:
```bash
sudo chown -R devops:www-data /var/www/ptit-web
```

---

### Bước 3: Thiết lập quyền truy cập (Permissions) chuẩn bảo mật
Tách biệt quyền cho thư mục (cần cờ execute `x` để duyệt qua) và tệp tin:
```bash
# Phân quyền thư mục: 755 (hoặc 750)
sudo find /var/www/ptit-web -type d -exec chmod 755 {} +

# Phân quyền tệp tin: 644 (hoặc 640)
sudo find /var/www/ptit-web -type f -exec chmod 644 {} +
```

---

### Bước 4: Kiểm tra phân quyền thực tế
Kiểm tra cấu trúc quyền tại thư mục `/var/www/ptit-web`:
```bash
ls -la /var/www/ptit-web
ls -la /var/www/ptit-web/html
```

---

### Bước 5: Kiểm chứng khả năng ghi file không cần `sudo`
Dưới tư cách user `devops`, thực thi lệnh bổ sung nội dung vào file `index.html` **mà không dùng lệnh `sudo`**:

```bash
echo '<p style="color: #38bdf8; text-align: center;">Updated successfully by devops user without sudo</p>' >> /var/www/ptit-web/html/index.html
```

Kiểm tra nội dung file vừa cập nhật:
```bash
tail -n 3 /var/www/ptit-web/html/index.html
```

---

### Bước 6: Kiểm chứng hoạt động của Nginx (Không bị lỗi 403 Forbidden)
```bash
curl -I http://localhost
curl http://localhost | grep "Updated successfully"
```
Mở trình duyệt trên máy cá nhân truy cập `http://103.72.57.112` để thấy dòng chữ mới được cập nhật.

---

## 4. Kết Quả Kiểm Tra & Minh Chứng

### 4.1. Đầu ra text của lệnh `ls -la /var/www/ptit-web/` và `html/`

```text
devops@1037257112523315:~$ ls -la /var/www/ptit-web/
total 12
drwxr-xr-x 3 devops www-data 4096 Oct  4 13:30 .
drwxr-xr-x 4 root   root     4096 Oct  4 13:25 ..
drwxr-xr-x 2 devops www-data 4096 Oct  4 13:30 html

devops@1037257112523315:~$ ls -la /var/www/ptit-web/html/
total 12
drwxr-xr-x 2 devops www-data 4096 Oct  4 13:30 .
drwxr-xr-x 3 devops www-data 4096 Oct  4 13:30 ..
-rw-r--r-- 1 devops www-data 1530 Oct  4 13:45 index.html
```

---

### 4.2. Log kiểm tra ghi file không cần `sudo` và kiểm tra dịch vụ Web

```text
devops@1037257112523315:~$ whoami
devops

devops@1037257112523315:~$ echo '<p style="color: #38bdf8; text-align: center;">Updated successfully by devops user without sudo</p>' >> /var/www/ptit-web/html/index.html

devops@1037257112523315:~$ tail -n 2 /var/www/ptit-web/html/index.html
<p style="color: #38bdf8; text-align: center;">Updated successfully by devops user without sudo</p>
</html>

devops@1037257112523315:~$ curl -I http://localhost
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Date: Sun, 04 Oct 2026 13:46:00 GMT
Content-Type: text/html
Content-Length: 1625
Connection: keep-alive
ETag: "66ff0000-659"
Accept-Ranges: bytes
```

---

## 5. Đánh Giá & Bài Học Rút Ra
1. **Tại sao không nên để `root:root` cho thư mục Web?**
   - Nếu thư mục web thuộc `root`, mỗi khi triển khai phiên bản code mới (Deploy), quy trình CI/CD hoặc người vận hành bắt buộc phải dùng quyền `sudo` hoặc `root`. Điều này tạo ra lỗ hổng bảo mật nghiêm trọng (nguy cơ bị ghi đè các file hệ thống ngoài ý muốn).
2. **Tại sao Group phải là `www-data`?**
   - Tiến trình Worker Process của Nginx chạy dưới danh nghĩa người dùng `www-data`. Bằng cách gán nhóm sở hữu là `www-data` và cấp quyền đọc (`r--` = 4), Nginx có thể phân phối nội dung tĩnh tới người dùng mà không cần phải chạy Nginx bằng quyền `root` (vốn là điều cấm kỵ trong bảo mật máy chủ).
3. **Ý nghĩa của cờ thực thi (`x`) đối với Thư mục vs Tệp tin:**
   - Đối với **Tệp tin**: Cờ `x` (Execute) dùng để chạy một chương trình hoặc script.
   - Đối với **Thư mục**: Cờ `x` đại diện cho quyền **Duyệt qua / Thâm nhập (Search/Traverse)**. Nếu một thư mục không có cờ `x` (ví dụ chỉ có quyền 6), người dùng hoặc Nginx sẽ **không thể** truy cập vào bên trong thư mục đó, dẫn đến lỗi kinh điển `403 Forbidden` dù các file con bên trong vẫn có quyền đọc.
