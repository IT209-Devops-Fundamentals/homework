#!/bin/bash
set -e

echo "=========================================================="
echo " Bài 4: Thiết lập Custom Network & Named Volume (Docker CLI)"
echo "=========================================================="

# 1. Tạo Custom Bridge Network tên app-net
echo "[1/7] Tạo Custom Bridge Network: app-net"
docker network create app-net || true

# 2. Tạo Named Volume tên db-data
echo "[2/7] Tạo Named Volume: db-data"
docker volume create db-data || true

# 3. Khởi chạy Database Container (postgres:15-alpine) tên db-server
echo "[3/7] Khởi chạy Database Container: db-server"
docker run -d \
  --name db-server \
  --network app-net \
  -v db-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=testdb \
  postgres:15-alpine

# Đợi PostgreSQL khởi động hoàn tất
echo "Đang đợi PostgreSQL sẵn sàng..."
sleep 5

# 4. Khởi chạy Backend Container tham gia app-net
echo "[4/7] Khởi chạy Backend Container: app-container"
docker run -d \
  --name app-container \
  --network app-net \
  -e DB_HOST=db-server \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=testdb \
  node:18-alpine tail -f /dev/null

# 5. Kiểm tra DNS Resolution (giao tiếp nội bộ qua service name)
echo "[5/7] Kiểm tra kết nối từ app-container tới db-server bằng hostname:"
docker exec -it app-container ping -c 2 db-server

# 6. Kiểm thử Data Persistence
echo "[6/7] Thực hiện test tính bền vững của dữ liệu (Data Persistence):"
echo "--- 6.1: Tạo bảng và thêm dữ liệu vào db-server ban đầu ---"
docker exec -i db-server psql -U postgres -d testdb -c "
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (name) VALUES ('Nguyen Van A'), ('Tran Thi B');
"

echo "--- Dữ liệu hiện tại trong DB: ---"
docker exec -i db-server psql -U postgres -d testdb -c "SELECT * FROM users;"

echo "--- 6.2: Xóa cứng (force remove) container db-server ---"
docker rm -f db-server

echo "--- 6.3: Khởi chạy container db-server mới gắn cùng Volume db-data ---"
docker run -d \
  --name db-server \
  --network app-net \
  -v db-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=testdb \
  postgres:15-alpine

echo "Đang đợi container db-server mới khởi động..."
sleep 5

echo "--- 6.4: Xác minh dữ liệu không bị mất sau khi tái tạo container ---"
docker exec -i db-server psql -U postgres -d testdb -c "SELECT * FROM users;"

# 7. Các lệnh kiểm tra thông tin Docker
echo "[7/7] Kiểm tra thông tin cấu hình Network & Volume:"
echo "--- Danh sách Network ---"
docker network ls | grep app-net

echo "--- Danh sách Volume ---"
docker volume ls | grep db-data

echo "--- Inspect Network app-net ---"
docker network inspect app-net

echo "=========================================================="
echo " Hoàn tất kịch bản kiểm tra Bài 4 thành công!"
echo "=========================================================="
