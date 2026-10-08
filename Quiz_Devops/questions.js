/**
 * Bộ ngân hàng câu hỏi trắc nghiệm DevOps (Git & Ubuntu Linux Server)
 * Biên soạn chuẩn kiến thức: Git/GitHub Core & Linux Administration
 * Tổng cộng: 68 câu hỏi chuyên sâu, chia đều 8 chuyên đề
 */

const QUIZ_DATA = [
  // ==========================================
  // PHẦN 1.1: GIT CƠ BẢN & KIẾN TRÚC (Q1 - Q8)
  // ==========================================
  {
    id: 1,
    part: "git",
    topic: "Git Cơ bản",
    question: "Git giải quyết vấn đề cốt lõi nào trong quy trình phát triển phần mềm và DevOps?",
    options: [
      "Tự động biên dịch mã nguồn và chạy kiểm thử tự động trên máy chủ",
      "Theo dõi lịch sử thay đổi, phục hồi lỗi nhanh chóng và hỗ trợ làm việc nhóm song song",
      "Triển khai trực tiếp ứng dụng lên môi trường production mà không cần cấu hình",
      "Tối ưu hoá hiệu năng của hệ điều hành và quản lý tài nguyên bộ nhớ RAM"
    ],
    answer: 1,
    explanation: "Git là hệ thống quản lý phiên bản phân tán (DVCS), giải quyết bài toán quản lý mã nguồn thủ công bằng cách: ghi nhận toàn bộ lịch sử thay đổi, cho phép quay ngược thời gian để phục hồi lỗi, và hỗ trợ nhiều lập trình viên làm việc song song trên các nhánh độc lập mà không đè mã của nhau."
  },
  {
    id: 2,
    part: "git",
    topic: "Git Cơ bản",
    question: "Kiến trúc dữ liệu cục bộ của Git bao gồm 3 vùng dữ liệu cốt lõi nào?",
    options: [
      "Thư mục làm việc (Working Directory), Khu vực chuẩn bị (Staging Area), Kho lưu trữ cục bộ (Local Repository)",
      "Vùng nhớ đệm (Cache), Bộ nhớ RAM, Ổ đĩa cứng máy chủ (Hard Drive)",
      "Nhánh chính (Main Branch), Nhánh tính năng (Feature Branch), Nhánh Hotfix",
      "Thư mục gốc (/root), Thư mục cấu hình (/etc), Thư mục người dùng (/home)"
    ],
    answer: 0,
    explanation: "3 vùng cốt lõi của Git là: (1) Working Directory - nơi lập trình viên trực tiếp sửa code; (2) Staging Area (Index) - nơi chọn lọc các thay đổi muốn đóng gói cho lần commit tiếp theo; (3) Local Repository - nơi lưu trữ vĩnh viễn các commit trong cơ sở dữ liệu .git."
  },
  {
    id: 3,
    part: "git",
    topic: "Git Cơ bản",
    question: "Vòng đời của một tệp tin (File Lifecycle) trong Git trải qua thứ tự 4 trạng thái nào?",
    options: [
      "Staged → Untracked → Modified → Committed",
      "Untracked → Staged → Committed → Modified (khi sửa tiếp)",
      "Created → Deleted → Merged → Pushed",
      "Unstaged → Ready → Pushed → Pulled"
    ],
    answer: 1,
    explanation: "Vòng đời tệp trong Git: Bắt đầu khi tệp mới tạo là Chưa theo dõi (Untracked) → Dùng 'git add' chuyển sang Đã chuẩn bị (Staged) → Dùng 'git commit' chuyển thành Đã cam kết (Committed) → Khi lập trình viên sửa đổi nội dung tệp thì chuyển thành Đã sửa đổi (Modified) và lặp lại chu trình."
  },
  {
    id: 4,
    part: "git",
    topic: "Git Cơ bản",
    question: "Lệnh nào sau đây dùng để đưa tất cả các thay đổi từ Working Directory vào Staging Area?",
    options: [
      "git commit -m 'all'",
      "git add .",
      "git status -a",
      "git push --all"
    ],
    answer: 1,
    explanation: "Lệnh `git add .` (hoặc `git add -A`) sẽ quét tất cả các file có thay đổi (thêm mới, chỉnh sửa, xóa) trong thư mục hiện tại và đưa vào Staging Area để chuẩn bị commit."
  },
  {
    id: 5,
    part: "git",
    topic: "Git Cơ bản",
    question: "Để so sánh chi tiết từng dòng mã đã thay đổi giữa thư mục làm việc (Working Directory) và Staging Area, bạn sử dụng lệnh nào?",
    options: [
      "git log -p",
      "git status",
      "git diff",
      "git show"
    ],
    answer: 2,
    explanation: "`git diff` hiển thị chi tiết các dòng được thêm (+) hoặc xoá (-) giữa Working Directory và Staging Area. Nếu muốn so sánh giữa Staging Area và commit gần nhất, dùng `git diff --staged`."
  },
  {
    id: 6,
    part: "git",
    topic: "Git Cơ bản",
    question: "Mục đích quan trọng nhất của tệp `.gitignore` trong một dự án phần mềm là gì?",
    options: [
      "Tự động nén dung lượng các file ảnh và video trước khi push lên GitHub",
      "Ngăn chặn việc đưa các file rác, file build, thư viện dependencies (node_modules) và tệp nhạy cảm (.env) vào Git repo",
      "Chỉ định danh sách những lập trình viên không được phép commit vào repository",
      "Cấu hình các bước tự động kiểm thử cho pipeline CI/CD"
    ],
    answer: 1,
    explanation: "Tệp `.gitignore` cho Git biết các mẫu file/thư mục cần bỏ qua, không theo dõi. Việc này tối quan trọng trong DevOps để tránh làm phình to repo (như node_modules, build artifacts) và đặc biệt tránh lộ bí mật bảo mật như file cấu hình môi trường (.env, private keys)."
  },
  {
    id: 7,
    part: "git",
    topic: "Git Cơ bản",
    question: "Điểm khác biệt cốt lõi giữa hai lệnh `git status` và `git log` là gì?",
    options: [
      "`git status` tải code từ remote, còn `git log` đẩy code lên remote",
      "`git status` xem trạng thái hiện tại của các file (staged/unstaged), còn `git log` xem lịch sử các commit đã thực hiện",
      "`git status` chỉ dùng cho branch master, còn `git log` dùng cho tất cả các branch",
      "`git status` xoá các file tạm, còn `git log` khôi phục file bị xoá"
    ],
    answer: 1,
    explanation: "`git status` cung cấp thông tin thời gian thực về trạng thái các file (file nào modified, staged, untracked). Trong khi `git log` liệt kê danh sách các commit đã được lưu lại trong lịch sử (kèm mã hash, tác giả, thời gian, commit message)."
  },
  {
    id: 8,
    part: "git",
    topic: "Git Cơ bản",
    question: "Để khởi tạo một thư mục trống hiện tại thành một Git Repository cục bộ, lệnh đầu tiên cần gõ là:",
    options: [
      "git clone .",
      "git start",
      "git init",
      "git new"
    ],
    answer: 2,
    explanation: "`git init` là lệnh khởi tạo một kho lưu trữ Git mới. Lệnh này tạo ra một thư mục ẩn `.git` chứa toàn bộ cơ sở dữ liệu metadata và object của Git."
  },

  // ==========================================
  // PHẦN 1.2: NHÁNH & XUNG ĐỘT (BRANCH & CONFLICT) (Q9 - Q16)
  // ==========================================
  {
    id: 9,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Bản chất kỹ thuật sâu xa của một Nhánh (Branch) trong hệ thống Git là gì?",
    options: [
      "Một bản sao vật lý chép toàn bộ thư mục dự án sang một ổ đĩa cứng khác",
      "Một con trỏ (pointer) siêu nhẹ có thể di chuyển, trỏ đến một commit cụ thể",
      "Một tệp nén dạng .zip chứa tất cả mã nguồn tại thời điểm rẽ nhánh",
      "Một quy tắc phân quyền người dùng do GitHub máy chủ quản lý"
    ],
    answer: 1,
    explanation: "Trong Git, nhánh cực kỳ nhẹ (chỉ nặng khoảng 41 byte). Bản chất của nó chỉ là một con trỏ trỏ trực tiếp đến mã băm SHA-1 của một commit. Khi bạn commit mới, con trỏ này tự động dịch chuyển tiến về phía trước."
  },
  {
    id: 10,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "So sánh cơ chế giữa `git merge` và `git rebase`, phát biểu nào sau đây là CHÍNH XÁC?",
    options: [
      "`git merge` xoá lịch sử commit cũ, còn `git rebase` luôn tạo ra một commit hợp nhất (merge commit)",
      "`git merge` giữ lại lịch sử phân nhánh và tạo merge commit; `git rebase` viết lại lịch sử thành một đường thẳng nhưng làm thay đổi mã băm (commit hash)",
      "`git rebase` an toàn hơn `git merge` khi làm việc trên các nhánh đã chia sẻ chung",
      "Không có sự khác biệt nào, hai lệnh này chỉ là tên viết tắt của nhau"
    ],
    answer: 1,
    explanation: "`git merge` bảo toàn lịch sử phi tuyến tính chân thực bằng cách tạo ra một commit gộp (3-way merge commit). Ngược lại, `git rebase` đem các commit của nhánh hiện tại đặt lên đỉnh của nhánh đích, tạo lịch sử thẳng tắp dễ đọc nhưng viết lại lịch sử (tạo commit hash mới)."
  },
  {
    id: 11,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Quy tắc vàng (Golden Rule) trong Git khuyến cáo điều gì đối với việc sử dụng `git rebase`?",
    options: [
      "Luôn luôn rebase nhánh main vào nhánh production",
      "Tuyệt đối KHÔNG sử dụng `git rebase` trên các nhánh đã được chia sẻ công khai (public/shared branches)",
      "Chỉ được rebase khi dự án có dưới 5 lập trình viên",
      "Phải rebase trước khi thực hiện bất kỳ lệnh `git commit` nào"
    ],
    answer: 1,
    explanation: "Vì `git rebase` viết lại lịch sử và thay đổi commit hash, nếu bạn rebase một nhánh mà người khác đã kéo về máy của họ (shared branch), lịch sử sẽ bị phân kỳ nghiêm trọng, dẫn đến xung đột hỗn loạn khi mọi người push/pull."
  },
  {
    id: 12,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Xung đột mã nguồn (Merge Conflict) trong Git xảy ra trong trường hợp nào?",
    options: [
      "Khi hai lập trình viên cùng commit vào hai tệp tin ở hai thư mục hoàn toàn khác nhau",
      "Khi hai nhánh cùng chỉnh sửa các dòng khác nhau trong cùng một tệp tin",
      "Khi hai nhánh cùng sửa đổi cùng một đoạn mã hoặc cùng một dòng trong cùng một tệp tin, khiến Git không tự động quyết định được",
      "Khi một lập trình viên quên không đặt commit message"
    ],
    answer: 2,
    explanation: "Git có khả năng tự động merge thông minh nếu các thay đổi nằm ở các file khác nhau hoặc các dòng khác nhau. Xung đột chỉ xuất hiện khi có sự thay đổi cạnh tranh (competing changes) trên cùng một dòng mã hoặc cùng một khối lệnh mà Git không thể tự suy đoán bên nào đúng."
  },
  {
    id: 13,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Trong quy trình 5 bước giải quyết conflict, sau khi mở file, sửa code và xoá các ký hiệu conflict marker (`<<<<<<<`, `=======`, `>>>>>>>`), bước tiếp theo là gì?",
    options: [
      "Chạy `git push -f` ngay lập tức lên GitHub",
      "Chạy `git add <file>` để đánh dấu đã giải quyết xong, sau đó thực hiện `git commit`",
      "Chạy lệnh `git branch -D` để xoá nhánh bị lỗi",
      "Khởi động lại máy tính để Git tự xoá bộ nhớ đệm"
    ],
    answer: 1,
    explanation: "Quy trình giải quyết xung đột chuẩn: (1) Phát hiện file conflict → (2) Mở file xử lý nội dung mã → (3) Xoá markers → (4) Chạy `git add <file>` để xác nhận conflict đã được giải quyết → (5) Chạy `git commit` để hoàn tất merge."
  },
  {
    id: 14,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Nếu quá trình merge gặp conflict quá phức tạp và bạn muốn huỷ bỏ hoàn toàn thao tác merge để đưa nhánh về trạng thái trước đó, bạn sử dụng lệnh:",
    options: [
      "git merge --cancel",
      "git merge --abort",
      "git merge --undo",
      "git reset --force"
    ],
    answer: 1,
    explanation: "Lệnh `git merge --abort` sẽ lập tức dừng quá trình merge đang diễn ra và khôi phục lại trạng thái làm việc về đúng commit trước khi lệnh merge được gọi."
  },
  {
    id: 15,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Khi xảy ra conflict, phần mã nằm giữa `<<<<<<< HEAD` và `=======` đại diện cho điều gì?",
    options: [
      "Đoạn mã từ nhánh được merge vào (nhánh remote/nhánh phụ)",
      "Đoạn mã của nhánh hiện tại mà bạn đang đứng (HEAD)",
      "Đoạn mã gốc ban đầu trước khi bất kỳ ai chỉnh sửa",
      "Đoạn mã do Git tự động gợi ý sửa đổi"
    ],
    answer: 1,
    explanation: "Trong đánh dấu conflict của Git: `<<<<<<< HEAD` đến `=======` là code thuộc nhánh hiện tại bạn đang checkout đứng ở đó; còn từ `=======` đến `>>>>>>> <branch_name>` là code từ nhánh đang được gộp vào."
  },
  {
    id: 16,
    part: "git",
    topic: "Nhánh & Conflict",
    question: "Lệnh nào sau đây vừa tạo một nhánh mới có tên `feature-payment`, vừa tự động chuyển sang nhánh đó?",
    options: [
      "git branch feature-payment",
      "git checkout -b feature-payment (hoặc git switch -c feature-payment)",
      "git move feature-payment",
      "git init feature-payment"
    ],
    answer: 1,
    explanation: "Lệnh `git checkout -b <tên_nhánh>` hoặc lệnh hiện đại `git switch -c <tên_nhánh>` kết hợp cả hai thao tác: tạo nhánh mới và chuyển ngay con trỏ HEAD sang nhánh đó."
  },

  // ==========================================
  // PHẦN 1.3: REMOTE REPOSITORY & PULL REQUEST (Q17 - Q24)
  // ==========================================
  {
    id: 17,
    part: "git",
    topic: "Remote & PR",
    question: "Sự khác biệt quan trọng giữa `git fetch` và `git pull` là gì?",
    options: [
      "`git fetch` chỉ tải dữ liệu mới từ remote về repo cục bộ mà KHÔNG thay đổi code trong Working Directory; `git pull` kết hợp fetch và tự động merge vào nhánh hiện tại",
      "`git fetch` đẩy code lên server, còn `git pull` lấy code về máy",
      "`git fetch` làm thay đổi mã nguồn ngay lập tức, còn `git pull` chỉ kiểm tra kết nối mạng",
      "`git fetch` chỉ dùng cho GitHub, còn `git pull` dùng cho GitLab"
    ],
    answer: 0,
    explanation: "`git fetch` chỉ tải về các commit, file, ref mới từ remote mà không hề can thiệp hay sửa đổi thư mục làm việc của bạn (an toàn để kiểm tra). Trong khi `git pull` tương đương với `git fetch` cộng thêm `git merge`, tự động gộp code vào nhánh bạn đang đứng."
  },
  {
    id: 18,
    part: "git",
    topic: "Remote & PR",
    question: "Lệnh nào dùng để sao chép toàn bộ một kho lưu trữ từ máy chủ từ xa (GitHub) về máy tính cá nhân lần đầu tiên?",
    options: [
      "git pull origin main",
      "git clone <repository_url>",
      "git checkout <repository_url>",
      "git copy <repository_url>"
    ],
    answer: 1,
    explanation: "`git clone` là lệnh sao chép toàn bộ mã nguồn, tất cả các nhánh và toàn bộ lịch sử commit từ remote repository về máy cục bộ và tự động thiết lập remote origin."
  },
  {
    id: 19,
    part: "git",
    topic: "Remote & PR",
    question: "Quy trình thực hiện Pull Request (PR) chuẩn trong nhóm phát triển gồm 6 bước theo thứ tự nào?",
    options: [
      "Merge → Commit → Push → Tạo nhánh → Review → Mở PR",
      "Tạo nhánh mới → Thực hiện commit → Push nhánh lên remote → Mở PR trên GitHub → Code Review → Merge vào nhánh chính",
      "Mở PR → Code trên master → Push → Review → Commit → Xoá repo",
      "Clone repo → Push trực tiếp vào main → Mở PR → Sửa lỗi → Merge"
    ],
    answer: 1,
    explanation: "Quy trình PR 6 bước chuẩn mực: (1) Tạo nhánh tính năng riêng → (2) Code và Commit cục bộ → (3) Push nhánh lên remote → (4) Mở Pull Request → (5) Review code & thảo luận → (6) Merge nhánh vào main/develop."
  },
  {
    id: 20,
    part: "git",
    topic: "Remote & PR",
    question: "Theo DevOps Best Practice, kích thước lý tưởng của một Pull Request (PR) nên là bao nhiêu để việc review đạt hiệu quả cao nhất?",
    options: [
      "Càng nhiều code càng tốt, tối thiểu 2.000 dòng để review một thể",
      "Nhỏ gọn, lý tưởng là dưới 400 dòng code thay đổi",
      "Chính xác 1.000 dòng code",
      "Không giới hạn số dòng, chỉ cần hoàn thành toàn bộ module lớn"
    ],
    answer: 1,
    explanation: "Nghiên cứu công nghệ chỉ ra rằng khi PR vượt quá 400 dòng code, khả năng phát hiện lỗi của reviewer giảm mạnh do quá tải nhận thức. PR nhỏ (<400 dòng) giúp review nhanh, chất lượng phản biện cao và dễ dàng revert nếu có lỗi."
  },
  {
    id: 21,
    part: "git",
    topic: "Remote & PR",
    question: "Khung thời gian khuyến nghị để hoàn thành việc phản hồi/review một Pull Request trong nhóm là bao lâu?",
    options: [
      "Trong vòng 24 giờ",
      "Sau ít nhất 1 tuần để có thời gian suy nghĩ",
      "Bất cứ lúc nào rảnh, không giới hạn",
      "Ngay lập tức trong vòng 5 phút bằng cách bấm Approve không cần đọc code"
    ],
    answer: 0,
    explanation: "Quy tắc 24h: PR nên được phản hồi hoặc duyệt trong vòng 24 giờ làm việc để tránh tình trạng tắc nghẽn luồng CI/CD, giảm nguy cơ code bị stale (lỗi thời) và xung đột với các commit mới của đồng đội."
  },
  {
    id: 22,
    part: "git",
    topic: "Remote & PR",
    question: "Mục đích cốt lõi và cao quý nhất của hoạt động Code Review là gì?",
    options: [
      "Tìm lỗi sai của đồng nghiệp để trừ điểm đánh giá hiệu suất (KPI)",
      "Bảo vệ codebase chung, nâng cao chất lượng mã nguồn và chia sẻ kiến thức giữa các thành viên",
      "Bắt buộc người viết code phải viết lại theo phong cách cá nhân của reviewer",
      "Kéo dài thời gian bàn giao dự án để giảm áp lực tiến độ"
    ],
    answer: 1,
    explanation: "Code Review không phải là cuộc soi mói cá nhân. Mục đích cốt lõi là xây dựng lớp phòng thủ thứ hai bảo vệ codebase chung, đảm bảo chuẩn mực thiết kế, bảo mật, và là cơ hội để cả người viết lẫn người review cùng học hỏi và chuyển giao kiến thức."
  },
  {
    id: 23,
    part: "git",
    topic: "Remote & PR",
    question: "Lệnh nào sau đây dùng để đẩy nhánh cục bộ `feature-auth` lên server remote `origin` và thiết lập tracking?",
    options: [
      "git push origin feature-auth -u (hoặc --set-upstream)",
      "git commit -u feature-auth",
      "git remote add feature-auth",
      "git upload origin feature-auth"
    ],
    answer: 0,
    explanation: "`git push -u origin feature-auth` đẩy nhánh lên remote và cờ `-u` thiết lập liên kết theo dõi (upstream tracking), giúp những lần sau bạn chỉ cần gõ `git push` hoặc `git pull` mà không cần chỉ rõ tên remote và branch."
  },
  {
    id: 24,
    part: "git",
    topic: "Remote & PR",
    question: "Để xem danh sách các địa chỉ Remote Repository đang được liên kết với repo cục bộ, bạn dùng lệnh:",
    options: [
      "git remote -v",
      "git link --all",
      "git server -show",
      "git url -list"
    ],
    answer: 0,
    explanation: "`git remote -v` hiển thị tên viết tắt (như origin) kèm theo URL fetch và push chi tiết của các kho lưu trữ từ xa."
  },

  // ==========================================
  // PHẦN 1.4: KỸ THUẬT GIT NÂNG CAO (Q25 - Q33)
  // ==========================================
  {
    id: 25,
    part: "git",
    topic: "Git Nâng cao",
    question: "Lệnh `git stash` được sử dụng trong tình huống thực tế nào?",
    options: [
      "Xoá vĩnh viễn toàn bộ các commit bị lỗi trong lịch sử dự án",
      "Tạm cất các thay đổi chưa hoàn thành vào bộ nhớ đệm để chuyển sang nhánh khác sửa lỗi gấp mà không cần commit dở dang",
      "Đóng gói toàn bộ mã nguồn thành file zip để gửi qua email cho khách hàng",
      "Khởi động lại máy chủ Git từ xa khi gặp sự cố"
    ],
    answer: 1,
    explanation: "`git stash` giống như một ngăn kéo bí mật: nó lưu lại trạng thái các file modified và staged vào một ngăn xếp (stack), dọn sạch working directory để bạn có thể chuyển nhánh làm việc khẩn cấp mà không để lại các commit 'rác' (WIP commit)."
  },
  {
    id: 26,
    part: "git",
    topic: "Git Nâng cao",
    question: "Sau khi dùng `git stash`, lệnh nào giúp lấy lại những thay đổi vừa cất và ĐỒNG THỜI xoá bản lưu đó khỏi danh sách stash?",
    options: [
      "git stash apply",
      "git stash pop",
      "git stash drop",
      "git stash clear"
    ],
    answer: 1,
    explanation: "`git stash pop` sẽ áp dụng các thay đổi ở đỉnh ngăn xếp stash vào working directory và lập tức xoá mục đó khỏi stash list. Nếu dùng `git stash apply`, thay đổi vẫn được áp dụng nhưng mục stash cũ vẫn được giữ lại."
  },
  {
    id: 27,
    part: "git",
    topic: "Git Nâng cao",
    question: "Phương pháp nào sau đây là AN TOÀN NHẤT để huỷ bỏ một commit đã được đẩy lên nhánh chung (remote repository)?",
    options: [
      "git reset --hard HEAD~1 rồi chạy `git push --force`",
      "git revert <commit_hash>",
      "Xoá thư mục .git rồi clone lại từ đầu",
      "git clean -fd"
    ],
    answer: 1,
    explanation: "`git revert <commit_hash>` an toàn tuyệt đối vì nó KHÔNG xoá lịch sử cũ, mà tạo ra một commit MỚI có nội dung đảo ngược lại hoàn toàn so với commit bị lỗi. Điều này giúp các thành viên khác trong nhóm pull về bình thường mà không bị vỡ lịch sử."
  },
  {
    id: 28,
    part: "git",
    topic: "Git Nâng cao",
    question: "Khi thực hiện lệnh `git reset <commit>` với cờ `--soft`, điều gì sẽ xảy ra?",
    options: [
      "Chỉ di chuyển con trỏ HEAD về commit cũ; toàn bộ thay đổi vẫn được giữ nguyên và nằm trong vùng Staging Area",
      "Xoá sạch toàn bộ mã nguồn và đưa thư mục làm việc về trạng thái rỗng",
      "Di chuyển HEAD và đưa toàn bộ thay đổi về Working Directory (huỷ trạng thái Staged)",
      "Đảo ngược mã nguồn và tự động tạo commit mới"
    ],
    answer: 0,
    explanation: "`git reset --soft` là mức độ nhẹ nhất: nó chỉ kéo con trỏ HEAD lùi lại commit chỉ định, còn tất cả các file đã thay đổi vẫn nằm nguyên vẹn trong Staging Area (sẵn sàng để bạn commit lại với message mới hoặc gộp commit)."
  },
  {
    id: 29,
    part: "git",
    topic: "Git Nâng cao",
    question: "Cấp độ nào của lệnh `git reset` là NGUY HIỂM NHẤT vì sẽ xoá sạch mọi thay đổi trong cả Staging Area lẫn Thư mục làm việc?",
    options: [
      "git reset --soft",
      "git reset --mixed",
      "git reset --hard",
      "git reset --keep"
    ],
    answer: 2,
    explanation: "`git reset --hard` là lệnh phá huỷ: nó di chuyển HEAD đồng thời xoá sạch tất cả thay đổi trong Staging Area và Working Directory, đưa toàn bộ code về đúng trạng thái của commit chỉ định. Mọi code chưa commit sẽ bị mất vĩnh viễn (nếu không có reflog)."
  },
  {
    id: 30,
    part: "git",
    topic: "Git Nâng cao",
    question: "Để đưa một tệp tin ra khỏi vùng chuẩn bị (Staging Area) trở về trạng thái unstaged mà KHÔNG làm mất nội dung sửa đổi trong file, bạn dùng lệnh:",
    options: [
      "git restore --staged <file> (hoặc git rm --cached <file>)",
      "git rm -f <file>",
      "git checkout --all",
      "git stash clear"
    ],
    answer: 0,
    explanation: "`git restore --staged <file>` loại bỏ file khỏi staging area mà giữ nguyên nội dung bạn đã gõ trong file. Tương tự, `git rm --cached <file>` cũng đưa file ra khỏi theo dõi của staging."
  },
  {
    id: 31,
    part: "git",
    topic: "Git Nâng cao",
    question: "Lệnh `git restore <file>` (không có cờ `--staged`) có tác dụng gì đối với một file trong Working Directory?",
    options: [
      "Đưa file vào Staging Area",
      "Huỷ bỏ các thay đổi chưa staged trong file, khôi phục nội dung file về trạng thái của commit gần nhất",
      "Tạo một nhánh mới có tên trùng với tên file",
      "Tải file đó từ GitHub về máy"
    ],
    answer: 1,
    explanation: "`git restore <file>` hoàn tác các chỉnh sửa chưa lưu trong thư mục làm việc, biến file trở lại nội dung y hệt như lần commit gần nhất (thay thế cho lệnh cũ `git checkout -- <file>`). Thao tác này không thể hoàn tác nếu chưa commit."
  },
  {
    id: 32,
    part: "git",
    topic: "Git Nâng cao",
    question: "Công cụ 'cứu cánh' nào trong Git ghi lại toàn bộ lịch sử di chuyển của con trỏ HEAD (trong khoảng 90 ngày), giúp bạn phục hồi commit bị mất do lỡ chạy `git reset --hard`?",
    options: [
      "git reflog",
      "git backup",
      "git history",
      "git rescue"
    ],
    answer: 0,
    explanation: "`git reflog` (Reference Log) là cuốn nhật ký hoạt động nội bộ của Git. Nó ghi lại mọi thao tác làm thay đổi HEAD (commit, checkout, rebase, reset). Ngay cả khi bạn lỡ tay reset --hard, commit cũ vẫn tồn tại trong reflog và bạn hoàn toàn có thể khôi phục lại được trong vòng 90 ngày."
  },
  {
    id: 33,
    part: "git",
    topic: "Git Nâng cao",
    question: "Cấp độ mặc định của lệnh `git reset` (khi không truyền flag `--soft` hay `--hard`) là gì?",
    options: [
      "--soft",
      "--mixed (di chuyển HEAD, xoá Staging, nhưng giữ lại thay đổi ở Working Directory)",
      "--hard",
      "--abort"
    ],
    answer: 1,
    explanation: "Mặc định `git reset <commit>` là `--mixed`. Nó đưa HEAD về commit chỉ định, làm rỗng Staging Area, nhưng vẫn giữ nguyên tất cả mã nguồn đã sửa đổi trong thư mục làm việc (Working Directory) dưới dạng unstaged."
  },

  // ==========================================
  // PHẦN 2.1: LINUX KIẾN TRÚC & CLI (Q34 - Q42)
  // ==========================================
  {
    id: 34,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Đặc điểm cốt lõi nào sau đây mô tả chính xác môi trường quản trị Ubuntu Server?",
    options: [
      "Chỉ thao tác bằng giao diện đồ hoạ Desktop GUI và chuột cảm ứng",
      "Hoạt động hoàn toàn qua giao diện dòng lệnh (CLI), tiết kiệm tài nguyên và tuân theo triết lý 'Mọi thứ đều là tập tin' (Everything is a file)",
      "Không hỗ trợ kết nối mạng từ xa qua Internet",
      "Mỗi người dùng đều phải có quyền root mới có thể đăng nhập"
    ],
    answer: 1,
    explanation: "Ubuntu Server chuẩn doanh nghiệp hoạt động thuần CLI (không cài GUI để tối ưu hiệu năng và RAM). Triết lý cốt lõi của Unix/Linux là 'Everything is a file' - từ tệp văn bản, thư mục, tiến trình đến các thiết bị phần cứng (ổ cứng, card mạng) đều được trừu tượng hoá dưới dạng tập tin."
  },
  {
    id: 35,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Kiến trúc hệ điều hành Linux gồm 4 tầng phân cấp từ trên xuống dưới theo thứ tự nào?",
    options: [
      "Phần cứng (Hardware) → Shell → Kernel → Ứng dụng (Applications)",
      "Ứng dụng (Applications) → Vỏ lệnh (Shell) → Nhân (Kernel) → Phần cứng (Hardware)",
      "Kernel → Shell → BIOS → RAM",
      "User → Root → Group → File"
    ],
    answer: 1,
    explanation: "Kiến trúc Linux 4 tầng: (1) Applications (phần mềm người dùng); (2) Shell (trình phiên dịch lệnh như Bash/Zsh); (3) Kernel (nhân Linux quản lý CPU, RAM, I/O); (4) Hardware (phần cứng máy tính vật lý)."
  },
  {
    id: 36,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Trong cấu trúc cây thư mục Linux, thư mục `/etc` đóng vai trò gì quan trọng nhất?",
    options: [
      "Chứa các tệp thực thi của người dùng thông thường",
      "Chứa toàn bộ các tệp tin cấu hình (configuration files) của hệ thống và các dịch vụ",
      "Chứa các tập tin log ghi nhận nhật ký hoạt động",
      "Chứa mã nguồn hệ điều hành chưa biên dịch"
    ],
    answer: 1,
    explanation: "Thư mục `/etc` (Editable Text Configuration) là nơi lưu trữ tất cả các file cấu hình toàn hệ thống (ví dụ: `/etc/passwd`, `/etc/shadow`, `/etc/ssh/sshd_config`, `/etc/nginx/nginx.conf`)."
  },
  {
    id: 37,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Thư mục nào trong Linux là hệ thống tệp ảo (virtual filesystem) chứa thông tin thời gian thực về các tiến trình đang chạy và phần cứng?",
    options: [
      "/var",
      "/proc",
      "/home",
      "/boot"
    ],
    answer: 1,
    explanation: "`/proc` là một pseudo-filesystem được tạo tự động trong bộ nhớ RAM bởi Kernel. Nó không chiếm dung lượng ổ đĩa thật mà cung cấp giao diện để người dùng/hệ thống đọc trạng thái phần cứng và các tiến trình (PID) đang chạy (vd: `/proc/cpuinfo`, `/proc/meminfo`)."
  },
  {
    id: 38,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Thư mục `/var` trên máy chủ Ubuntu thường được dùng để lưu trữ dữ liệu nào?",
    options: [
      "Các file tĩnh của nhân hệ điều hành",
      "Dữ liệu biến động thường xuyên (Variable data) như log hệ thống (/var/log), cơ sở dữ liệu và hàng đợi",
      "Tài liệu học tập của quản trị viên",
      "Chỉ dùng để chứa file sao lưu backup hàng tuần"
    ],
    answer: 1,
    explanation: "`/var` đại diện cho 'Variable'. Đây là nơi chứa các dữ liệu thay đổi kích thước liên tục trong suốt vòng đời của hệ thống, đặc biệt là log máy chủ (`/var/log/syslog`, `/var/log/nginx`), thư mục web (`/var/www`) hoặc database."
  },
  {
    id: 39,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Lệnh nào sau đây dùng để liệt kê tất cả các tệp (kể cả tệp ẩn bắt đầu bằng dấu chấm), hiển thị chi tiết quyền hạn, chủ sở hữu và dung lượng dạng dễ đọc (human-readable)?",
    options: [
      "ls -lah",
      "dir /all",
      "list -f",
      "show --all"
    ],
    answer: 0,
    explanation: "Trong lệnh `ls -lah`: `-l` (long listing format - hiện quyền, owner, size), `-a` (all - hiện cả file ẩn), `-h` (human-readable - hiện kích thước dạng KB, MB, GB thay vì số bytes thô)."
  },
  {
    id: 40,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Để tạo một cây thư mục lồng nhau `project/src/controllers` khi các thư mục cha chưa hề tồn tại, bạn dùng lệnh:",
    options: [
      "mkdir project/src/controllers",
      "mkdir -p project/src/controllers",
      "create-dir -r project/src/controllers",
      "touch -d project/src/controllers"
    ],
    answer: 1,
    explanation: "Cờ `-p` (parents) trong lệnh `mkdir -p` cho phép tự động tạo tất cả các thư mục cha trung gian nếu chúng chưa tồn tại mà không báo lỗi."
  },
  {
    id: 41,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Chuỗi phân quyền 10 ký tự trong Linux (ví dụ: `-rwxr-xr--`) được phân chia thành 3 nhóm quyền theo thứ tự nào từ trái qua phải (bỏ qua ký tự loại file đầu tiên)?",
    options: [
      "Others (Khác) → Group (Nhóm) → Owner (Chủ sở hữu)",
      "Owner (Chủ sở hữu) → Group (Nhóm) → Others (Người dùng khác)",
      "Root → Admin → Guest",
      "Read → Write → Execute"
    ],
    answer: 1,
    explanation: "Sau ký tự đầu tiên chỉ loại file (`-` là file, `d` là thư mục), 9 ký tự tiếp theo chia làm 3 cụm, mỗi cụm 3 ký tự (rwx): Cụm 1 dành cho Owner (Chủ sở hữu), Cụm 2 dành cho Group (Nhóm sở hữu), Cụm 3 dành cho Others (Tất cả người dùng còn lại)."
  },
  {
    id: 42,
    part: "linux",
    topic: "Linux CLI & Kiến trúc",
    question: "Trong hệ thống cấp quyền số bát phân (octal), quyền Đọc (r), Ghi (w), Thực thi (x) có giá trị tương ứng là bao nhiêu và lệnh `chmod 755 deploy.sh` gán quyền như thế nào?",
    options: [
      "r=1, w=2, x=3; Cấp quyền đọc cho tất cả mọi người",
      "r=4, w=2, x=1; Owner có toàn quyền (rwx=7), Group và Others có quyền đọc và thực thi (r-x=5)",
      "r=2, w=4, x=1; Chỉ cấp quyền ghi cho Owner",
      "r=4, w=2, x=0; Khóa tệp tin không cho ai chạy"
    ],
    answer: 1,
    explanation: "Hệ số quyền Linux: Read = 4, Write = 2, Execute = 1. Con số 755 tương ứng với: Owner = 4+2+1 = 7 (rwx - toàn quyền); Group = 4+0+1 = 5 (r-x - đọc và thực thi); Others = 4+0+1 = 5 (r-x - đọc và thực thi)."
  },

  // ==========================================
  // PHẦN 2.2: LINUX QUẢN LÝ USER & GROUP (Q43 - Q50)
  // ==========================================
  {
    id: 43,
    part: "linux",
    topic: "Linux User & Group",
    question: "Trong hệ điều hành Linux, tài khoản quản trị tối cao (root) luôn luôn sở hữu User ID (UID) mang giá trị là bao nhiêu?",
    options: [
      "UID = 1",
      "UID = 0",
      "UID = 1000",
      "UID = -1"
    ],
    answer: 1,
    explanation: "Theo chuẩn POSIX Linux, tài khoản root luôn có `UID = 0` và `GID = 0`. Các tài khoản hệ thống (system daemon) thường có UID từ 1 đến 999, còn người dùng thông thường được cấp UID từ 1000 trở lên."
  },
  {
    id: 44,
    part: "linux",
    topic: "Linux User & Group",
    question: "Danh sách tất cả các tài khoản người dùng trên hệ thống Linux được lưu trữ trong tệp tin nào?",
    options: [
      "/etc/users",
      "/etc/passwd",
      "/etc/shadow",
      "/var/account"
    ],
    answer: 1,
    explanation: "Tệp `/etc/passwd` chứa danh sách tất cả các tài khoản người dùng trong hệ thống kèm thông tin: username, UID, GID, thư mục home và shell mặc định. Tệp này có quyền đọc công khai (read) cho tất cả user."
  },
  {
    id: 45,
    part: "linux",
    topic: "Linux User & Group",
    question: "Tệp tin nào lưu trữ mật khẩu đã được băm mã hoá (hashed password) của người dùng và chỉ tài khoản root mới có quyền đọc?",
    options: [
      "/etc/passwd",
      "/etc/shadow",
      "/etc/security",
      "/etc/group"
    ],
    answer: 1,
    explanation: "Để đảm bảo an toàn, Linux tách mật khẩu ra khỏi `/etc/passwd` và lưu dưới dạng hash mã hoá trong `/etc/shadow`. Tệp này được phân quyền cực kỳ nghiêm ngặt (`-rw-r-----` hoặc `-r--------`) chỉ root mới có thể đọc."
  },
  {
    id: 46,
    part: "linux",
    topic: "Linux User & Group",
    question: "Để thêm người dùng `devops` vào nhóm phụ `docker` mà KHÔNG làm mất các nhóm phụ hiện tại của họ, bạn BẮT BUỘC phải dùng cú pháp nào?",
    options: [
      "usermod -G docker devops",
      "usermod -aG docker devops",
      "useradd -g docker devops",
      "groupadd docker devops"
    ],
    answer: 1,
    explanation: "Bắt buộc phải dùng `-aG` (`-a` là append - nối thêm; `-G` là supplementary group). Nếu bạn quên cờ `-a` mà chỉ gõ `-G`, người dùng sẽ bị xóa khỏi TẤT CẢ các nhóm phụ khác trước đó và chỉ còn thuộc duy nhất nhóm mới chỉ định!"
  },
  {
    id: 47,
    part: "linux",
    topic: "Linux User & Group",
    question: "Hậu quả nghiêm trọng nào sẽ xảy ra nếu quản trị viên chạy lệnh `usermod -G sudo ubuntu` mà quên cờ `-a`?",
    options: [
      "Người dùng ubuntu sẽ bị xoá tài khoản ngay lập tức",
      "Người dùng ubuntu sẽ bị gỡ bỏ khỏi tất cả các nhóm phụ khác (như adm, dialout, cdrom, docker...) mà họ đang tham gia",
      "Lệnh sẽ báo lỗi cú pháp và không thực hiện gì",
      "Hệ thống sẽ tự động đổi mật khẩu của tài khoản ubuntu"
    ],
    answer: 1,
    explanation: "Khi không có cờ `-a` (append), lệnh `usermod -G` sẽ ghi đè toàn bộ danh sách nhóm phụ. Người dùng sẽ bị mất toàn bộ tư cách thành viên trong các nhóm phụ cũ, có thể dẫn đến việc mất quyền truy cập tài nguyên nghiêm trọng."
  },
  {
    id: 48,
    part: "linux",
    topic: "Linux User & Group",
    question: "Tại sao khi chỉnh sửa tệp cấp quyền sudo `/etc/sudoers`, quản trị viên BẮT BUỘC phải sử dụng lệnh `visudo` thay vì các trình soạn thảo thông thường (như nano hay vim)?",
    options: [
      "Vì `visudo` có tốc độ mở tệp nhanh hơn các trình soạn thảo khác",
      "Vì `visudo` tự động kiểm tra tính hợp lệ của cú pháp trước khi lưu; nếu có lỗi cú pháp, nó ngăn lưu file để tránh làm hỏng cấu hình và vô hiệu hoá vĩnh viễn quyền sudo của toàn hệ thống",
      "Vì Linux cấm tất cả các trình soạn thảo khác truy cập vào thư mục /etc",
      "Vì `visudo` tự động đẩy cấu hình lên Git"
    ],
    answer: 1,
    explanation: "`visudo` tích hợp cơ chế khóa file chống sửa đổi đồng thời và đặc biệt là Syntax Checker. Nếu file `/etc/sudoers` bị sai dù chỉ một dấu phẩy, toàn bộ lệnh `sudo` trên máy chủ sẽ bị tê liệt, khiến không ai có thể lấy quyền quản trị được nữa. `visudo` bảo vệ bạn khỏi sai lầm chết người này."
  },
  {
    id: 49,
    part: "linux",
    topic: "Linux User & Group",
    question: "Cơ chế `sudo` (Superuser Do) mang lại lợi thế bảo mật nào so với việc đăng nhập trực tiếp bằng tài khoản `root`?",
    options: [
      "Cho phép chia sẻ mật khẩu root cho nhiều người dùng",
      "Cung cấp quyền thực thi đặc quyền có kiểm soát, lưu vết kiểm toán (audit log) chi tiết trong `/var/log/auth.log` và tránh tai nạn do thao tác sai của root",
      "Tăng tốc độ xử lý CPU của hệ thống lên gấp đôi",
      "Tự động chặn các cuộc tấn công mạng DDoS từ bên ngoài"
    ],
    answer: 1,
    explanation: "Sử dụng `sudo` giúp áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege). Mỗi lệnh chạy với sudo đều được ghi log rõ ai làm, lúc nào, chạy lệnh gì. Ngoài ra, việc dùng sudo bằng chính mật khẩu cá nhân giúp không cần chia sẻ mật khẩu root cho nhiều người."
  },
  {
    id: 50,
    part: "linux",
    topic: "Linux User & Group",
    question: "Tệp tin `/etc/group` trong Linux chứa thông tin gì?",
    options: [
      "Danh sách các phần mềm đã cài đặt trên máy chủ",
      "Danh sách tất cả các nhóm (Group), GID và danh sách các thành viên thuộc nhóm đó",
      "Địa chỉ IP của các nhóm máy chủ trong mạng LAN",
      "Các quy tắc phân quyền tường lửa UFW"
    ],
    answer: 1,
    explanation: "`/etc/group` định nghĩa các nhóm trong hệ điều hành với cấu trúc mỗi dòng: `group_name:password_placeholder:GID:user_list`."
  },

  // ==========================================
  // PHẦN 2.3: LINUX QUẢN LÝ NETWORK (Q51 - Q59)
  // ==========================================
  {
    id: 51,
    part: "linux",
    topic: "Linux Network",
    question: "Điểm khác biệt căn bản giữa hai giao thức mạng TCP và UDP là gì?",
    options: [
      "TCP không kiểm tra lỗi và truyền nhanh hơn; UDP đảm bảo tin cậy tuyệt đối",
      "TCP là giao thức hướng kết nối (Connection-oriented), đảm bảo truyền tin cậy và toàn vẹn dữ liệu (vd: HTTP, SSH); UDP không bắt tay kết nối, ưu tiên tốc độ nhanh (vd: DNS, video streaming)",
      "TCP chỉ chạy trên mạng cục bộ LAN; UDP chỉ chạy trên môi trường Internet",
      "TCP dùng cổng 80, còn UDP dùng cổng 443"
    ],
    answer: 1,
    explanation: "TCP thiết lập kết nối 3 bước (3-way handshake), kiểm tra checksum và truyền lại gói tin lỗi, đảm bảo 100% dữ liệu tới đích. UDP bỏ qua kiểm tra bắt tay và xác nhận, gửi dữ liệu đi ngay lập tức nhằm đạt tốc độ tối đa và độ trễ cực thấp."
  },
  {
    id: 52,
    part: "linux",
    topic: "Linux Network",
    question: "Lệnh hiện đại nào trên Ubuntu Linux được khuyến nghị sử dụng để xem địa chỉ IP và trạng thái card mạng thay thế cho lệnh cũ `ifconfig`?",
    options: [
      "ip a (hoặc ip addr)",
      "netstat -i",
      "show-ip",
      "network-config"
    ],
    answer: 0,
    explanation: "Bộ công cụ `iproute2` với lệnh `ip a` (hoặc `ip addr show`) đã thay thế hoàn toàn công cụ cổ điển `ifconfig` (thuộc gói net-tools đã bị khai tử trên các bản Linux hiện đại)."
  },
  {
    id: 53,
    part: "linux",
    topic: "Linux Network",
    question: "Để kiểm tra danh sách các cổng mạng (ports) đang mở và tiến trình nào đang lắng nghe (listening), lệnh hiện đại thay thế cho `netstat` là gì?",
    options: [
      "ss -tunlp",
      "ip route",
      "curl -p",
      "ping -l"
    ],
    answer: 0,
    explanation: "Lệnh `ss` (Socket Statistics) thay thế `netstat` với tốc độ truy vấn kernel nhanh hơn rất nhiều. Cú pháp `ss -tunlp` là tiêu chuẩn của DevOps để kiểm tra port mở."
  },
  {
    id: 54,
    part: "linux",
    topic: "Linux Network",
    question: "Trong lệnh `ss -tunlp`, các cờ tham số `-t`, `-u`, `-n`, `-l`, `-p` mang ý nghĩa lần lượt là gì?",
    options: [
      "-t (TCP), -u (UDP), -n (hiển thị số port/IP thay vì tên miền/dịch vụ), -l (Listening sockets), -p (Process ID/tên tiến trình)",
      "-t (Time), -u (User), -n (Network), -l (Limit), -p (Ping)",
      "-t (Total), -u (Upload), -n (Node), -l (Local), -p (Public)",
      "-t (Terminal), -u (Ubuntu), -n (New), -l (Log), -p (Port)"
    ],
    answer: 0,
    explanation: "Giải nghĩa cờ `ss`: `-t`: lọc socket TCP; `-u`: lọc socket UDP; `-n`: numeric (hiện port 80 thay vì dịch vụ 'http'); `-l`: chỉ lấy socket đang ở trạng thái LISTENING; `-p`: hiện Process ID và tên chương trình sở hữu socket."
  },
  {
    id: 55,
    part: "linux",
    topic: "Linux Network",
    question: "Để kiểm tra độ trễ mạng (latency) và kiểm tra xem máy chủ từ xa có đang phản hồi gói tin ICMP hay không, bạn sử dụng lệnh:",
    options: [
      "ping <IP_hoặc_Domain>",
      "ss <IP_hoặc_Domain>",
      "top <IP_hoặc_Domain>",
      "cat <IP_hoặc_Domain>"
    ],
    answer: 0,
    explanation: "`ping` gửi các gói tin ICMP Echo Request tới địa chỉ máy chủ và tính toán thời gian phản hồi (Round-Trip Time - RTT) cũng như tỉ lệ thất thoát gói tin (packet loss)."
  },
  {
    id: 56,
    part: "linux",
    topic: "Linux Network",
    question: "LƯU Ý KINH ĐIỂN: Khi quản trị máy chủ Ubuntu Server từ xa qua SSH, bạn BẮT BUỘC phải thực hiện lệnh nào TRƯỚC KHI kích hoạt tường lửa `sudo ufw enable`?",
    options: [
      "sudo ufw allow 80/tcp",
      "sudo ufw allow 22/tcp (hoặc sudo ufw allow ssh)",
      "sudo ufw default deny outgoing",
      "sudo ufw disable ping"
    ],
    answer: 1,
    explanation: "Mặc định khi UFW được bật, chính sách mặc định là chặn tất cả các kết nối đến (incoming). Nếu bạn chưa mở cổng SSH (port 22) mà đã vội gõ `ufw enable`, phiên kết nối SSH hiện tại sẽ bị ngắt và bạn sẽ bị 'KHOÁ BÊN NGOÀI' vĩnh viễn, không thể đăng nhập lại vào máy chủ!"
  },
  {
    id: 57,
    part: "linux",
    topic: "Linux Network",
    question: "Lệnh CLI mạnh mẽ nào dùng để gửi HTTP request (GET, POST...) kiểm tra phản hồi từ web service, API hoặc tải file trực tiếp trên terminal?",
    options: [
      "curl",
      "nano",
      "ssh",
      "grep"
    ],
    answer: 0,
    explanation: "`curl` (Client URL) là công cụ dòng lệnh vạn năng của DevOps để truyền dữ liệu qua các giao thức mạng (HTTP, HTTPS, FTP...), cực kỳ hữu ích để test API, kiểm tra header phản hồi hoặc tải script cài đặt."
  },
  {
    id: 58,
    part: "linux",
    topic: "Linux Network",
    question: "Để tra cứu thông tin phân giải tên miền DNS (Domain Name Resolution) và xem bản ghi DNS chi tiết, bạn sử dụng công cụ nào?",
    options: [
      "nslookup hoặc dig",
      "chmod hoặc chown",
      "kill hoặc killall",
      "free hoặc df"
    ],
    answer: 0,
    explanation: "`nslookup` và `dig` (Domain Information Groper) là 2 công cụ mạng chuẩn mực dùng để truy vấn DNS server, kiểm tra các bản ghi A, CNAME, MX, TXT nhằm chẩn đoán sự cố phân giải tên miền."
  },
  {
    id: 59,
    part: "linux",
    topic: "Linux Network",
    question: "Lệnh nào sau đây dùng để kiểm tra trạng thái hoạt động hiện tại và danh sách các quy tắc mở cổng của tường lửa UFW?",
    options: [
      "sudo ufw status (hoặc sudo ufw status verbose)",
      "sudo ufw list-all",
      "sudo firewall-cmd",
      "sudo iptables -save"
    ],
    answer: 0,
    explanation: "`sudo ufw status` hiển thị tường lửa đang active hay inactive, cùng bảng danh sách các cổng và giao thức (Action, From, To) đang được cho phép hoặc chặn."
  },

  // ==========================================
  // PHẦN 2.4: LINUX QUẢN LÝ PROCESS & SYSTEMD (Q60 - Q68)
  // ==========================================
  {
    id: 60,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Tiến trình (Process) trong hệ điều hành Linux được định nghĩa là gì và được hệ điều hành quản lý thông qua định danh nào?",
    options: [
      "Là một tập tin văn bản tĩnh lưu trên ổ cứng, định danh bằng tên file",
      "Là một chương trình đang được thực thi trên bộ nhớ RAM và CPU, được định danh bằng số Process ID (PID)",
      "Là một người dùng đang đăng nhập vào terminal, định danh bằng UID",
      "Là một gói phần mềm đang chờ cài đặt, định danh bằng số phiên bản"
    ],
    answer: 1,
    explanation: "Process là một thực thể động của chương trình đang chạy trong bộ nhớ máy tính. Mỗi tiến trình có một không gian địa chỉ riêng trong RAM, có quan hệ Cha-Con (Parent-Child) và được Kernel gán một mã số duy nhất gọi là PID (Process ID)."
  },
  {
    id: 61,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Lệnh nào sau đây dùng để liệt kê danh sách chi tiết tất cả các tiến trình đang chạy của mọi người dùng trên toàn bộ hệ thống Linux?",
    options: [
      "ps aux",
      "tasklist /v",
      "process show",
      "service --list"
    ],
    answer: 0,
    explanation: "Lệnh `ps aux`: `a` (hiển thị tiến trình của tất cả người dùng), `u` (hiển thị dưới dạng thông tin chi tiết: user, %CPU, %MEM), `x` (hiển thị cả các tiến trình không gắn với terminal tty)."
  },
  {
    id: 62,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Công cụ dòng lệnh tương tác nào cung cấp giao diện trực quan màu sắc, thanh đo CPU/RAM và hỗ trợ dùng chuột để theo dõi tài nguyên tốt hơn lệnh `top` truyền thống?",
    options: [
      "htop",
      "nano",
      "vim",
      "grep"
    ],
    answer: 0,
    explanation: "`htop` là phiên bản nâng cấp trực quan tuyệt vời của `top`. Nó hiển thị thanh đo tiến trình theo thời gian thực với màu sắc sinh động, cho phép cuộn danh sách, sắp xếp theo %CPU, %RAM và gửi tín hiệu kill tiến trình cực kỳ tiện lợi."
  },
  {
    id: 63,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Để kiểm tra dung lượng bộ nhớ RAM vật lý còn trống, đã dùng và vùng nhớ đệm (Swap) theo định dạng dễ đọc (GB, MB), bạn dùng lệnh:",
    options: [
      "free -h",
      "ram -show",
      "meminfo",
      "df -h"
    ],
    answer: 0,
    explanation: "`free -h` (`-h` là human-readable) hiển thị tổng dung lượng RAM (Total), dung lượng đang sử dụng (Used), dung lượng còn trống (Free) và bộ nhớ ảo Swap."
  },
  {
    id: 64,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Để kiểm tra dung lượng và phần trăm sử dụng của các phân vùng ổ đĩa cứng (Disk Filesystem), lệnh nào được sử dụng?",
    options: [
      "df -h",
      "du -sh",
      "diskpart",
      "fdisk -l"
    ],
    answer: 0,
    explanation: "`df -h` (Disk Free human-readable) báo cáo dung lượng tổng thể, dung lượng đã dùng, còn trống và tỉ lệ % sử dụng của tất cả các hệ thống tệp tin và phân vùng gắn kết trên máy chủ."
  },
  {
    id: 65,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Khi khởi chạy một ứng dụng Java trên terminal máy chủ Ubuntu, làm thế nào để ứng dụng chạy ngầm (background) và KHÔNG bị tắt khi bạn đóng phiên đăng nhập SSH?",
    options: [
      "java -jar app.jar",
      "nohup java -jar app.jar &",
      "bg java -jar app.jar",
      "run java -jar app.jar --hidden"
    ],
    answer: 1,
    explanation: "`nohup` (No Hang Up) ngăn chặn tiến trình bị dừng khi terminal nhận tín hiệu ngắt HUP lúc thoát SSH; còn ký tự `&` ở cuối lệnh đưa tiến trình vào chạy ngầm dưới nền (background), trả lại quyền điều khiển cho dòng lệnh."
  },
  {
    id: 66,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Sự khác biệt sống còn giữa tín hiệu SIGTERM (`kill -15 <PID>`) và SIGKILL (`kill -9 <PID>`) là gì?",
    options: [
      "SIGTERM ngắt cưỡng chế ngay lập tức; SIGKILL cho phép tiến trình dọn dẹp",
      "SIGTERM (kill 15) là yêu cầu lịch sự, cho phép tiến trình tự lưu trạng thái, đóng kết nối DB và dọn dẹp an toàn; SIGKILL (kill 9) là lệnh ép buộc Kernel giết tiến trình ngay lập tức, chỉ dùng khi tiến trình bị treo cứng",
      "SIGTERM chỉ dùng cho root; SIGKILL dùng cho người dùng thường",
      "Cả hai tín hiệu đều giống nhau hoàn toàn"
    ],
    answer: 1,
    explanation: "DevOps Best Practice: Luôn dùng `kill 15` (SIGTERM) trước để ứng dụng có cơ hội 'Graceful Shutdown' (giải phóng file descriptor, đóng connection pool). Nếu tiến trình bị deadlock, không phản hồi sau một khoảng thời gian thì mới dùng biện pháp mạnh cuối cùng là `kill -9` (SIGKILL)."
  },
  {
    id: 67,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Các tệp tin cấu hình dịch vụ Systemd do người quản trị hệ thống tự tạo (`*.service`) được lưu trữ tại thư mục chuẩn nào trên Ubuntu?",
    options: [
      "/etc/systemd/system/",
      "/lib/systemd/system/",
      "/var/run/systemd/",
      "/home/systemd/"
    ],
    answer: 0,
    explanation: "Thư mục `/etc/systemd/system/` là nơi có độ ưu tiên cao nhất, dành cho các unit file cấu hình dịch vụ do quản trị viên hệ thống tạo hoặc tuỳ biến (ví dụ: `my-api.service`). Thư mục `/lib/systemd/system/` là nơi chứa các file mặc định do các gói cài đặt cung cấp."
  },
  {
    id: 68,
    part: "linux",
    topic: "Linux Process & Systemd",
    question: "Để khởi động dịch vụ `nginx` ngay lập tức và ĐỒNG THỜI cấu hình cho dịch vụ này tự động chạy mỗi khi máy chủ khởi động lại, lệnh rút gọn hiện đại của Systemd là:",
    options: [
      "sudo systemctl enable --now nginx",
      "sudo service nginx run-always",
      "sudo systemctl boot nginx",
      "sudo systemctl restart --forever nginx"
    ],
    answer: 0,
    explanation: "Cờ `--now` kết hợp hai thao tác: vừa `systemctl enable nginx` (tạo symlink để kích hoạt khi boot máy) vừa `systemctl start nginx` (khởi chạy ngay lập tức dịch vụ tại thời điểm gõ lệnh)."
  }
];

// Xuất biến để sử dụng
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUIZ_DATA };
}
