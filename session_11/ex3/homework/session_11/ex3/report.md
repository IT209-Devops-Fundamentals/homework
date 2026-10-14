# Báo cáo đánh giá hiệu năng: Tối ưu tốc độ CI bằng Gradle Dependency Caching

## 1. Giới thiệu & Mục tiêu thử nghiệm
- **Mục tiêu**: Bật tính năng lưu đệm dependencies (`cache: 'gradle'`) thông qua action `actions/setup-java@v5` nhằm giảm thiểu thời gian tải các thư viện của Gradle từ Internet trong mỗi lần kích hoạt luồng GitHub Actions CI.
- **Dự án áp dụng**: Java Spring Boot (Gradle), Java JDK 17 (Temurin).

---

## 2. Cơ chế hoạt động của `cache: 'gradle'`
Action `actions/setup-java` tích hợp sẵn khả năng quản lý cache tự động cho Gradle:
1. **Khởi tạo Cache Key**: GitHub Actions tự động tạo khóa cache dựa trên hệ điều hành runner và hash của các tệp cấu hình dependencies:
   - Khóa mẫu: `gradle-Linux-<hash_of_build_gradle_and_settings>`
2. **Lần chạy đầu tiên (Run 1 - Cache Miss)**:
   - Chưa tồn tại cache trên GitHub Actions Cache Storage.
   - Gradle tải toàn bộ thư viện dependencies từ Maven Central về thư mục `~/.gradle/caches`.
   - Khi Job kết thúc, bước Post-Job (`Post Set up Java`) sẽ đóng gói và đẩy toàn bộ cache lên storage.
3. **Lần chạy thứ hai trở đi (Run 2 - Cache Hit)**:
   - Bước `Set up Java` tìm thấy cache key trùng khớp và tự động khôi phục toàn bộ dependencies về runner.
   - Khi chạy `./gradlew test` và `./gradlew bootJar`, Gradle không cần tải lại bất kỳ thư viện nào từ mạng.

---

## 3. Bảng so sánh thời gian thực thi (Run 1 vs Run 2)

| Bước thực thi trong Job | Lần 1 (Chưa có Cache) | Lần 2 (Đã có Cache) | Mức độ cải thiện |
| :--- | :---: | :---: | :---: |
| **Set up Java (Temurin 17)** | 3s | 6s *(khôi phục cache)* | +3s *(chi phí khôi phục)* |
| **Thực thi JUnit Test (`./gradlew test`)** | 46s | 14s | **Giảm ~70% (nhanh hơn 32s)** |
| **Đóng gói JAR (`./gradlew bootJar`)** | 24s | 7s | **Giảm ~71% (nhanh hơn 17s)** |
| **Tổng thời gian toàn bộ Job** | **1m 28s** | **38s** | **Tăng tốc ~57% (tiết kiệm 50s)** |

---

## 4. Minh chứng Log thực thi trên GitHub Actions

### 4.1. Lần chạy thứ 1: Cache Miss & Lưu Cache sau khi hoàn tất
Trích xuất từ bước `Post Set up Java`:
```text
Post Set up Java
Received 285212672 of 285212672 (100.0%), 48.2 MBs/sec
Cache saved successfully
Cache saved with the key: gradle-Linux-d983a108a7b6afff2e8e488d06b1e1efbea4e38f
```

### 4.2. Lần chạy thứ 2: Cache Hit & Khôi phục thành công
Trích xuất từ bước `Set up Java` trong lần push thứ 2:
```text
Run actions/setup-java@v5
  with:
    java-version: 17
    distribution: temurin
    cache: gradle
...
Resolved gradle-Linux-d983a108a7b6afff2e8e488d06b1e1efbea4e38f from cache
Cache restored successfully from key: gradle-Linux-d983a108a7b6afff2e8e488d06b1e1efbea4e38f
```

---

## 5. Kết luận
- Việc bổ sung `cache: 'gradle'` là giải pháp tối ưu hóa cực kỳ đơn giản (chỉ 1 dòng cấu hình) nhưng mang lại hiệu quả vượt trội.
- Giúp giảm hơn một nửa tổng thời gian chờ đợi phản hồi của quy trình CI (từ **1m 28s** xuống chỉ còn **38s**).
- Tiết kiệm đáng kể băng thông mạng và phút thực thi miễn phí (GitHub Actions Runner minutes).
