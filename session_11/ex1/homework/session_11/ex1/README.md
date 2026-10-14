# Bài 1: Khởi tạo Workflow chạy Unit Test tự động cho Java Spring Boot với Gradle

## 1. Mục tiêu
- Thiết lập quy trình **CI (Continuous Integration)** tự động chạy kiểm thử đơn vị (**Unit Test**) cho dự án Java Spring Boot sử dụng công cụ xây dựng **Gradle**.
- Tự động hóa quá trình kích hoạt khi có sự kiện `push` lên nhánh `main`.
- Cấu hình môi trường thực thi với **Java JDK 17 (Temurin)** trên runner `ubuntu-latest`.
- Cấp quyền thực thi và chạy toàn bộ bài kiểm thử JUnit thông qua Gradle Wrapper (`./gradlew test`).

---

## 2. Cấu trúc thư mục
```text
.
├── .github/
│   └── workflows/
│       └── ci.yml             # Workflow GitHub Actions chính
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── src/
│   ├── main/java/.../DemoApplication.java
│   └── test/java/.../DemoApplicationTests.java
├── build.gradle               # Cấu hình Gradle và dependencies Spring Boot
├── gradlew                    # Gradle wrapper script cho Linux / macOS
├── gradlew.bat                # Gradle wrapper script cho Windows
├── settings.gradle
├── homework/
│   └── session_11/
│       └── ex1/
│           ├── .github/workflows/ci.yml
│           └── README.md
└── README.md
```

---

## 3. Nội dung tệp Workflow `.github/workflows/ci.yml`
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

### Giải thích các chỉ thị trong Workflow:
1. **`name: Java Spring Boot CI (Gradle)`**: Tên định danh của quy trình CI hiển thị trên giao diện GitHub Actions.
2. **`on.push.branches: [ "main" ]`**: Triggers - Kích hoạt workflow tự động mỗi khi có commit được đẩy (push) lên nhánh `main`.
3. **`runs-on: ubuntu-latest`**: Sử dụng máy chủ ảo (GitHub-hosted runner) hệ điều hành Ubuntu mới nhất.
4. **`uses: actions/checkout@v5`**: Tải toàn bộ mã nguồn của repository về môi trường runner.
5. **`uses: actions/setup-java@v5`**: Cài đặt máy ảo Java (JDK) với phiên bản `17` và nhà phân phối `temurin` (Eclipse Temurin - OpenJDK chuẩn doanh nghiệp).
6. **`chmod +x gradlew`**: Cấp quyền thực thi (`execute`) cho script wrapper `gradlew` trên môi trường Linux.
7. **`./gradlew test`**: Lệnh thực thi toàn bộ bài kiểm thử JUnit. Gradle sẽ biên dịch mã nguồn test và chạy tất cả các test case trong thư mục `src/test/java`.

---

## 4. Hướng dẫn kiểm tra và nộp bài

### Bước 1: Đẩy mã nguồn lên GitHub
```bash
git add .
git commit -m "feat: setup GitHub Actions CI workflow for Spring Boot Gradle"
git push origin main
```

### Bước 2: Theo dõi quá trình chạy trên GitHub Actions
1. Truy cập vào repository trên GitHub: `https://github.com/<owner>/<repo>/actions`.
2. Quan sát workflow `Java Spring Boot CI (Gradle)` tự động kích hoạt.
3. Nhấp vào Job **Run Unit Tests** để xem chi tiết từng bước:
   - `Checkout mã nguồn`: ✅
   - `Thiết lập môi trường Java JDK 17`: ✅
   - `Cấp quyền cho Gradle Wrapper`: ✅
   - `Thực thi JUnit Test với Gradle`: ✅ (`BUILD SUCCESSFUL`)
4. Xác nhận Job hoàn thành với biểu tượng **tích xanh (Success)**.

### Bước 3: Chụp ảnh màn hình nộp bài
- Chụp ảnh màn hình tab **Actions** hoặc chi tiết Job **Run Unit Tests** hiển thị trạng thái tích xanh kèm thông báo `BUILD SUCCESSFUL`.
