# BÁO CÁO KẾT QUẢ THỰC HIỆN BÀI 5
## NỐI JOB TỰ ĐỘNG BUILD & PUSH DOCKER IMAGE SAU KHI TEST GRADLE XANH

- **Học phần:** DevOps Fundamental (PTIT IT209 - Session 11)
- **Bài tập:** Bài 5 - Nối Job tự động Build & Push Docker Image sau khi Test Gradle xanh
- **Dự án:** Ứng dụng Java Spring Boot (Gradle Wrapper)
- **Tệp kịch bản workflow:** [.github/workflows/ci.yml](file:///.github/workflows/ci.yml)
- **Tệp Dockerfile:** [Dockerfile](file:///Dockerfile)
- **Container Registry:** GitHub Container Registry (GHCR - `ghcr.io`)
- **Ràng buộc phụ thuộc:** `needs: test`

---

### 1. Mục tiêu bài thực hành

1. **Phân tách luồng CI thành các Job độc lập (Separation of Concerns)**:
   - Phân chia pipeline CI thành 2 Jobs riêng biệt với trách nhiệm rõ ràng:
     - **Job `test`**: Đảm nhiệm kiểm thử tự động (`./gradlew test`), biên dịch đóng gói JAR (`./gradlew bootJar`) và lưu trữ artifact.
     - **Job `docker-build`**: Đảm nhiệm chuẩn bị môi trường Docker Buildx, đăng nhập Container Registry và đóng gói container image từ mã nguồn cùng thành phẩm artifact.
2. **Ràng buộc thứ tự thực thi theo mô hình DAG (Directed Acyclic Graph) với từ khóa `needs`**:
   - Khai báo thuộc tính `needs: test` trong Job `docker-build` để định nghĩa quan hệ phụ thuộc.
   - Đảm bảo tính toàn vẹn của phần mềm: **Chỉ đóng gói và phân phối Docker Image khi toàn bộ bộ kiểm thử tự động (Unit Tests) hoàn thành thành công (màu xanh)**.
3. **Cơ chế dừng dòng sớm (Fail-Fast & Auto Skip)**:
   - Khi có bất kỳ lỗi kiểm thử hoặc biên dịch nào xảy ra ở Job `test`, Job `docker-build` phía sau sẽ tự động chuyển sang trạng thái **Skipped (Bị bỏ qua)**, giúp tiết kiệm tài nguyên máy chủ Runner và ngăn chặn hoàn toàn việc phát hành image lỗi lên registry.
4. **Tối ưu hóa Docker Image và quy trình Build & Push**:
   - Sử dụng Dockerfile tối ưu dựa trên JRE 17 Alpine nhỏ gọn, bảo mật với non-root user.
   - Sử dụng `docker/build-push-action@v5` kết hợp `docker/setup-buildx-action@v3` để tăng tốc build image với BuildKit.

---

### 2. Kiến trúc & Sơ đồ Luồng Thực Thi (DAG Workflow)

```mermaid
flowchart TD
    Start(["Sự kiện git push (nhánh main)"]) --> TestJob["Job 1: test<br>(Run Unit Tests & Package JAR)"]

    subgraph Job_Test ["Job 1: test (ubuntu-latest)"]
        T1["actions/checkout@v5"] --> T2["actions/setup-java@v5 (Java 17 Temurin, cache: gradle)"]
        T2 --> T3["./gradlew test (Kiểm thử JUnit)"]
        T3 --> T4["./gradlew bootJar (Đóng gói ứng dụng Spring Boot)"]
        T4 --> T5["actions/upload-artifact@v4 (Lưu app-jar: build/libs/*.jar)"]
    end

    TestJob --> BranchCondition{"Kết quả kiểm thử<br>Job test?"}

    BranchCondition -->|✅ Thành công (Success / Xanh)| DockerJob["Job 2: docker-build<br>(needs: test)"]
    BranchCondition -->|❌ Thất bại (Failed / Đỏ)| SkipJob["Job 2: docker-build<br>(Trạng thái: SKIPPED / Bị bỏ qua)"]

    subgraph Job_Docker ["Job 2: docker-build (Chỉ chạy khi Job test xanh)"]
        D1["actions/checkout@v5"] --> D2["actions/download-artifact@v4 (Tải app-jar về build/libs)"]
        D2 --> D3["docker/setup-buildx-action@v3"]
        D3 --> D4["docker/login-action@v3 (Đăng nhập ghcr.io với REGISTRY_TOKEN)"]
        D4 --> D5["docker/build-push-action@v5 (Build & Push Dockerfile lên ghcr.io)"]
    end

    DockerJob --> GHCR[("GitHub Container Registry<br>ghcr.io/&lt;owner&gt;/&lt;repo&gt;:latest")]
```

#### 2.1. Phân tích cơ chế hoạt động của từ khóa `needs`
- **Mặc định trong GitHub Actions**: Nếu không khai báo `needs`, tất cả các Job trong cùng một workflow sẽ được khởi tạo và **chạy song song** trên các Runner khác nhau. Điều này có thể dẫn đến việc Docker image bị đóng gói và đẩy lên Registry ngay cả khi mã nguồn chưa vượt qua các bài kiểm thử chất lượng.
- **Khi khai báo `needs: test`**:
  - GitHub Actions Runner Engine sẽ xây dựng một đồ thị có hướng không chu trình (DAG).
  - Job `docker-build` sẽ được đặt ở trạng thái chờ (`Waiting`) cho đến khi Job `test` hoàn thành với mã thoát `0` (Success).
  - Nếu Job `test` gặp lỗi (`exit code != 0` do Assertion failure trong JUnit hoặc compile error), GitHub Actions sẽ lập tức hủy kích hoạt Job phụ thuộc và đánh dấu Job `docker-build` là `Skipped`.

---

### 3. Chi tiết Cấu hình Tệp Triển khai

#### 3.1. Tệp Dockerfile tối ưu ([Dockerfile](file:///Dockerfile))
Dockerfile được xây dựng theo chuẩn Best Practice cho ứng dụng Spring Boot trên môi trường Container:

```dockerfile
# Sử dụng base image JRE 17 Alpine siêu nhẹ, tối ưu tài nguyên và bảo mật
FROM eclipse-temurin:17-jre-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Tạo group và user non-root để chạy container an toàn
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Sao chép tệp thực thi JAR từ thư mục build/libs đã được job test build sẵn
COPY build/libs/*.jar app.jar

# Phân quyền sở hữu tệp cho appuser
RUN chown appuser:appgroup app.jar

# Thiết lập người dùng thực thi không có đặc quyền root
USER appuser

# Khai báo cổng dịch vụ Spring Boot
EXPOSE 8080

# Lệnh khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Ưu điểm nổi bật:**
- **Kích thước nhỏ gọn**: Base image `eclipse-temurin:17-jre-alpine` chỉ chứa môi trường thực thi JRE (không cần JDK compile) giúp giảm dung lượng image từ ~500MB xuống chỉ còn ~150MB.
- **Bảo mật Container (Least Privilege)**: Không chạy tiến trình Java dưới quyền `root`, ngăn chặn nguy cơ leo thang đặc quyền khi có lỗ hổng bảo mật trong ứng dụng.
- **Tận dụng thành phẩm từ Job `test`**: Tệp JAR được compile từ bài kiểm thử đạt chuẩn ở Job `test`, tránh việc phải compile lại lần 2 trong Docker container.

---

#### 3.2. Tệp Kịch bản Workflow CI ([.github/workflows/ci.yml](file:///.github/workflows/ci.yml))

```yaml
name: Java Spring Boot CI (Gradle)

on:
  push:
    branches: [ "main" ]

jobs:
  test:
    name: Run Unit Tests & Package JAR
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

  docker-build:
    name: Build and Push Docker Image
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout mã nguồn
        uses: actions/checkout@v5

      - name: Tải thành phẩm JAR Artifact từ Job test
        uses: actions/download-artifact@v4
        with:
          name: app-jar
          path: build/libs

      - name: Thiết lập Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Chuyển tên Repository về chữ thường
        run: |
          echo "IMAGE_NAME=${GITHUB_REPOSITORY,,}" >> $GITHUB_ENV

      - name: Đăng nhập vào GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.REGISTRY_TOKEN }}

      - name: Đóng gói và đẩy Docker Image lên GHCR
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ env.IMAGE_NAME }}:latest
            ghcr.io/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

