# Database Schema for E-commerce System

## 1. Bảng Users (Người dùng)
- **id**: UUID (lấy từ Clerk user ID)
- **clerk_id**: string (ID của người dùng trong hệ thống Clerk)
- **full_name**: string (có thể đồng bộ từ Clerk)
- **address**: string
- **phone_number**: string (có thể đồng bộ từ Clerk)
- **role**: enum (customer, admin)
- **created_at**: timestamp
- **updated_at**: timestamp
- **shipping_addresses**: jsonb (mảng các địa chỉ giao hàng)
- **preferences**: jsonb (tùy chọn của người dùng)

## 2. Bảng Products (Sản phẩm)
- **id**: UUID hoặc integer (primary key)
- **name**: string (tên sản phẩm)
- **slug**: string (URL-friendly)
- **description**: text (mô tả chi tiết)
- **short_description**: string (mô tả ngắn)
- **price**: decimal (giá tiền)
- **sale_price**: decimal (giá khuyến mãi, có thể null)
- **category_id**: foreign key (liên kết với Category)
- **brand_id**: foreign key (liên kết với Brand)
- **stock_quantity**: integer (số lượng trong kho)
- **created_at**: timestamp
- **updated_at**: timestamp
- **is_featured**: boolean (sản phẩm nổi bật)
- **is_active**: boolean (còn bán hay không)
- **specifications**: jsonb (thông số kỹ thuật)

## 3. Bảng Categories (Danh mục)
- **id**: UUID hoặc integer (primary key)
- **name**: string (Điện thoại, Laptop, Máy ảnh...)
- **slug**: string (URL-friendly, ví dụ: "phones", "laptops", "cameras")
- **description**: text
- **parent_id**: foreign key (self-reference, cho phép danh mục lồng nhau)
- **image_url**: string
- **created_at**: timestamp
- **updated_at**: timestamp

## 4. Bảng Brands (Thương hiệu)
- **id**: UUID hoặc integer (primary key)
- **name**: string (Apple, Samsung, Sony...)
- **slug**: string (URL-friendly)
- **logo_url**: string
- **description**: text
- **created_at**: timestamp
- **updated_at**: timestamp

## 5. Bảng ProductImages (Hình ảnh sản phẩm)
- **id**: UUID hoặc integer (primary key)
- **product_id**: foreign key (liên kết với Product)
- **image_url**: string
- **alt_text**: string (mô tả cho SEO)
- **is_primary**: boolean (ảnh chính hay không)
- **display_order**: integer (thứ tự hiển thị)
- **created_at**: timestamp

## 6. Bảng Orders (Đơn hàng)
- **id**: UUID hoặc integer (primary key)
- **user_id**: foreign key (liên kết với User, có thể null cho khách không đăng nhập)
- **status**: enum ("pending", "processing", "shipped", "delivered", "cancelled")
- **total_amount**: decimal
- **shipping_fee**: decimal
- **tax_amount**: decimal
- **discount_amount**: decimal
- **shipping_address**: text
- **shipping_name**: string
- **shipping_phone**: string
- **payment_method**: enum ("cod", "bank_transfer", "credit_card"...)
- **payment_status**: enum ("pending", "paid", "failed")
- **notes**: text
- **created_at**: timestamp
- **updated_at**: timestamp
- **tracking_number**: string (mã vận đơn, có thể null)

## 7. Bảng OrderItems (Chi tiết đơn hàng)
- **id**: UUID hoặc integer (primary key)
- **order_id**: foreign key (liên kết với Order)
- **product_id**: foreign key (liên kết với Product)
- **quantity**: integer (số lượng mua)
- **price**: decimal (giá tại thời điểm mua)
- **total**: decimal (price * quantity)
- **created_at**: timestamp

## 8. Bảng Reviews (Đánh giá)
- **id**: UUID hoặc integer (primary key)
- **product_id**: foreign key (liên kết với Product)
- **user_id**: foreign key (liên kết với User)
- **rating**: integer (1-5)
- **comment**: text
- **created_at**: timestamp
- **updated_at**: timestamp
- **is_approved**: boolean (kiểm duyệt bình luận)

## 9. Bảng Wishlist (Danh sách yêu thích)
- **id**: UUID hoặc integer (primary key)
- **user_id**: foreign key (liên kết với User)
- **product_id**: foreign key (liên kết với Product)
- **created_at**: timestamp

