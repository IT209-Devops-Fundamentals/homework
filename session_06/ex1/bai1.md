# Báo cáo Bài 1: Khảo sát FHS và Phân quyền File/Folder nâng cao

## 1. Nhật ký các lệnh đã thực hiện (Command History)

```bash
# Tạo cấu trúc thư mục public và logs
sudo mkdir -p /var/www/my-app/public
sudo mkdir -p /var/www/my-app/logs

# Phân quyền cho thư mục public (750 - drwxr-x---)
# Owner: rwx (7), Group: r-x (5), Others: --- (0)
sudo chmod 750 /var/www/my-app/public

# Phân quyền cho thư mục logs (770 - drwxrwx---)
# Owner: rwx (7), Group: rwx (7), Others: --- (0)
sudo chmod 770 /var/www/my-app/logs

# Gán sở hữu cho tài khoản hiện tại và nhóm www-data
sudo chown -R $USER:www-data /var/www/my-app

# Kiểm tra lại cấu trúc và phân quyền
ls -la /var/www/my-app
```

## 2. Kết quả kiểm tra (Terminal Output)

```text
$ ls -la /var/www/my-app
total 16
drwxr-xr-x 4 ubuntu www-data 4096 Oct 24 10:00 .
drwxr-xr-x 3 root   root     4096 Oct 24 10:00 ..
drwxrwx--- 2 ubuntu www-data 4096 Oct 24 10:00 logs
drwxr-x--- 2 ubuntu www-data 4096 Oct 24 10:00 public
```