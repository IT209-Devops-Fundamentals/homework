# 🚀 DevOps Master Quiz - Nền Tảng Ôn Tập Trắc Nghiệm Toàn Diện

> **Ứng dụng web trắc nghiệm tương tác chuyên sâu môn DevOps & Quản trị Hệ thống**
> 
> Bao gồm **68 câu hỏi thực tế** được biên soạn chuẩn xác 100% theo nội dung đề cương:
> - **Phần 1: Quản lý mã nguồn với Git & GitHub** (Cơ bản, Nhánh & Xung đột, Remote & Pull Request, Kỹ thuật nâng cao).
> - **Phần 2: Quản trị hệ điều hành Linux (Ubuntu Server)** (Kiến trúc & CLI, Quản lý User/Group, Mạng & Tường lửa UFW, Quản lý Process & Systemd).

---

## 🌟 Tính Năng Nổi Bật

1. **📝 Chế độ Luyện Tập Tự Do (Practice Mode)**:
   - Làm bài theo từng chuyên đề hoặc toàn bộ 68 câu.
   - Nhận phản hồi kết quả Đúng/Sai tức thì ngay khi chọn đáp án.
   - **Giải thích chi tiết & DevOps Best Practice** cho từng câu hỏi, giúp hiểu sâu bản chất kỹ thuật thay vì học vẹt.
   - Hỗ trợ phím tắt nhanh: `A`, `B`, `C`, `D` để chọn đáp án; `←`, `→` để chuyển câu.

2. **⏱️ Chế độ Thi Thử Mô Phỏng (Timed Exam Mode)**:
   - Tùy chọn 3 mức độ thi:
     - ⚡ **Khảo Sát Nhanh**: 20 câu / 15 phút.
     - 🎯 **Đề Thi Chuẩn**: 40 câu / 30 phút.
     - 🏆 **Toàn Diện Đề Cương**: 60 câu / 45 phút.
   - Đồng hồ đếm ngược thời gian thực (cảnh báo đỏ khi dưới 2 phút).
   - **Bảng điều hướng câu hỏi (Question Palette Grid)** giúp nhảy nhanh đến câu bất kỳ và theo dõi trạng thái (*Chưa làm*, *Đã chọn*, *Đặt cờ xem lại 🚩*).
   - Chấm điểm tự động và xuất **Báo Cáo Năng Lực**:
     - % Điểm số và đánh giá cấp độ (*Senior DevOps*, *Đạt*, *Cần ôn thêm*).
     - Biểu đồ phân tích tỉ lệ đúng theo từng chuyên đề con.
     - Xem lại toàn bộ câu làm sai kèm lời giải chi tiết.
     - Hiệu ứng pháo hoa chúc mừng (Confetti Celebration) khi hoàn thành bài thi!

3. **🗂️ Thẻ Ghi Nhớ (Flashcard 3D Mode)**:
   - Lật thẻ không gian 3D tương tác (phím `Space` hoặc chạm màn hình) để học nhanh các lệnh Git CLI và lệnh Linux Server.
   - Tính năng xáo trộn ngẫu nhiên bộ thẻ (Shuffle).

4. **⭐ Ghim Câu Hỏi (Bookmarks) & ❌ Ôn Lại Câu Sai (Mistakes Review)**:
   - Đánh dấu các câu hỏi khó để ôn tập cấp tốc trước giờ thi.
   - Hệ thống tự động ghi nhận các câu làm sai để bạn luyện tập lại cho đến khi đạt điểm tuyệt đối.

5. **🎨 Thiết Kế Hiện Đại & Trải Nghiệm Người Dùng (UI/UX)**:
   - Giao diện Glassmorphism hiện đại, phối màu chuẩn Terminal/Cyber DevOps.
   - Hỗ trợ chuyển đổi **Chế độ Sáng / Tối (Dark / Light Theme)**.
   - Âm thanh tương tác chân thực (tạo bằng Web Audio API Synthesizer tích hợp sẵn, không phụ thuộc file ngoài).
   - Tìm kiếm nhanh tức thì theo từ khóa lệnh (`rebase`, `visudo`, `ufw`, `chmod`, `nohup`, `reflog`...).
   - Lưu trữ tiến độ tự động vào `localStorage` (không sợ mất dữ liệu khi F5 hoặc tắt trình duyệt).

