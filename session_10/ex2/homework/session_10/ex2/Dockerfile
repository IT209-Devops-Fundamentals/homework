# Base Image sử dụng Node.js v18 trên nền tảng Alpine Linux nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file định nghĩa package để tối ưu bộ nhớ đệm (Docker layer caching)
COPY package*.json ./

# Cài đặt các thư viện phụ thuộc (dependencies)
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Thiết lập biến môi trường PORT mặc định là 3000
ENV PORT=3000

# Khai báo port lắng nghe của container
EXPOSE 3000

# Lệnh khởi chạy ứng dụng (exec form)
CMD ["node", "server.js"]
