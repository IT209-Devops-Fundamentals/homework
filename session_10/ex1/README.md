# BÁO CÁO KỸ THUẬT: PHÂN TÍCH KIẾN TRÚC CONTAINER VS VIRTUAL MACHINE VÀ CHIẾN LƯỢC DỊCH CHUYỂN TỪ VPS SANG DOCKER

---

## 1. Bối cảnh & Mục tiêu

Trong kỷ nguyên chuyển đổi số và phát triển phần mềm hiện đại (DevOps / Agile), mô hình triển khai ứng dụng truyền thống trên máy chủ ảo cá nhân (VPS - Virtual Private Server / Virtual Machine) đang dần bộc lộ nhiều hạn chế về hiệu suất, chi phí vận hành và tốc độ triển khai. 

Doanh nghiệp thường xuyên đối mặt với bài toán lãng phí tài nguyên máy chủ khi mỗi VPS phải gánh một hệ điều hành hoàn chỉnh (Guest OS), thời gian khởi động lâu (tính bằng phút) và rào cản lớn khi mở rộng quy mô (Auto-scaling). Việc chuyển đổi từ kiến trúc ảo hóa phần cứng (VM/VPS) sang kiến trúc ảo hóa hệ điều hành (Container Engine / Docker) giúp giải quyết triệt để các vấn đề này: tối ưu hóa mật độ ứng dụng trên một máy chủ vật lý, rút ngắn thời gian release ứng dụng và chuẩn hóa môi trường từ phát triển (Development) đến sản xuất (Production).

Báo cáo kỹ thuật này phân tích chi tiết sự khác biệt kiến trúc giữa Virtual Machine và Container, làm rõ các cơ chế cô lập kernel của Linux (Namespaces) và quản lý tài nguyên (cgroups), đồng thời trích xuất các thông số thực tế từ Docker Engine phục vụ cho việc đánh giá hệ thống.

---

## 2. Bảng so sánh chuyên sâu: Virtual Machine vs Container

Khác biệt cốt lõi nằm ở tầng ảo hóa: Virtual Machine sử dụng tầng Hypervisor để ảo hóa phần cứng (Hardware-level Virtualization), trong khi Container tận dụng trực tiếp Kernel của Host OS để tạo ra các môi trường thực thi độc lập (OS-level Virtualization).

| Tiêu chí | Virtual Machine (VM / VPS) | Container (Docker Engine) | Phân tích tác động đến doanh nghiệp |
| :--- | :--- | :--- | :--- |
| **1. Dung lượng Image** | Rất lớn (từ **vài GB** đến **hàng chục GB**). Chứa trọn vẹn Guest OS, kernel riêng, thư viện hệ thống và driver ảo hóa. | Siêu nhẹ (từ **vài MB** đến **vài trăm MB**; ví dụ: Alpine Linux chỉ ~5MB, distroless image ~20MB). | Giảm đáng kể chi phí lưu trữ image (Docker Registry), đẩy nhanh tốc độ pull/push image qua mạng khi triển khai CI/CD. |
| **2. Thời gian khởi động** | Chậm (từ **30 giây đến vài phút**). Phải trải qua quy trình bootloader, nạp kernel của Guest OS và chạy các dịch vụ hệ thống nền. | Tức thì (**vài mili-giây đến vài giây**). Container thực chất là một tiến trình thông thường trên host, không cần boot lại OS. | Khả năng tự phục hồi (Self-healing) và mở rộng linh hoạt (Auto-scaling) ngay khi lưu lượng truy cập đột biến. |
| **3. Hao phí OS (OS Overhead)** | Rất cao. Mỗi VM tiêu tốn lượng RAM và CPU cố định để duy trì Guest OS và cơ chế mô phỏng phần cứng của Hypervisor. | Cực thấp (gần như bằng 0). Không có Guest OS riêng, không qua tầng Hypervisor, chạy trực tiếp trên Host Kernel. | Tối ưu hóa 80-90% hiệu suất phần cứng; trên cùng một server vật lý có thể chạy số lượng container gấp 5 - 10 lần số VM. |
| **4. Mức độ cô lập (Isolation)** | Hoàn toàn / Rất cao. Cô lập ở tầng phần cứng vật lý. Lỗ hổng hoặc sự cố kernel trong VM không ảnh hưởng đến Host OS hay các VM khác. | Mức độ trung bình - cao. Cô lập ở cấp tiến trình thông qua Linux Namespaces và cgroups. Dùng chung Host Kernel. | VM phù hợp chạy môi trường đa người dùng (Multi-tenant) không tin cậy. Container an toàn cho microservices nội bộ, cần kết hợp seccomp/AppArmor. |
| **5. Khả năng mở rộng (Scalability)** | Hạn chế và cồng kềnh. Việc scale ngang đòi hỏi cấp phát disk, clone VM và thời gian chờ boot kéo dài; tốn nhiều tài nguyên. | Vượt trội và linh hoạt. Có thể scale ngang hàng chục đến hàng trăm replica trong vài giây thông qua Docker Compose hoặc Kubernetes. | Đáp ứng hoàn hảo kiến trúc Microservices và mô hình điện toán đám mây (Cloud-Native), giảm tối đa downtime. |