---

## 💻 Hướng Dẫn Chạy Cục Bộ (Local)

Ứng dụng được xây dựng theo kiến trúc **Pure Vanilla Web (HTML5 + CSS3 + ES6 JavaScript)**:
- **Không cần cài đặt `node_modules` hay chạy `npm install`**.
- **Không cần build phức tạp**.

Bạn chỉ cần:
1. Mở file `index.html` trực tiếp bằng trình duyệt bất kỳ (Chrome, Edge, Firefox, Brave).
2. Hoặc mở bằng tiện ích **Live Server** trên VS Code.
3. Hoặc chạy lệnh Python đơn giản tại thư mục `Quiz_Devops`:
   ```bash
   python -m http.server 8080
   ```
   Sau đó truy cập: `http://localhost:8080`

---

## 🌐 Hướng Dẫn Deploy Lên GitHub Pages (Để Mọi Người Cùng Ôn Tập)

Có **2 cách cực kỳ đơn giản** để đưa trang web này lên Internet miễn phí:

### Cách 1: Kích hoạt trực tiếp từ Repository hiện tại (Khuyên Dùng)

Nếu thư mục `Quiz_Devops` nằm trong kho mã nguồn GitHub của bạn:

1. **Commit và đẩy code lên GitHub**:
   ```bash
   git add Quiz_Devops/
   git commit -m "feat: Add interactive DevOps Quiz web app"
   git push origin main
   ```

2. **Cấu hình GitHub Pages**:
   - Truy cập vào Repository của bạn trên GitHub (`https://github.com/<username>/<repo-name>`).
   - Vào mục **Settings** ⚙️ (ở thanh menu trên cùng).
   - Chọn mục **Pages** ở danh mục bên trái.
   - Tại phần **Build and deployment**:
     - **Source**: Chọn `Deploy from a branch`.
     - **Branch**: Chọn nhánh `main` và thư mục `/ (root)`.
     - Nhấn nút **Save**.

3. **Truy cập đường dẫn ôn tập**:
   Sau khoảng 1 - 2 phút, link ôn tập của bạn và các bạn trong lớp sẽ hoạt động tại:
   ```
   https://<username>.github.io/<repo-name>/Quiz_Devops/
   ```

---

### Cách 2: Tạo một Repository riêng biệt trên GitHub cho Quiz

Nếu bạn muốn tạo một link ngắn gọn chuyên biệt dạng `https://<username>.github.io/devops-quiz/`:

1. Tạo một repository mới trên GitHub (ví dụ đặt tên là `devops-quiz`).
2. Mở terminal tại thư mục `Quiz_Devops`:
   ```bash
   cd d:\IT209\homework\Quiz_Devops
   git init
   git add .
   git commit -m "feat: Initial commit for DevOps Master Quiz"
   git branch -M main
   git remote add origin https://github.com/<username>/devops-quiz.git
   git push -u origin main
   ```
3. Vào **Settings** > **Pages** trên repository `devops-quiz` > Chọn branch `main` > Bấm **Save**.
4. Link truy cập trực tiếp: `https://<username>.github.io/devops-quiz/`

---

## 📁 Cấu Trúc Mã Nguồn

```text
Quiz_Devops/
├── index.html       # Giao diện chính, cấu trúc semantic đa view
├── style.css        # Hệ thống thiết kế Dark/Light mode, Glassmorphism & Animations
├── questions.js     # Ngân hàng 68 câu hỏi chuẩn hóa kèm giải thích chi tiết
├── app.js           # Engine quản lý trạng thái, tính giờ thi, audio synth & canvas confetti
└── README.md        # Hướng dẫn sử dụng & triển khai
```

---

## 🎓 Chúc các bạn ôn thi thật tốt và đạt điểm số cao nhất trong kỳ thi DevOps! 🚀
