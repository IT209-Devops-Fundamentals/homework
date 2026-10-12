# Bài 1: Kiểm tra cài đặt Docker Engine và chạy Container Hello-World

## Mục tiêu
- Kiểm tra cài đặt Docker Engine và Docker CLI trên máy tính.
- Khởi chạy container đầu tiên với image `hello-world`.

---

## 1. Nhật ký lệnh kiểm tra Docker CLI

### Lệnh 1: Kiểm tra phiên bản Docker (`docker version`)
```bash
$ docker version
Client: Docker Engine - Community
 Version:           26.1.4
 API version:       1.45
 Go version:        go1.21.11
 Git commit:        5650f9b
 Built:             Wed Jun  5 18:00:39 2024
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          26.1.4
  API version:      1.45 (minimum version 1.24)
  Go version:       go1.21.11
  Git commit:       de5c9cf
  Built:            Wed Jun  5 18:00:39 2024
  OS/Arch:          linux/amd64
  Experimental:     false
```

### Lệnh 2: Kiểm tra thông tin hệ thống Docker Daemon (`docker info`)
```bash
$ docker info
Client: Docker Engine - Community
 Version:    26.1.4
 Context:    default
 Debug Mode: false

Server:
 Containers: 2
  Running: 0
  Paused: 0
  Stopped: 2
 Images: 3
 Server Version: 26.1.4
 Storage Driver: overlay2
  Backing Filesystem: extfs
 Logging Driver: json-file
 Cgroup Driver: systemd
 Cgroup Version: 2
 Operating System: Ubuntu 22.04.4 LTS
 OSType: linux
 Architecture: x86_64
 CPUs: 2
 Total Memory: 3.816GiB
 Name: ubuntu-server
 Docker Root Dir: /var/lib/docker
```

---

## 2. Khởi chạy Container Hello-World

### Lệnh thực thi:
```bash
$ docker run hello-world
```

### Kết quả đầu ra Terminal:
```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec662eb144: Pull complete 
Digest: sha256:d58e752213a51785838f9eed2b7a498fa1ff320f3ffe81d1f01950e9d9987d4b
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```

---

## 3. Kết luận
- Docker Engine và Docker Daemon đã được cấu hình hoạt động chính xác và người dùng hiện tại có thể gọi Docker không cần tiền tố `sudo`.
