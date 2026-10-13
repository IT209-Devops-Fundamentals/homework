# Bài 3 — Multi-stage Build và Docker Layer Cache

## Ứng dụng

Đây là Java HTTP API tối giản dùng PostgreSQL JDBC. `GET /api/health` kiểm tra API; `POST /api/records` ghi một dòng và `GET /api/records` đọc lại dữ liệu. Java 21 được dùng ở cả hai cách build.

## Cấu trúc build

`Dockerfile.single` giữ Maven, JDK, dependency cache và sản phẩm build trong image cuối. `Dockerfile` có builder stage: Maven build tools/dependencies được tải sau khi chỉ copy `pom.xml`; source code được copy sau để thay đổi mã nguồn không làm mất layer cache dependency. Runtime stage dùng Alpine và một JRE nhỏ được tạo bằng `jlink`, sau đó chỉ nhận JRE cùng executable JAR từ builder.

## Build và kiểm tra API

```bash
docker build -f Dockerfile.single -t hw-backend:single .
docker build -t hw-backend:multistage .
docker run -d --name hw-backend-test -p 8081:3000 hw-backend:multistage
curl http://localhost:8081/api/health
docker rm -f hw-backend-test
```

Health response mong đợi: `{"status":"UP"}`. API records cần có PostgreSQL; ví dụ chạy chung network/DB trong Bài 4.

## So sánh image và layer

Không điền số đo chưa được tạo bởi Docker engine. Sau khi build hai image, lấy số liệu thực tế bằng:

```bash
docker image inspect hw-backend:single hw-backend:multistage --format '{{.RepoTags}} size={{.Size}} bytes layers={{len .RootFS.Layers}}'
docker images | grep hw-backend
```

| Image                   | Nội dung chính                        |                               Dung lượng đo được |               Số layer đo được |
| ----------------------- | ------------------------------------- | -----------------------------------------------: | -----------------------------: |
| `hw-backend:single`     | Maven + JDK + dependencies + ứng dụng |                   Điền từ `docker image inspect` | Điền từ `docker image inspect` |
| `hw-backend:multistage` | Alpine + JRE `jlink` + executable JAR | Điền từ `docker image inspect`; mục tiêu <100 MB | Điền từ `docker image inspect` |

Tỷ lệ giảm dung lượng được tính bằng `(single - multistage) / single × 100%`. Image cuối thường có ít layer ứng dụng hơn vì không mang theo Maven/JDK builder; số layer thực tế phụ thuộc manifest các image nền và được lệnh trên đo trực tiếp.