---

## 3. Cơ chế nền tảng của Container trong Linux Kernel

Sự thần kỳ của Docker không đến từ một lớp mô phỏng giả lập, mà dựa trên hai tính năng cốt lõi có sẵn trong Linux Kernel: **Namespaces** và **Control Groups (cgroups)**.

```
+-------------------------------------------------------------------+
|                        Docker Container                           |
|  +-----------------------------+  +----------------------------+  |
|  |     Linux Namespaces        |  |   Control Groups (cgroups) |  |
|  |  (CÔ LẬP KHÔNG GIAN NHÌN)   |  |   (GIỚI HẠN TÀI NGUYÊN)    |  |
|  | - PID: Cô lập Process       |  | - CPU: shares, quota, quota|  |
|  | - NET: Cô lập Network Stack |  | - Memory: limit, swap, OOM |  |
|  | - MNT: Cô lập Mount Files   |  | - BlkIO: I/O Read/Write bps|  |
|  +-----------------------------+  +----------------------------+  |
+-------------------------------------------------------------------+
|                     Shared Linux Host Kernel                      |
+-------------------------------------------------------------------+
|                        Physical Hardware                          |
+-------------------------------------------------------------------+
```

### 3.1. Linux Namespaces (Cơ chế cô lập tài nguyên)

Namespaces chịu trách nhiệm tạo ra **"ảo giác về một hệ điều hành riêng biệt"** cho mỗi container. Mỗi container được đưa vào một tập hợp namespaces riêng rẽ, khiến nó chỉ nhìn thấy tài nguyên thuộc về chính nó mà không thể quan sát hay can thiệp vào các tài nguyên khác của Host.

1. **PID Namespace (Process ID Isolation):**
   - **Vai trò:** Cô lập cây phân cấp tiến trình.
   - **Cơ chế:** Tiến trình chính khởi chạy bên trong container sẽ nhận `PID = 1` (đóng vai trò tương tự như tiến trình `init` hoặc `systemd` của một OS độc lập). Tuy nhiên, trên hệ điều hành Host, tiến trình này chỉ mang một PID thông thường (ví dụ: `PID = 24510`). Container không thể nhìn thấy bất kỳ tiến trình nào của Host OS hay của các container khác, đảm bảo an toàn tuyệt đối cho chu trình xử lý.

2. **NET Namespace (Network Stack Isolation):**
   - **Vai trò:** Cô lập toàn bộ ngăn xếp mạng (Network Stack).
   - **Cơ chế:** Mỗi container sở hữu giao diện mạng riêng (`eth0`), địa chỉ IP riêng, bảng định tuyến (routing table), bảng lọc gói tin (`iptables` / `nftables`) và các port socket độc lập. Docker sử dụng cặp card mạng ảo `veth pair` để kết nối NET Namespace của container với một Linux bridge ảo (`docker0`). Do đó, hai container khác nhau có thể cùng bind vào port `80` mà không xảy ra xung đột port trên Host.

3. **MNT Namespace (Mount Points & Filesystem Isolation):**
   - **Vai trò:** Cô lập hệ thống tệp tin và các điểm gắn kết thư mục (Mount points).
   - **Cơ chế:** Kết hợp cùng lệnh `pivot_root` và cơ chế layered storage (UnionFS / OverlayFS), MNT Namespace đảm bảo container chỉ nhìn thấy cây thư mục root (`/`) riêng biệt xuất phát từ Docker Image. Các thao tác tạo, sửa, xóa file hay mount thiết bị trong container hoàn toàn không làm thay đổi hoặc ảnh hưởng đến hệ thống tệp tin của Host OS.

*(Ngoài ra, Linux Kernel còn cung cấp các Namespaces khác như **IPC** (cô lập Inter-Process Communication), **UTS** (cô lập Hostname và NIS Domain name), **User** (ánh xạ UID/GID bên trong container sang UID/GID không có quyền root ngoài Host), và **Cgroup Namespace**).*

---

### 3.2. Control Groups - cgroups (Cơ chế quản lý & giới hạn tài nguyên)

Nếu Namespaces trả lời câu hỏi *"Container được nhìn thấy những gì?"* thì Control Groups (cgroups) trả lời câu hỏi *"Container được sử dụng bao nhiêu tài nguyên?"*.

1. **Giới hạn và phân bổ CPU (CPU Subsystem):**
   - **Vai trò:** Ngăn chặn hiện tượng một container bị loop vô tận hoặc quá tải làm nghẽn toàn bộ CPU của máy chủ (vấn đề "Noisy Neighbor").
   - **Cơ chế:** 
     - **CPU Shares (`--cpu-shares`):** Thiết lập trọng số ưu tiên CPU giữa các container khi hệ thống xảy ra tranh chấp.
     - **CPU Quota & Period (`--cpus`):** Sử dụng cơ chế CFS (Completely Fair Scheduler) để giới hạn thời gian CPU mà container được phép thực thi trong một chu kỳ (ví dụ: tối đa 50ms trong chu kỳ 100ms tương đương 0.5 core).
     - **CPU Pinning (`--cpuset-cpus`):** Cố định container chỉ được chạy trên các core vật lý cụ thể (ví dụ core 0, 1).

