# Project Proposal

## THÔNG TIN

### Nhóm

- Thành viên 1: Trịnh Trần Phúc Khang - 23713631
- Thành viên 2: Nguyễn Quốc Đăng - 23716711
- Thành viên 3: Lê Gia Bảo - 23720061
- Thành viên 4: Ngũ Minh Duy - 23726261

### Git

Git repository: [<link>](https://github.com/phuckhangtrinhtran/trinhtranphuckhang_project-proposal)


## MÔ TẢ DỰ ÁN

### Ý tưởng

Inventory Management System là một hệ thống quản lý hàng tồn kho dành cho cửa hàng hoặc doanh nghiệp nhỏ. Hệ thống được xây dựng với cả backend và frontend nhằm cung cấp một giao diện trực quan để người dùng quản lý sản phẩm và theo dõi tình trạng kho hàng một cách hiệu quả.

Trong thực tế, nhiều cửa hàng vẫn quản lý hàng hóa bằng Excel hoặc ghi chép thủ công, dẫn đến nhiều vấn đề như sai sót dữ liệu, khó kiểm soát số lượng tồn kho và khó theo dõi lịch sử nhập xuất hàng hóa. Ngoài ra, việc không theo dõi hạn sử dụng của sản phẩm có thể gây ra tình trạng hàng hết hạn mà không được phát hiện kịp thời.

Dự án này nhằm xây dựng một hệ thống quản lý kho đơn giản với các chức năng chính như:
- Quản lý danh sách sản phẩm
- Theo dõi số lượng tồn kho
- Quản lý lịch sử nhập và xuất hàng
- Tìm kiếm và lọc sản phẩm nhanh chóng
- Cảnh báo các sản phẩm sắp hết hạn
- Cảnh báo các sản phẩm sắp hết trong kho để kịp thời nhập thêm

Hệ thống sẽ bao gồm:
- Backend: cung cấp API để xử lý logic nghiệp vụ và quản lý dữ liệu
- Frontend: cung cấp giao diện trực quan để người dùng thao tác với hệ thống

Project được lựa chọn vì đây là một bài toán thực tế trong quản lý kinh doanh, đồng thời giúp áp dụng các kiến thức về phát triển backend, frontend, thiết kế API và quản lý cơ sở dữ liệu.

### Chi tiết

Hệ thống Inventory Management System cho phép người dùng quản lý hàng tồn kho thông qua các chức năng sau:

1. Quản lý sản phẩm
- Thêm sản phẩm mới vào hệ thống
- Cập nhật thông tin sản phẩm
- Xóa sản phẩm
- Xem danh sách sản phẩm

Mỗi sản phẩm bao gồm các thông tin:
- id
- name
- description
- category
- price
- quantity
- import_date
- expiration_date

2. Quản lý nhập kho
- Người dùng có thể nhập thêm hàng cho một sản phẩm
- Khi nhập hàng, hệ thống sẽ ghi nhận ngày nhập kho
- Hệ thống sẽ cập nhật số lượng tồn kho
- Lưu lại lịch sử nhập hàng

3. Quản lý xuất kho
- Khi sản phẩm được bán hoặc xuất khỏi kho, hệ thống sẽ trừ số lượng tồn
- Lưu lại lịch sử xuất hàng

4. Tìm kiếm và lọc sản phẩm
- Tìm kiếm sản phẩm theo tên
- Lọc sản phẩm theo danh mục
- Lọc theo số lượng tồn kho
- Lọc theo tình trạng sắp hết hàng
- Lọc theo ngày nhập kho

5. Cảnh báo tồn kho và hạn sử dụng
- Hệ thống hiển thị thông báo cho các sản phẩm sắp hết hàng (dưới một ngưỡng số lượng nhất định)
- Hệ thống hiển thị cảnh báo cho các sản phẩm sắp hết hạn sử dụng

6. Xuất lịch sử nhập/xuất hàng
- Người dùng có thể xem lịch sử các giao dịch nhập và xuất hàng
- Có thể xuất dữ liệu lịch sử này ra file (ví dụ: CSV hoặc Excel) để phục vụ việc kiểm kê và báo cáo

## PHÂN TÍCH & THIẾT KẾ

Actors:

- Admin: quản lý toàn bộ hệ thống, quản lý người dùng và phân quyền.
- Manager: quản lý sản phẩm, theo dõi tồn kho và xem báo cáo.
- Staff: thực hiện các thao tác nhập và xuất hàng trong kho.

Use Cases theo từng vai trò:

Admin:
- Quản lý tài khoản người dùng
- Phân quyền cho người dùng (Admin / Manager / Staff)
- Quản lý toàn bộ hệ thống
- Xem tất cả dữ liệu và báo cáo

Manager:
- Create product
- Update product
- Delete product
- View product list
- Theo dõi tồn kho
- Xem lịch sử nhập/xuất hàng
- Export transaction history

Staff:
- Add stock (nhập hàng)
- Remove stock (xuất hàng)
- Xem danh sách sản phẩm

Thiết kế cơ sở dữ liệu (Database Design)

User
- id
- username
- password
- role (ADMIN / MANAGER / STAFF)
- created_at

Product
- id
- name
- description
- category
- price
- quantity
- import_date
- expiration_date
- created_at

InventoryTransaction
- id
- product_id
- type (IN / OUT)
- quantity
- transaction_date
- note

Các Use Cases chính của hệ thống:

1. Quản lý người dùng (Admin)
- Create user
- Update user
- Delete user
- Assign role

2. Quản lý sản phẩm (Manager)
- Create product
- Update product
- Delete product
- View product list

3. Quản lý tồn kho
- Add stock (Staff / Manager)
- Remove stock (Staff / Manager)

4. Quản lý lịch sử giao dịch
- View transaction history
- Export transaction history

5. Tìm kiếm và lọc
- Search product by name
- Filter product by category
- Filter product by stock level
- Filter product by expiration status
- Filter product by import date

6. Theo dõi và cảnh báo
- Cảnh báo sản phẩm sắp hết hàng
- Cảnh báo sản phẩm sắp hết hạn

## KẾ HOẠCH

### MVP

Các chức năng sẽ được triển khai trong phiên bản MVP:

1. Hệ thống người dùng
- Admin có thể tạo tài khoản
- Admin có thể phân quyền (Admin / Manager / Staff)

2. Quản lý sản phẩm
- Manager thêm sản phẩm
- Manager sửa sản phẩm
- Manager xóa sản phẩm
- Xem danh sách sản phẩm

3. Quản lý nhập và xuất kho
- Staff hoặc Manager nhập hàng vào kho
- Staff hoặc Manager xuất hàng khỏi kho
- Hệ thống tự động cập nhật số lượng tồn

4. Tìm kiếm và lọc sản phẩm
- Tìm kiếm theo tên sản phẩm
- Lọc theo danh mục
- Lọc theo số lượng tồn kho
- Lọc theo ngày nhập kho

5. Xem lịch sử nhập/xuất hàng
- Xem lịch sử nhập/xuất hàng và xuất file (CSV hoặc EXCEL)

6. Cảnh báo cơ bản
- Hiển thị sản phẩm sắp hết hàng
- Hiển thị sản phẩm sắp hết hạn

7. Giao diện frontend cơ bản
- Trang quản lý sản phẩm
- Trang nhập/xuất kho
- Trang quản lý người dùng (Admin)
- Thanh tìm kiếm sản phẩm

Role Permission

Admin
- Quản lý toàn bộ hệ thống
- Quản lý người dùng
- Phân quyền

Manager
- Quản lý sản phẩm
- Theo dõi tồn kho
- Xem báo cáo

Staff
- Nhập hàng
- Xuất hàng

Kế hoạch kiểm thử:

- Kiểm thử các API CRUD của sản phẩm
- Kiểm thử chức năng nhập và xuất kho
- Kiểm thử việc cập nhật số lượng tồn kho
- Kiểm thử chức năng tìm kiếm và lọc sản phẩm
- Kiểm thử chức năng cảnh báo tồn kho
- Kiểm thử giao diện frontend kết nối với backend

Các chức năng dự kiến phát triển ở phase tiếp theo:

- Export lịch sử giao dịch ra CSV hoặc Excel
- Dashboard thống kê tồn kho
- Tìm kiếm và lọc nâng cao
- Phân quyền người dùng chi tiết hơn

Thời hạn hoàn thành dự kiến: trước ngày 12.04.2026

### Beta Version

Trong phiên bản Beta, hệ thống sẽ được hoàn thiện và kiểm thử toàn diện, đặc biệt là các chức năng liên quan đến phân quyền người dùng và quản lý hệ thống.

Các hoạt động chính:

1. Hoàn thiện hệ thống phân quyền
- Admin quản lý tài khoản người dùng
- Admin có thể tạo, chỉnh sửa và xóa tài khoản
- Admin có thể phân quyền cho người dùng (Admin / Manager / Staff)

2. Hoàn thiện các chức năng quản lý kho
- Manager quản lý sản phẩm
- Staff thực hiện nhập và xuất hàng
- Hệ thống tự động cập nhật số lượng tồn kho

3. Kiểm thử phân quyền
- Kiểm tra Admin có toàn quyền hệ thống
- Kiểm tra Manager chỉ có quyền quản lý sản phẩm và xem báo cáo
- Kiểm tra Staff chỉ có quyền nhập và xuất hàng

4. Hoàn thiện chức năng báo cáo và xuất dữ liệu
- Export lịch sử nhập/xuất hàng ra CSV hoặc Excel
- Hiển thị thống kê tồn kho

5. Cải thiện giao diện frontend
- Trang dashboard hiển thị tổng quan kho hàng
- Hiển thị cảnh báo sản phẩm sắp hết hàng
- Hiển thị cảnh báo sản phẩm sắp hết hạn
- Cải thiện chức năng tìm kiếm và lọc sản phẩm

6. Kiểm thử hệ thống
- Kiểm thử API backend
- Kiểm thử giao diện frontend
- Kiểm thử phân quyền người dùng
- Kiểm thử toàn bộ luồng hoạt động của hệ thống

Kết quả kiểm thử sẽ được tổng hợp và trình bày trong báo cáo cuối cùng của dự án.

Thời hạn hoàn thành dự kiến: trước ngày 10.05.2026

## CÂU HỎI

- Hệ thống có bắt buộc phải triển khai cả frontend và backend hay chỉ cần API backend là đủ?

- Database có yêu cầu sử dụng hệ quản trị cụ thể (ví dụ: PostgreSQL) hay nhóm có thể tự lựa chọn (SQLite, MySQL, PostgreSQL)?

- Chức năng phân quyền người dùng (Admin, Manager, Staff) có cần triển khai đầy đủ cơ chế authentication và authorization hay chỉ cần mô phỏng ở mức cơ bản?

- Chức năng xuất lịch sử nhập/xuất hàng có yêu cầu định dạng file cụ thể không (CSV, Excel, hoặc PDF)?

- Hệ thống có cần triển khai dashboard thống kê tồn kho (ví dụ: tổng số sản phẩm, sản phẩm sắp hết hàng, sản phẩm sắp hết hạn) hay không?

- Project có yêu cầu triển khai (deploy) lên server hoặc cloud hay chỉ cần chạy local?

- Phần kiểm thử hệ thống có yêu cầu viết test tự động (unit test / integration test) hay chỉ cần kiểm thử thủ công?

- Có yêu cầu cụ thể về mức độ hoàn thiện của giao diện frontend (UI/UX) hay chỉ cần giao diện cơ bản phục vụ chức năng?
---