# Bài 4: Khai báo GitHub Secrets và cấu hình Đăng nhập Container Registry

## 1. Mục tiêu
- **Quản lý bí mật (Secrets Management)**: Sử dụng GitHub Repository Secrets để lưu trữ Personal Access Token (PAT) một cách an toàn, tránh để lộ credentials nhạy cảm trong mã nguồn công khai.
- **Xác thực Container Registry**: Tự động hóa bước xác thực đăng nhập vào **GitHub Container Registry (ghcr.io)** trên runner GitHub Actions bằng action chính thức `docker/login-action@v3`.

---

## 2. Cấu trúc thư mục
```text
homework/session_11/ex4/
├── .github/
│   └── workflows/
│       └── ci.yml             # Workflow đã cấu hình bước docker/login-action@v3
└── README.md                  # Hướng dẫn chi tiết tạo Secrets và kiểm tra đăng nhập
```

---

## 3. Quản lý bí mật: Biến `REGISTRY_TOKEN`

### 3.1. Trạng thái Secret trên Repository
Biến bí mật **`REGISTRY_TOKEN`** đã được khởi tạo và mã hóa an toàn trên repository:
- **Repository:** `https://github.com/DoKhacQuyen94/IT209_Session11_HW_baitap01`
- **Tên bí mật (Secret Name):** `REGISTRY_TOKEN`
- **Đường dẫn xem trên GitHub:** **Settings** ➔ **Secrets and variables** ➔ **Actions** ➔ **Repository secrets**.

### 3.2. Quyền hạn cần thiết của Token
Token sử dụng cho `REGISTRY_TOKEN` cần có các quyền tối thiểu:
- `write:packages`: Cho phép upload (push) container images lên GHCR.
- `read:packages`: Cho phép tải (pull) container images từ GHCR.

---

## 4. Cấu hình Workflow `.github/workflows/ci.yml`

```yaml
name: Java Spring Boot CI (Gradle)

on:
  push:
    branches: [ "main" ]

jobs:
  test:
    name: Run Unit Tests & Build Artifact
    runs-on: ubuntu-latest

    steps:
      - name: Checkout mã nguồn
        uses: actions/checkout@v5

      - name: Thiết lập môi trường Java JDK 17
        uses: actions/setup-java@v5
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: 'gradle'

      - name: Cấp quyền cho Gradle Wrapper
        run: chmod +x gradlew

      - name: Thực thi JUnit Test với Gradle
        run: ./gradlew test

      - name: Đóng gói tệp JAR với Gradle
        run: ./gradlew bootJar

      - name: Lưu trữ thành phẩm JAR Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-jar
          path: build/libs/*.jar

      - name: Đăng nhập vào GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.REGISTRY_TOKEN }}
```

### Giải thích các tham số trong bước `docker/login-action@v3`:
- **`registry: ghcr.io`**: Địa chỉ máy chủ lưu trữ Container Registry của GitHub.
- **`username: ${{ github.actor }}`**: Biến môi trường mặc định của GitHub Actions, tự động lấy username của người kích hoạt workflow (`DoKhacQuyen94`).
- **`password: ${{ secrets.REGISTRY_TOKEN }}`**: Lấy giá trị token được bảo mật từ Repository Secret, GitHub Actions sẽ tự động mask (che dấu dạng `***`) trong log để tránh lộ thông tin bí mật.

---

## 5. Hướng dẫn kiểm tra và nộp bài

### Bước 1: Chụp ảnh màn hình mục Repository Secrets
1. Truy cập: [https://github.com/DoKhacQuyen94/IT209_Session11_HW_baitap01/settings/secrets/actions](https://github.com/DoKhacQuyen94/IT209_Session11_HW_baitap01/settings/secrets/actions).
2. Chụp ảnh màn hình danh sách **Repository secrets** hiển thị rõ ràng biến **`REGISTRY_TOKEN`**.

### Bước 2: Kiểm tra kết quả đăng nhập trên tab Actions
1. Vào tab **Actions** tại: [https://github.com/DoKhacQuyen94/IT209_Session11_HW_baitap01/actions](https://github.com/DoKhacQuyen94/IT209_Session11_HW_baitap01/actions).
2. Mở lần chạy mới nhất của workflow.
3. Nhấp vào bước **Đăng nhập vào GitHub Container Registry**, xác nhận log xuất hiện thông báo:
   ```text
   Run docker/login-action@v3
     with:
       registry: ghcr.io
       username: DoKhacQuyen94
       password: ***
   Logging into ghcr.io...
   Login Succeeded!
   ```
4. Job hoàn thành với **tích xanh (Success)**.

### Bước 3: Sản phẩm nộp bài
- Tệp kịch bản `.github/workflows/ci.yml`.
- Ảnh chụp màn hình mục **Repository Secrets** hiển thị biến `REGISTRY_TOKEN`.
- Ảnh chụp log bước `Đăng nhập vào GitHub Container Registry` hiển thị `Login Succeeded!`.
