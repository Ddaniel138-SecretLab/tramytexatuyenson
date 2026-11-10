# Public components – Trạm Y tế xã Tuyên Sơn

Thư mục này chỉ chứa UI components/pages cho khu vực công khai của website.

## Cấu trúc

- `HomePage.tsx`: ghép Hero, nhóm hoạt động y tế và thông báo mới nhất.
- `home/`: các section của trang chủ.
- `facilities/`: danh sách cơ sở và component thẻ cơ sở.
- `staff/`: danh sách cán bộ, bộ lọc cơ sở và thẻ cán bộ/avatar.
- `announcements/`: danh sách, thẻ thông báo, chi tiết và file đính kèm.
- `about/`: trang giới thiệu và component từng hoạt động.
- `contact/`: trang thông tin liên hệ.
- `shared/`: tiêu đề trang và ô tìm kiếm dùng chung.
- `PublicPages.tsx`: barrel file tương thích với các route App Router đang import từ `@/components/public/PublicPages`.

## Cách sử dụng

Giải nén ZIP tại thư mục gốc của dự án để ghi đè/tạo `src/components/public`.

Các route hiện tại có thể tiếp tục sử dụng:

```tsx
import HomePage from "@/components/public/HomePage";
import { AboutPage, FacilitiesPage, PublicStaffPage } from "@/components/public/PublicPages";
```

Route chi tiết thông báo truyền `slug` như trước:

```tsx
<AnnouncementDetailPage slug={slug} />
```

## Dependencies từ source hiện tại

Các components này sử dụng các module đã có ngoài thư mục public:

- `@/components/shared/NextLink`
- `@/components/shared/PaginationBar`
- `@/components/shared/LoadingState`
- `@/components/shared/EmptyState`
- `@/hooks/usePagedApi`
- `@/types/database`
- MUI v7, MUI Icons, Next.js 16 và React 19

## Hình ảnh trang giới thiệu

Đặt các hình ảnh trong `public/About` của ứng dụng Next.js:

```text
public/About/
├── hien-mau1.jpg
├── tham-kham-truong-hoc1.jpg
├── tham-kham-nguoi-gia1.jpg
└── tham-kham-nguoi-gia2.jpg
```

Các ảnh sử dụng `next/image` với `fill`, `sizes` và `object-fit: cover` để thích nghi kích thước màn hình. Nếu không tìm thấy ảnh, component hiển thị vùng ảnh dự phòng.

## API đang sử dụng

- `GET /api/public/facilities?page=...&perPage=...`
- `GET /api/public/staff?page=...&perPage=...&search=...&facilityId=...`
- `GET /api/public/announcements?page=...&perPage=...&search=...&type=...`
- `GET /api/public/announcements/:slug`

Các danh sách tiếp tục dùng `usePagedApi` và `PaginationBar` hiện tại; không thay đổi contract phân trang.
