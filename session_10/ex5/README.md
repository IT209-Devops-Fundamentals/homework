# Bài 5: Tự động hóa điều phối đa dịch vụ với Docker Compose & File .env

## 1. Mục tiêu
- Chuyển đổi kiến trúc đa container (Backend + PostgreSQL) từ câu lệnh Docker CLI thủ công sang tệp khai báo `docker-compose.yml` theo chuẩn **Infrastructure as Code (IaC)**.
- Quản lý và bảo mật cấu hình, thông tin nhạy cảm (tên DB, user, password, port) bằng tệp `.env` và tệp mẫu `.env.example`.
- Thiết lập quy tắc Git qua `.gitignore` để tránh rò rỉ bí mật (secrets).
- Sử dụng chuẩn cú pháp **Docker Compose CLI v2** (`docker compose`).

---

## 2. Cấu trúc thư mục
```text
homework/session_10/ex5/
├── .dockerignore          # Loại trừ file không cần thiết khỏi build context
├── .env                   # Tệp chứa biến môi trường thực tế (bị ignore bởi git)
├── .env.example           # Tệp mẫu hướng dẫn khai báo biến môi trường
├── .gitignore             # Khai báo loại bỏ file .env khỏi Git repository
├── Dockerfile             # Dockerfile đóng gói dịch vụ backend
├── docker-compose.yml     # Khai báo điều phối đa dịch vụ (IaC)
├── package.json           # Khai báo thư viện (Express, pg)
├── server.js              # Mã nguồn API backend kết nối PostgreSQL
└── README.md              # Tài liệu hướng dẫn sử dụng và kiểm tra
```

---

## 3. Nội dung cấu hình chi tiết

### 3.1. Tệp `docker-compose.yml`
```yaml
services:
  database:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend-net

  backend:
    build: .
    restart: always
    ports:
      - "${PORT}:8080"
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      PORT: 8080
    depends_on:
      - database
    networks:
      - backend-net

volumes:
  pgdata:

networks:
  backend-net:
```

### Giải thích các chỉ thị quan trọng:
- **`services`**: Khai báo các dịch vụ thành phần trong hệ thống (`database` và `backend`).
- **`${VAR_NAME}`**: Cơ chế nội suy biến môi trường (Variable Interpolation), giá trị được đọc tự động từ tệp `.env` cùng thư mục.
- **`depends_on: - database`**: Đảm bảo dịch vụ `database` được khởi chạy trước dịch vụ `backend`.
- **`networks: - backend-net`**: Cả hai dịch vụ cùng gia nhập custom network `backend-net`, cho phép backend gọi tới DB bằng hostname `database` thông qua Docker Embedded DNS.
- **`volumes: - pgdata:/var/lib/postgresql/data`**: Mount named volume `pgdata` để đảm bảo dữ liệu của Postgres không bị mất khi hạ container.
- **`volumes:` & `networks:` (cấp độ root)**: Khai báo tài nguyên dùng chung trong toàn bộ Compose stack.

---

### 3.2. Quản lý cấu hình nhạy cảm với `.env` và `.env.example`

- **Tệp `.env.example`** (Lưu trên Git để làm tài liệu mẫu):
  ```env
  # Application Port trên máy Host
  PORT=8080

  # Cấu hình PostgreSQL Database
  DB_NAME=app_db
  DB_USER=postgres
  DB_PASSWORD=your_secure_password_here
  ```

- **Tệp `.gitignore`** (Bảo vệ thông tin bí mật):
  ```gitignore
  # Bỏ qua tệp chứa thông tin nhạy cảm và credentials
  .env

  # Bỏ qua dependencies và log
  node_modules/
  npm-debug.log
  ```

---

## 4. Hướng dẫn kiểm tra với Docker Compose CLI v2

> [!NOTE]
> Sử dụng cú pháp Docker Compose v2: dùng dấu cách `docker compose` thay vì dấu gạch nối cũ `docker-compose`.

Di chuyển vào thư mục bài tập:
```bash
cd homework/session_10/ex5
```

### Bước 1: Khởi tạo tệp `.env` từ `.env.example` (nếu chưa có)
```bash
cp .env.example .env
```

### Bước 2: Khởi chạy cụm dịch vụ ở chế độ chạy ngầm (detached)
```bash
docker compose up -d
```
> **Kết quả mong đợi:**
> Docker Compose sẽ tự động:
> 1. Tạo network `ex5_backend-net`
> 2. Tạo volume `ex5_pgdata`
> 3. Build image backend từ `Dockerfile`
> 4. Khởi chạy container `database` trước, sau đó khởi chạy `backend`.

### Bước 3: Kiểm tra trạng thái các dịch vụ
```bash
docker compose ps
```
> **Kết quả mong đợi:** Cả 2 service `backend` và `database` đều có trạng thái `running` (Up).

### Bước 4: Xem log hoạt động theo thời gian thực
```bash
docker compose logs -f
```
*(Nhấn `Ctrl + C` để thoát khỏi chế độ theo dõi log)*

### Bước 5: Kiểm tra kết quả phản hồi của API
```bash
curl -i http://localhost:8080/
```
**Kết quả mong đợi:**
```json
{
  "status": "success",
  "message": "Hello from Docker Compose multi-service backend!",
  "db_connected": true,
  "db_time": "2026-10-12T16:45:00.000Z"
}
```
API phản hồi HTTP 200 OK và xác nhận kết nối cơ sở dữ liệu thành công (`db_connected: true`).

### Bước 6: Dừng và thu hồi tài nguyên
```bash
docker compose down
```
> Lệnh này sẽ dừng và xóa an toàn các container, mạng được tạo ra nhưng vẫn giữ nguyên dữ liệu trong volume `pgdata`.

Để xóa cả volume khi cần reset dữ liệu:
```bash
docker compose down -v
```