## 10. Bảng Cart (Giỏ hàng)
- **id**: UUID hoặc integer (primary key)
- **user_id**: foreign key (liên kết với User, có thể null cho giỏ hàng không đăng nhập)
- **session_id**: string (cho người dùng chưa đăng nhập)
- **created_at**: timestamp
- **updated_at**: timestamp

## 11. Bảng CartItems (Chi tiết giỏ hàng)
- **id**: UUID hoặc integer (primary key)
- **cart_id**: foreign key (liên kết với Cart)
- **product_id**: foreign key (liên kết với Product)
- **quantity**: integer
- **created_at**: timestamp
- **updated_at**: timestamp

## 12. Bảng Promotions (Khuyến mãi)
- **id**: UUID hoặc integer (primary key)
- **name**: string
- **description**: text
- **discount_type**: enum ("percentage", "fixed_amount")
- **discount_value**: decimal
- **code**: string (mã giảm giá)
- **start_date**: timestamp
- **end_date**: timestamp
- **is_active**: boolean
- **minimum_order_amount**: decimal (đơn hàng tối thiểu)
- **created_at**: timestamp
- **updated_at**: timestamp

## 13. Bảng UserProfiles (Thông tin người dùng)
- **id**: UUID (primary key, tương ứng với Clerk user ID)
- **email**: string (đồng bộ từ Clerk)
- **full_name**: string (đồng bộ từ Clerk)
- **phone_number**: string
- **address**: text
- **created_at**: timestamp
- **updated_at**: timestamp
- **shipping_addresses**: jsonb (mảng các địa chỉ giao hàng)
- **preferences**: jsonb (tùy chọn người dùng)

## Mối quan hệ giữa các bảng:
- **User - Order**: Một-nhiều (Một người dùng có thể có nhiều đơn hàng)
- **User - Wishlist**: Một-nhiều (Một người dùng có thể thích nhiều sản phẩm)
- **User - Review**: Một-nhiều (Một người dùng có thể đánh giá nhiều sản phẩm)
- **User - Cart**: Một-một (Một người dùng có một giỏ hàng)
- **Product - OrderItem**: Một-nhiều (Một sản phẩm có thể xuất hiện trong nhiều đơn hàng)
- **Product - Wishlist**: Một-nhiều (Một sản phẩm có thể được thích bởi nhiều người dùng)
- **Product - Review**: Một-nhiều (Một sản phẩm có thể có nhiều đánh giá)
- **Product - ProductImage**: Một-nhiều (Một sản phẩm có thể có nhiều hình ảnh)
- **Product - Category**: Nhiều-một (Nhiều sản phẩm thuộc một danh mục)
- **Product - Brand**: Nhiều-một (Nhiều sản phẩm thuộc một thương hiệu)
- **Category - Category**: Một-nhiều (Danh mục cha-con)
- **Order - OrderItem**: Một-nhiều (Một đơn hàng có nhiều sản phẩm)
- **Cart - CartItem**: Một-nhiều (Một giỏ hàng có nhiều sản phẩm)

## Lưu ý quan trọng:
- **Bảo mật**: Cần mã hóa mật khẩu người dùng, thông tin thanh toán.
- **Local Storage**: Từ code client, tôi thấy có sử dụng localStorage để lưu cart và wishlist, điều này có nghĩa là:
  - Cần có cơ chế đồng bộ giỏ hàng từ localStorage lên database khi người dùng đăng nhập
  - Đồng bộ số lượng sản phẩm trong giỏ hàng/wishlist giữa localStorage và database
- **Tìm kiếm**: Cần có cơ chế tìm kiếm hiệu quả trên sản phẩm, đề xuất:
  - Đánh index cho các trường tìm kiếm phổ biến
  - Có thể cần giải pháp search engine riêng như Elasticsearch cho trang web lớn
- **Đa ngôn ngữ**: Nếu muốn hỗ trợ đa ngôn ngữ, cần thêm bảng cho các nội dung đa ngôn ngữ.
- **Thanh toán**: Cần tích hợp với các cổng thanh toán, lưu thông tin giao dịch.
- **Thông báo**: Hệ thống thông báo cho người dùng về trạng thái đơn hàng.

Orders.user_id -> UserProfiles.id
Wishlist.user_id -> UserProfiles.id
Reviews.user_id -> UserProfiles.id
Cart.user_id -> UserProfiles.id



