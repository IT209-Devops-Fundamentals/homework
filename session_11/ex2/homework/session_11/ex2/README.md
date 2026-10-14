# Bài 2: Biên dịch đóng gói tệp ứng dụng .jar với Gradle và lưu trữ Artifacts

## 1. Mục tiêu
- Thực thi câu lệnh biên dịch và đóng gói ứng dụng Spring Boot thành tệp thực thi `.jar` bằng Gradle Wrapper (`./gradlew bootJar`).
- Tự động lưu trữ thành phẩm biên dịch (`.jar`) từ thư mục `build/libs/` lên GitHub Actions bằng Action `actions/upload-artifact@v4`.
- Đảm bảo thành phẩm có thể tải về (download) trực tiếp tại phần **Summary** của luồng chạy trên tab Actions.

---

## 2. Cấu trúc thư mục
```text
homework/session_11/ex2/
├── .github/
│   └── workflows/
│       └── ci.yml             # Kịch bản workflow đã bổ sung bootJar & upload-artifact
└── README.md                  # Hướng dẫn chi tiết các bước thực hiện và kiểm tra
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

### Chi tiết các bước bổ sung:
1. **`./gradlew bootJar`**:
   - Sử dụng Spring Boot Gradle Plugin để đóng gói toàn bộ ứng dụng cùng với các dependencies thành một tệp "fat JAR" / "executable JAR" độc lập tại thư mục `build/libs/`.
2. **`actions/upload-artifact@v4`**:
   - `name: app-jar`: Đặt tên gói artifact lưu trữ trên GitHub Actions là `app-jar`.
   - `path: build/libs/*.jar`: Chỉ định tệp JAR đầu ra cần lưu trữ từ thư mục `build/libs/`.

---

## 4. Hướng dẫn kiểm tra và nộp bài

### Bước 1: Commit và đẩy mã nguồn lên nhánh `main`
```bash
git add .
git commit -m "feat: add bootJar and upload-artifact steps to CI workflow"
git push origin main
```

### Bước 2: Kiểm tra kết quả trên GitHub Actions
1. Mở repository trên GitHub và chuyển tới tab **Actions**: `https://github.com/<owner>/<repo>/actions`.
2. Chọn lần chạy mới nhất của workflow `Java Spring Boot CI (Gradle)`.
3. Kiểm tra các bước thực thi trong Job:
   - Bước `Đóng gói tệp JAR với Gradle` hoàn tất thành công (`BUILD SUCCESSFUL`).
   - Bước `Lưu trữ thành phẩm JAR Artifact` tải tệp `.jar` lên GitHub Artifact Storage thành công.
4. Cuộn xuống phần **Artifacts** ở trang **Summary** của lần chạy:
   - Xuất hiện mục **app-jar** cho phép nhấp để tải file `.zip` chứa file `.jar` về máy tính.

### Bước 3: Sản phẩm nộp bài
- Tệp kịch bản `.github/workflows/ci.yml`.
- Ảnh chụp màn hình trang **Summary** trên tab Actions hiển thị Job tích xanh và mục Artifact `app-jar`.