2. **Giới hạn bộ nhớ RAM (Memory Subsystem):**
   - **Vai trò:** Đảm bảo container không gây tràn RAM làm sập Host OS hoặc các dịch vụ quan trọng khác.
   - **Cơ chế:**
     - Thiết lập giới hạn RAM cứng (`--memory` / `-m`): Khi container tiêu thụ vượt quá mức quy định, cơ chế Linux OOM Killer (Out Of Memory Killer) sẽ can thiệp và chỉ tiêu diệt tiến trình bên trong container đó, bảo vệ an toàn cho Host OS.
     - Kiểm soát bộ nhớ Swap (`--memory-swap`): Ngăn container lạm dụng swap gây suy giảm tốc độ đọc/ghi I/O của đĩa cứng.

3. **Cgroup Driver:**
   - Linux hỗ trợ hai driver quản lý cgroup chính: `cgroupfs` (quản lý trực tiếp qua virtual filesystem `/sys/fs/cgroup`) và `systemd` (tích hợp quản lý thông qua systemd slice). Sử dụng đúng Cgroup Driver giúp đồng bộ hóa cây tài nguyên hệ thống, đặc biệt quan trọng trong các cụm Kubernetes / Production clusters.

---

## 4. Trích xuất thông số kỹ thuật thực tế từ `docker info`

Dựa trên kết quả thực thi lệnh `docker info` trực tiếp trên hệ thống (chi tiết được ghi lại tại tệp [docker_info.log](file:///C:/Users/duyho/Downloads/STUDY/1.%20EXCERCISES_RIKKEI/DevOpsFundamental/PTIT_IT209_Session10/BT1/docker_info.log)), các thông số kỹ thuật cốt lõi được trích xuất như sau:

| Thông số (Parameter) | Giá trị thực tế trên hệ thống | Ý nghĩa kỹ thuật |
| :--- | :--- | :--- |
| **Server Version** | **29.7.2** | Phiên bản Docker Engine Server đang vận hành, hỗ trợ Docker API v1.55. |
| **Cgroup Driver** | **cgroupfs** | Trình điều khiển quản lý tài nguyên cgroup trực tiếp qua hệ thống tệp ảo của Linux. |
| **Cgroup Version** | **2** (cgroup v2) | Phiên bản cgroup mới nhất của Linux Kernel, hỗ trợ cấu trúc phân cấp thống nhất (unified hierarchy) và quản lý tài nguyên chính xác hơn. |
| **Số lượng Containers** | **3** (Running: **2**, Paused: **0**, Stopped: **1**) | Tổng số lượng container hiện có trên node, trong đó có 2 container đang chạy nền phục vụ ứng dụng. |
| **Số lượng Images** | **5** | Số lượng container images đã tải về và lưu trữ cục bộ trong kho Docker cục bộ. |
| **Storage Driver** | **overlayfs** (`io.containerd.snapshotter.v1`) | Trình điều khiển lưu trữ phân lớp (layered storage) hiệu năng cao dựa trên containerd snapshotter. |
| **Kernel Version** | **6.18.33.2-microsoft-standard-WSL2** | Nhân Linux Host chia sẻ chung cho toàn bộ các Container trên hệ thống. |
| **Total Memory** | **15.47 GiB** | Tổng dung lượng bộ nhớ khả dụng mà Docker Engine có thể phân bổ thông qua cgroups. |
| **CPUs** | **4** | Số luồng xử lý CPU có thể cấp phát quota cho các container. |

---

## 5. Kết luận & Khuyến nghị cho Doanh nghiệp

1. **Hiệu quả kinh tế (ROI):** Việc chuyển đổi từ kiến trúc VPS truyền thống sang Docker Container giúp doanh nghiệp cắt giảm tới **60 - 70% chi phí hạ tầng máy chủ** nhờ tận dụng tối đa năng lực phần cứng, loại bỏ hoàn toàn hao phí từ hàng loạt Guest OS riêng lẻ.
2. **Chuẩn hóa quy trình vận hành:** Docker loại bỏ triệt để câu nói kinh điển *"It works on my machine!"*. Đóng gói ứng dụng kèm đầy đủ runtime và dependencies vào Image đảm bảo tính nhất quán 100% giữa các môi trường Development, Staging và Production.
3. **Sẵn sàng cho kỷ nguyên Cloud-Native:** Với nền tảng Linux Namespaces và cgroups đã được cấu hình chuẩn mực, doanh nghiệp sở hữu nền tảng vững chắc để dễ dàng nâng cấp lên các hệ thống điều phối container quy mô lớn như Kubernetes (K8s) khi sản phẩm mở rộng quy mô.
