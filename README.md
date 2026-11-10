# Trạm Y tế xã Tuyên Sơn – Frontend

Frontend Next.js App Router + React + TypeScript + MUI + Supabase SSR. Giao diện dùng font Be Vietnam Pro, tối ưu mobile/tablet/desktop.

## 1. Yêu cầu

- Node.js 20.9+ (khuyến nghị Node 24 LTS)
- Yarn 1.x hoặc npm
- Một Supabase project

## 2. Cài đặt

```bash
yarn install
```

## 3. Cấu hình môi trường

Sao chép `.env.example` thành `.env.local`, sau đó điền thông tin trong Supabase Dashboard → Project Settings → API Keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SECRET_KEY` chỉ được dùng trong server code. Không đổi tên thành biến `NEXT_PUBLIC_` và không commit `.env.local`.

## 4. Database

Mở Supabase Dashboard → SQL Editor, chạy toàn bộ file `supabase/schema.sql` trên project mới. Nếu đã setup database trước đó, chạy lại file này để bổ sung cột `announcements.attachments`, cấu hình Storage buckets và các Storage policies (script dùng các lệnh idempotent, không xóa dữ liệu hiện có).

Sau đó tạo tài khoản quản trị ban đầu trong Authentication → Users. Dùng SQL sau để gán role ADMIN (thay email và tên):

```sql
insert into public.profiles (id, full_name, role, is_active, must_change_password)
select id, 'Quản trị viên', 'ADMIN', true, false
from auth.users
where email = 'admin@example.com'
on conflict (id) do update set role = 'ADMIN', is_active = true,
  must_change_password = false, facility_id = null;
```

Tắt public sign-ups trong Authentication settings. Các tài khoản STAFF được tạo trong trang Quản lý cán bộ.

## 5. Chạy dự án

```bash
yarn dev
```

Mở http://localhost:3000.

Kiểm tra trước khi deploy:

```bash
yarn typecheck
yarn build
```

## 6. Các trang

### Public

- `/` – Trang chủ
- `/about` hoặc `/gioi-thieu` – Giới thiệu
- `/facilities` hoặc `/co-so` – Cơ sở y tế
- `/public-staff` hoặc `/can-bo` – Danh sách cán bộ
- `/announcements` hoặc `/thong-bao` – Thông báo
- `/announcements/[slug]` – Chi tiết thông báo
- `/contact` hoặc `/lien-he` – Liên hệ

### Auth

- `/login` – Đăng nhập
- `/change-password` – Đổi mật khẩu bắt buộc

### Admin

- `/admin` – Dashboard
- `/admin/facilities` – CRUD cơ sở
- `/admin/staff` – CRUD cán bộ/tài khoản, tạo và cấp mật khẩu tạm
- `/admin/users` – Danh sách Auth users
- `/admin/announcements` – CRUD mọi thông báo
- `/admin/audit-logs` – Lịch sử hoạt động

### Staff

- `/staff` – Dashboard
- `/staff/profile` – Cập nhật hồ sơ cá nhân
- `/staff/announcements` – Xem thông báo cơ sở; chỉ sửa/xóa thông báo do chính mình tạo

## 7. Phân trang API

Các endpoint GET trả danh sách sử dụng chung query params:

- `page`: bắt đầu từ 1
- `perPage`: số phần tử/trang (giới hạn tối đa theo từng endpoint)
- `search`, `status`, `type`, `facilityId`: bộ lọc nếu endpoint hỗ trợ

Response dạng:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 0,
    "totalPages": 0,
    "hasMore": false
  }
}
```

Các GET dạng chi tiết, `/api/auth/me`, `/api/staff/profile` và `/api/admin/dashboard` là endpoint đơn bản ghi/tổng hợp nên không dùng phân trang.

## 8. Supabase Storage và hình ảnh/tệp đính kèm

File `supabase/schema.sql` tự tạo hoặc cập nhật ba bucket public:

- `staff-avatars`: ảnh đại diện cán bộ, JPEG/PNG/WebP, tối đa 5 MB.
- `announcement-images`: ảnh cover thông báo, JPEG/PNG/WebP, tối đa 5 MB.
- `announcement-attachments`: tài liệu PDF đính kèm thông báo, tối đa 10 MB mỗi file và 10 file/thông báo.

Ảnh đại diện được lưu theo `{auth.uid()}/{filename}`. Ảnh và tài liệu thông báo được lưu theo `{facility_id|admin}/{auth.uid()}/{filename}`. Storage policies giới hạn quyền upload/xóa theo tài khoản, role và cơ sở; bucket public chỉ để người dân xem/tải những nội dung đã được công bố. Không đặt secret key trong trình duyệt.

STAFF tải ảnh đại diện tại `/staff/profile`. ADMIN/STAFF chọn ảnh cover và PDF ngay trong form tạo/chỉnh sửa thông báo. Ảnh cán bộ hiển thị ở trang danh sách cán bộ công khai và khu quản trị.

## 9. Responsive

MUI breakpoints được dùng cho mobile, tablet và desktop. Sidebar portal chuyển thành Drawer trên màn nhỏ; bảng quản trị chuyển thành card trên mobile; lưới nội dung public co giãn theo viewport.

## 10. Ghi chú bảo mật

- Không có bảng `staff`; cán bộ là `profiles.role = 'STAFF'`.
- `profiles.facility_id` nullable.
- Secret key chỉ được import từ server modules.
- Route Handler tự xác minh session và role; Proxy chỉ làm mới session, không thay thế authorization.
- STAFF có facility chỉ quản lý thông báo của mình tại facility đó.
- Audit log không lưu plaintext password hoặc mật khẩu tạm.

Public header không hiển thị nút đăng nhập; ADMIN và STAFF truy cập trực tiếp `/login`. Font Be Vietnam Pro được đóng gói qua `@fontsource/be-vietnam-pro`, không cần tải font từ CDN.

Thư mục `legacy-ui/` giữ lại các component gốc được cung cấp trước đó làm tài liệu tham chiếu. Các route đang hoạt động sử dụng component trong `src/components/`.