**Các điểm kỹ thuật quan trọng trong cấu hình:**
1. **`needs: test`**: Khóa phụ thuộc bắt buộc để Job `docker-build` chỉ kích hoạt khi Job `test` hoàn tất thành công.
2. **`actions/download-artifact@v4`**: Vì mỗi Job chạy trên một máy ảo Ubuntu Runner độc lập, các tệp sinh ra ở Job `test` (thư mục `build/libs`) không tự động tồn tại trên Runner của Job `docker-build`. Do đó, cơ chế `upload-artifact` và `download-artifact` là cầu nối truyền chuyển giao tệp JAR giữa 2 máy ảo.
3. **`echo "IMAGE_NAME=${GITHUB_REPOSITORY,,}" >> $GITHUB_ENV`**: Tiêu chuẩn OCI Registry quy định tên image phải hoàn toàn viết thường. Lệnh này sử dụng cú pháp chuyển đổi lowercase `${VAR,,}` trong bash shell để tránh triệt để lỗi `invalid reference format: repository name must be lowercase`.
4. **`docker/build-push-action@v5`**: Action chính thức từ Docker Hub hỗ trợ BuildKit, gán đồng thời 2 tag:
   - `:latest`: Tag phiên bản mới nhất phục vụ pull nhanh.
   - `:${{ github.sha }}`: Tag phiên bản cố định theo mã băm commit Git, hỗ trợ truy xuất nguồn gốc (Traceability) và rollback an toàn.

---

