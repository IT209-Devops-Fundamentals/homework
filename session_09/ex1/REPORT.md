# REPORT: Kiểm tra cài đặt Docker Engine và chạy Container Hello-World

## 1. Thông tin sinh viên & Môi trường
- Hệ thống: Ubuntu Linux / Docker Engine v26.1.4
- Tài khoản thực thi: User không dùng tiền tố `sudo`

---

## 2. Nhật ký lệnh CLI & Đầu ra thực tế

### Lệnh 1: `docker version`
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

### Lệnh 2: `docker info`
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

### Lệnh 3: `docker run hello-world`
```bash
$ docker run hello-world

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

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

---

## 3. Đánh giá kết quả
- Docker Engine đã được cài đặt và vận hành ổn định.
- Docker daemon đã phản hồi và kéo image `hello-world` từ Docker Hub thành công.
- Container thực thi cho kết quả chính xác theo yêu cầu.
