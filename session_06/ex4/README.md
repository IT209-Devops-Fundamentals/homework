# Bài 4: Quản lý tiến trình nền với nohup và tín hiệu Kill

## Yêu cầu bài toán
Quản lý một kịch bản giám sát hệ thống viết bằng shell script chạy liên tục ở chế độ nền.
- Viết script `loop-monitor.sh` thực hiện ghi thời gian hiện tại vào tệp `/tmp/monitor.log` mỗi 5 giây.
- Sử dụng công cụ `nohup` kết hợp toán tử `&` để khởi chạy chương trình dưới nền, độc lập với session Terminal hiện tại.
- Tìm số định danh (PID) của tiến trình bằng `ps`.
- Tắt tiến trình đang chạy ẩn bằng lệnh `kill` sử dụng tín hiệu `SIGTERM` (-15).

## Nhật ký các lệnh đã thực hiện

1. **Gán quyền thực thi cho kịch bản bash shell:**
```bash
chmod +x loop-monitor.sh
```

2. **Khởi chạy script chạy ẩn dưới nền (loại bỏ output mặc định bằng điều hướng null):**
```bash
nohup ./loop-monitor.sh > /dev/null 2>&1 &
```
*(Hệ thống sẽ trả về Job ID và PID tương ứng, ví dụ: `[1] 14502`).*

3. **Kiểm tra và tìm chính xác số định danh PID của tiến trình `loop-monitor.sh`:**
```bash
ps aux | grep loop-monitor.sh
# Hoặc lệnh chuyên dụng lấy PID:
pgrep -f loop-monitor.sh
```
*(Giả sử kết quả PID trả về là `14502`).*

4. **Gửi tín hiệu tắt tiến trình an toàn (SIGTERM):**
```bash
kill -15 14502
```
*(Nếu tiến trình bị treo không đáp ứng với `kill -15`, lệnh ép buộc kết thúc `kill -9 14502` (SIGKILL) sẽ được sử dụng làm giải pháp dự phòng).*

## Kết quả kiểm tra

1. **Đầu ra mong đợi của tệp log khi theo dõi liên tục:**
```bash
tail -n 5 /tmp/monitor.log
```
**Kết quả hiển thị (mô phỏng trên Linux):**
```text
System time: Wed Oct  7 10:25:01 UTC 2026
System time: Wed Oct  7 10:25:06 UTC 2026
System time: Wed Oct  7 10:25:11 UTC 2026
```
*(Việc dữ liệu vẫn được ghi sau khi tắt terminal hiện tại chứng tỏ tiến trình được tách khỏi session thành công nhờ `nohup`).*

2. **Trạng thái tiến trình sau khi tắt:**
Gõ lại lệnh `ps aux | grep loop-monitor.sh`.
**Kết quả:** Không còn tiến trình `loop-monitor.sh` nào đang chạy, ngoại trừ chính tiến trình `grep` mà ta vừa gõ. Lệnh `kill` đã thực thi thành công.
