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
