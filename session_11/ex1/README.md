# IT209 - Session 11: Bài 1 - Khởi tạo Workflow chạy Unit Test tự động cho Java Spring Boot với Gradle

## 1. Giới thiệu
Repository này chứa dự án Java Spring Boot (Gradle) kèm cấu hình quy trình CI tự động thông qua GitHub Actions (`.github/workflows/ci.yml`).

## 2. Thông tin bài làm
- **Bài tập**: Bài 1 - Khởi tạo Workflow chạy Unit Test tự động cho Java Spring Boot với Gradle
- **Thư mục bài tập**: `homework/session_11/ex1/`
- **Tệp kịch bản workflow**: `.github/workflows/ci.yml`

## 3. Nội dung Workflow CI
```yaml
name: Java Spring Boot CI (Gradle)

on:
  push:
    branches: [ "main" ]

jobs:
  test:
    name: Run Unit Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout mã nguồn
        uses: actions/checkout@v5

      - name: Thiết lập môi trường Java JDK 17
        uses: actions/setup-java@v5
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cấp quyền cho Gradle Wrapper
        run: chmod +x gradlew

      - name: Thực thi JUnit Test với Gradle
        run: ./gradlew test
```

Xem chi tiết hướng dẫn tại [homework/session_11/ex1/README.md](file:///c:/Users/DoKhacQuyen/Documents/IT209/Ss11/homework/session_11/ex1/README.md).
