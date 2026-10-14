# Bài 3: Tối ưu tốc độ CI bằng Gradle Dependency Caching

## 1. Mục tiêu
- Cấu hình thuộc tính `cache: 'gradle'` trong bước `actions/setup-java@v5` của tệp `.github/workflows/ci.yml`.
- Kiểm nghiệm tính năng caching bằng cách thực hiện 2 lần push liên tiếp để so sánh thời gian thực thi của bước `setup-java`, `./gradlew test` và toàn bộ Job.
- Đánh giá sự khác biệt qua tệp báo cáo `report.md`.

---

## 2. Cấu trúc thư mục
```text
homework/session_11/ex3/
├── .github/
│   └── workflows/
│       └── ci.yml             # Workflow đã bổ sung cache: 'gradle'
├── report.md                  # Báo cáo so sánh thời gian và phân tích cơ chế cache
└── README.md                  # Hướng dẫn chi tiết
```

---

## 3. Cấu hình Workflow `.github/workflows/ci.yml`
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
```

---

## 4. Hướng dẫn kiểm tra thực tế
1. **Lần push 1**:
   - Push commit có chứa cấu hình `cache: 'gradle'`.
   - Quan sát tab Actions: Lần chạy này sẽ là `Cache Miss`. Cuối Job, bước `Post Set up Java` sẽ lưu cache lên GitHub storage.
2. **Lần push 2**:
   - Thực hiện một commit nhỏ bất kỳ (ví dụ chỉnh sửa một dòng comment hoặc file markdown) và push tiếp.
   - Quan sát bước `Set up Java`: Bạn sẽ thấy dòng log xác nhận:
     ```text
     Cache restored successfully from key: gradle-...
     ```
   - Tổng thời gian chạy giảm hơn 50% so với lần 1.
3. Xem chi tiết bảng so sánh số liệu thực nghiệm tại [report.md](file:///c:/Users/DoKhacQuyen/Documents/IT209/Ss11/homework/session_11/ex3/report.md).
