# Bài 4 — Lưu trữ dữ liệu bằng Docker Named Volume

## Tạo volume và ghi dữ liệu

```bash
docker volume create easy-volume
docker run --rm -v easy-volume:/data alpine sh -c "echo 'Luu tru du lieu Docker' > /data/test.txt"
```

Container ghi dữ liệu được xóa sau khi thoát vì có `--rm`; Named Volume `easy-volume` giữ lại tệp `/data/test.txt`.

## Đọc lại từ container khác

```bash
docker run --rm -v easy-volume:/data alpine cat /data/test.txt
docker volume ls
```

Kết quả đọc mong đợi:

```text
Luu tru du lieu Docker
```

Lệnh đọc tạo một container mới, chứng minh dữ liệu nằm trong volume chứ không phụ thuộc vòng đời container ghi.
