# Bài 4: Thiết lập Custom Network & Named Volume bằng Docker CLI

## 1. Mục tiêu
- **Custom Bridge Network (`app-net`)**: Cho phép các container trong cùng mạng giao tiếp nội bộ thông qua tên container (DNS Resolution/Service Discovery) mà không cần phụ thuộc vào địa chỉ IP tĩnh.
- **Named Volume (`db-data`)**: Đảm bảo tính toàn vẹn và bền vững của dữ liệu cơ sở dữ liệu (Data Persistence), dữ liệu không bị mất khi container bị dừng hoặc xóa hoàn toàn.
- **Kết nối Backend & Database**: Mô phỏng kiến trúc 2 tầng (Backend Web API + PostgreSQL Database) bằng Docker CLI thủ công.

---

## 2. Cấu trúc thư mục
```text
homework/session_10/ex4/
├── commands.sh        # Script tự động hóa toàn bộ quy trình thiết lập & kiểm thử
└── README.md          # Tài liệu giải thích chi tiết câu lệnh, cơ chế và kết quả
```

---

## 3. Các bước thực hiện và giải thích câu lệnh

### Bước 1: Tạo Custom Bridge Network
```bash
docker network create app-net
```
- **Ý nghĩa**: Mặc định, `default bridge network` của Docker không hỗ trợ phân giải DNS tự động bằng tên container. Tạo Custom Network (`app-net`) kích hoạt tính năng **Embedded DNS Server** của Docker, giúp các container tự động tìm thấy nhau qua hostname là tên container.

### Bước 2: Tạo Named Volume lưu trữ dữ liệu
```bash
docker volume create db-data
```
- **Ý nghĩa**: Named Volume được quản lý bởi Docker Engine (thường lưu trữ tại `/var/lib/docker/volumes/` trên host). Vòng đời của volume độc lập hoàn toàn với vòng đời của container.

### Bước 3: Khởi chạy Database Container (`db-server`)
```bash
docker run -d \
  --name db-server \
  --network app-net \
  -v db-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=testdb \
  postgres:15-alpine
```
- `--name db-server`: Đặt tên container là `db-server` (đây cũng chính là hostname trong mạng `app-net`).
- `--network app-net`: Gắn container vào custom network đã tạo.
- `-v db-data:/var/lib/postgresql/data`: Mount volume `db-data` vào thư mục chứa dữ liệu của PostgreSQL.
- `-e POSTGRES_*`: Thiết lập thông tin khởi tạo database, user và mật khẩu.

### Bước 4: Khởi chạy Backend Container (`app-container`)
```bash
docker run -d \
  --name app-container \
  --network app-net \
  -e DB_HOST=db-server \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=testdb \
  node:18-alpine tail -f /dev/null
```
- Container backend tham gia cùng mạng `app-net`.
- Truyền biến môi trường kết nối database với hostname `DB_HOST=db-server`. Nhờ DNS resolution của Docker, `app-container` sẽ phân giải `db-server` thành địa chỉ IP nội bộ của container cơ sở dữ liệu.

---

## 4. Kiểm tra và Kiểm thử

### 4.1. Kiểm tra DNS Resolution (giao tiếp nội bộ)
Thực thi lệnh `ping` từ `app-container` tới `db-server`:
```bash
docker exec -it app-container ping -c 2 db-server
```
**Kết quả mong đợi:**
```text
PING db-server (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.084 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.091 ms

--- db-server ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
```
> Tên miền `db-server` được phân giải thành công sang IP nội bộ (ví dụ: `172.18.0.2`).

---

### 4.2. Kiểm thử Data Persistence (Bảo toàn dữ liệu)

#### Bước A: Thêm dữ liệu vào database hiện tại
```bash
docker exec -i db-server psql -U postgres -d testdb -c "
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (name) VALUES ('Nguyen Van A'), ('Tran Thi B');
"
```
Xem dữ liệu vừa thêm:
```bash
docker exec -i db-server psql -U postgres -d testdb -c "SELECT * FROM users;"
```
Kết quả hiển thị:
```text
 id |     name     |         created_at         
----+--------------+----------------------------
  1 | Nguyen Van A | 2026-10-12 16:30:00.123456
  2 | Tran Thi B   | 2026-10-12 16:30:00.123456
(2 rows)
```

#### Bước B: Xóa cứng (force delete) Database Container
```bash
docker rm -f db-server
```
Kiểm tra container đã bị xóa hoàn toàn khỏi danh sách:
```bash
docker ps -a | grep db-server
```

#### Bước C: Khởi chạy container DB mới gắn cùng Volume `db-data`
```bash
docker run -d \
  --name db-server \
  --network app-net \
  -v db-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=testdb \
  postgres:15-alpine
```

#### Bước D: Truy vấn kiểm tra dữ liệu sau khi tái tạo container
```bash
docker exec -i db-server psql -U postgres -d testdb -c "SELECT * FROM users;"
```
**Kết quả mong đợi:**
```text
 id |     name     |         created_at         
----+--------------+----------------------------
  1 | Nguyen Van A | 2026-10-12 16:30:00.123456
  2 | Tran Thi B   | 2026-10-12 16:30:00.123456
(2 rows)
```
> ✅ **Kết luận**: Dữ liệu bảng `users` vẫn nguyên vẹn 100%, chứng minh Named Volume `db-data` hoạt động chính xác và bảo toàn dữ liệu độc lập với container.

---

### 4.3. Các lệnh kiểm tra thông tin Docker CLI
```bash
# 1. Kiểm tra Network app-net đã tồn tại
docker network ls | grep app-net

# 2. Kiểm tra Volume db-data đã tồn tại
docker volume ls | grep db-data

# 3. Xem chi tiết cấu hình và danh sách container trong app-net
docker network inspect app-net
```

---

## 5. Hướng dẫn chạy tự động bằng `commands.sh`

Cấp quyền thực thi và chạy script tự động:
```bash
cd homework/session_10/ex4
chmod +x commands.sh
./commands.sh
```

---

## 6. Dọn dẹp môi trường (Cleanup)
Sau khi hoàn tất kiểm tra, thực hiện dọn dẹp các tài nguyên:
```bash
# Dừng và xóa các container
docker rm -f app-container db-server

# Xóa custom network
docker network rm app-net

# Xóa named volume (chỉ khi muốn xóa sạch dữ liệu)
docker volume rm db-data
```