### 4. Hướng dẫn Thực hiện & Kịch bản Kiểm tra Xác nhận

#### 4.1. Kịch bản 1: Luồng CI thông thường (Toàn bộ kiểm thử xanh)
1. Commit và push mã nguồn bình thường lên nhánh `main`:
   ```bash
   git add .
   git commit -m "feat: configure two-stage CI pipeline with needs dependency"
   git push origin main
   ```
2. Truy cập tab **Actions** trên giao diện GitHub:
   - Sơ đồ trực quan (Workflow Visualization Graph) xuất hiện biểu tượng 2 khối Job:
     - Khối `Run Unit Tests & Package JAR`.
     - Mũi tên định hướng nối từ Job `test` sang khối `Build and Push Docker Image`.
   - Khi Job `test` hoàn thành với tích xanh (`Success`), Job `docker-build` bắt đầu thực thi.
   - Kết quả: Cả 2 Job đều sáng màu xanh lục (`Success`).
   - Vào mục **Packages** trên GitHub cá nhân/repository, kiểm tra thấy Docker Image mới đã được đẩy lên thành công với cả 2 tag `latest` và commit SHA.

---

#### 4.2. Kịch bản 2: Kiểm thử tính năng Auto Skip khi Unit Test bị lỗi
Để kiểm tra tính nghiêm ngặt của ràng buộc `needs: test`:
1. Mở tệp kiểm thử `src/test/java/com/example/demo/DemoApplicationTests.java`.
2. Sửa code làm hỏng test (cố ý gây lỗi Assertion Failure):
   ```java
   package com.example.demo;

   import org.junit.jupiter.api.Test;
   import org.springframework.boot.test.context.SpringBootTest;
   import static org.junit.jupiter.api.Assertions.fail;

   @SpringBootTest
   class DemoApplicationTests {

       @Test
       void contextLoads() {
           // Cố ý gây lỗi test để xác nhận cơ chế needs: test
           fail("Simulated test failure for CI pipeline verification");
       }

   }
   ```
3. Commit và đẩy lên nhánh `main`:
   ```bash
   git add src/test/java/com/example/demo/DemoApplicationTests.java
   git commit -m "test: simulate failing unit test to verify skipped job"
   git push origin main
   ```
4. Quan sát kết quả trên tab **Actions**:
   - Job `test`: Thực thi lệnh `./gradlew test` -> Thất bại -> Trạng thái hiển thị **Dấu chéo màu đỏ (Failed)**.
   - Job `docker-build`: **Không được khởi chạy** -> Trạng thái tự động hiển thị biểu tượng **Vòng tròn xám gạch chéo (Skipped)**.
   - Container Registry `ghcr.io` hoàn toàn không bị ảnh hưởng và không bị đẩy bất kỳ image lỗi nào lên.
5. Khôi phục lại bài test (xóa dòng `fail(...)`), commit và push lại để pipeline trở lại màu xanh hoàn toàn.

---

### 5. Bảng Xử Lý Sự Cố Thường Gặp (Troubleshooting Guide)

| Hiện tượng lỗi | Nguyên nhân | Biện pháp khắc phục |
| :--- | :--- | :--- |
| **`invalid reference format: repository name must be lowercase`** | Tên tài khoản GitHub hoặc tên Repository chứa chữ cái viết hoa (VD: `MyRepo/SpringApp`). Docker Image tag không chấp nhận chữ hoa. | Sử dụng bước chuyển đổi lowercase: `echo "IMAGE_NAME=${GITHUB_REPOSITORY,,}" >> $GITHUB_ENV` trước khi gọi `docker/build-push-action`. |
| **`denied: installation not allowed to Create organization package` / `403 Forbidden`** | Token `REGISTRY_TOKEN` thiếu quyền `write:packages` hoặc chưa được cấu hình quyền ghi trong phần Package Settings. | 1. Kiểm tra lại Personal Access Token đã tích chọn `write:packages`.<br>2. Thêm khối `permissions: contents: read, packages: write` vào Job `docker-build`. |
| **`COPY failed: no source files were specified` tại lệnh `COPY build/libs/*.jar`** | Job `docker-build` chạy trên Runner mới nên chưa có thư mục `build/libs` từ Job `test`. | Phải sử dụng bước `actions/download-artifact@v4` trước bước build Docker để tải tệp JAR về đúng đường dẫn `build/libs`. |
| **Job `docker-build` chạy cùng lúc với Job `test`** | Quên khai báo hoặc khai báo sai chính tả thuộc tính `needs: test` trong cấu hình Job. | Đảm bảo dòng `needs: test` nằm ở cấp độ thuộc tính của Job `docker-build` (cùng thụt lề với `runs-on`). |
| **Warning: Artifact download failed with error 404** | Tên artifact trong `download-artifact` (`name: app-jar`) không khớp với tên artifact được khai báo trong `upload-artifact`. | Kiểm tra tên artifact đảm bảo khớp nhau chính xác (`name: app-jar`). |
