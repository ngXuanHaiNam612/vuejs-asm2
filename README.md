# 🚀 Blog Application - Vue.js 3 + JSON Server

## 📋 Mô tả Project

Ứng dụng Blog hoàn chỉnh được xây dựng bằng **Vue.js 3** với backend giả lập bằng **json-server**. Ứng dụng hỗ trợ đầy đủ các chức năng CRUD cho bài viết, quản lý người dùng, hệ thống bình luận và giao diện responsive.

## ✨ Tính năng chính

### 🔐 **Authentication & User Management**
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý thông tin cá nhân
- ✅ **Cập nhật avatar** (URL hình mới)
- ✅ Thay đổi mật khẩu
- ✅ Xuất dữ liệu cá nhân

### 📝 **Post Management (CRUD)**
- ✅ **Create**: Tạo bài viết mới với tiêu đề, nội dung, hình ảnh
- ✅ **Read**: Hiển thị danh sách bài viết, xem chi tiết
- ✅ **Update**: Chỉnh sửa bài viết (chỉ tác giả)
- ✅ **Delete**: Xóa bài viết (chỉ tác giả)
- ✅ Preview bài viết trước khi đăng
- ✅ Upload hình ảnh qua URL

### 💬 **Comment System**
- ✅ Thêm bình luận mới
- ✅ Xóa bình luận (chỉ tác giả bình luận)
- ✅ Hiển thị danh sách bình luận theo thời gian
- ✅ Lưu trữ comments trong database

### 🔍 **Search & Filter**
- ✅ Tìm kiếm bài viết theo tiêu đề
- ✅ Lọc bài viết theo tác giả
- ✅ Phân trang (5 bài viết/trang)
- ✅ Làm mới dữ liệu từ server

### 🎨 **UI/UX Features**
- ✅ Giao diện responsive với Bootstrap 5
- ✅ Loading states và error handling
- ✅ Real-time navbar updates
- ✅ Form validation
- ✅ Success/Error messages
- ✅ Modal preview cho bài viết

## 🏗️ Kiến trúc hệ thống

### **Frontend Stack**
- **Framework**: Vue.js 3 (Composition API)
- **Router**: Vue Router 4
- **Styling**: Bootstrap 5 + Font Awesome
- **State Management**: localStorage + API calls
- **Build Tool**: Vite

### **Backend Stack**
- **Mock Server**: json-server
- **Database**: JSON file (db.json)
- **API**: RESTful endpoints
- **Port**: 3000

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Components tái sử dụng
│   └── Navbar.vue      # Navigation bar với user status
├── views/              # Các trang chính
│   ├── Home.vue        # Trang chủ - danh sách bài viết
│   ├── Login.vue       # Đăng nhập
│   ├── Register.vue    # Đăng ký
│   ├── CreatePost.vue  # Tạo/chỉnh sửa bài viết
│   ├── PostDetail.vue  # Chi tiết bài viết + comments
│   └── Profile.vue     # Profile người dùng + quản lý bài viết
├── router/             # Cấu hình routing
└── App.vue             # Component gốc
```

## 🗄️ Cấu trúc Database (db.json)

```json
{
  "users": [
    {
      "id": 1,
      "name": "Nguyễn Xuân Hải Nam",
      "email": "ngxuanhainam@gmail.com",
      "password": "123456",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "Tiêu đề bài viết",
      "content": "Nội dung bài viết...",
      "image": "https://example.com/image.jpg",
      "author": "Nguyễn Xuân Hải Nam",
      "authorId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "views": 0,
      "comments": [
        {
          "id": 1,
          "content": "Bình luận...",
          "author": "Tên người bình luận",
          "authorId": 1,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

## 🚀 Cài đặt và chạy

### **1. Clone project**
```bash
git clone <repository-url>
cd 24_PS43543_NguyenXuanHaiNam_ASMGD1
```

### **2. Cài đặt dependencies**
```bash
npm install
```

### **3. Khởi động Backend (json-server)**
```bash
# Cài đặt json-server globally (nếu chưa có)
npm install -g json-server

# Khởi động server
json-server --watch db.json --port 3000
```

### **4. Khởi động Frontend**
```bash
npm run dev
```

### **5. Truy cập ứng dụng**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🔌 API Endpoints

### **Users**
- `GET /users` - Lấy danh sách tất cả users
- `GET /users/:id` - Lấy thông tin user theo ID
- `POST /users` - Tạo user mới
- `PUT /users/:id` - Cập nhật thông tin user

### **Posts**
- `GET /posts` - Lấy danh sách tất cả posts
- `GET /posts/:id` - Lấy chi tiết post theo ID
- `POST /posts` - Tạo post mới
- `PUT /posts/:id` - Cập nhật post
- `DELETE /posts/:id` - Xóa post

## 👤 Tài khoản mặc định

```
Email: ngxuanhainam@gmail.com
Password: 123456
```

## 🎯 Các tính năng nổi bật

### **1. Real-time Navbar Updates**
- Navbar tự động cập nhật khi đăng nhập/đăng xuất
- Sử dụng custom events để communication giữa components

### **2. Advanced Post Management**
- Kiểm tra quyền chỉnh sửa/xóa (chỉ tác giả)
- Preserve existing data khi update (comments, views)
- Preview bài viết trước khi đăng

### **3. Enhanced Profile System**
- **Avatar URL management**: Nhập URL hình mới, preview, validation
- Cập nhật thông tin cá nhân với xác thực mật khẩu
- Quản lý bài viết cá nhân với actions edit/delete
- Xuất dữ liệu cá nhân dưới dạng JSON

### **4. Robust Error Handling**
- Validation forms với thông báo lỗi chi tiết
- Loading states cho tất cả API calls
- Graceful fallbacks khi server không khả dụng

## 🔧 Công nghệ sử dụng

### **Frontend**
- **Vue.js 3**: Composition API, Reactivity, Lifecycle hooks
- **Vue Router**: Navigation, Route guards, Query parameters
- **Bootstrap 5**: Responsive design, Components, Utilities
- **Font Awesome**: Icons

### **Backend & Data**
- **json-server**: Mock REST API
- **Fetch API**: HTTP requests, Error handling
- **LocalStorage**: Client-side session management

### **Development Tools**
- **Vite**: Build tool và dev server
- **ES6+**: Modern JavaScript features
- **Async/Await**: Promise handling

## 📱 Responsive Design

- **Mobile-first approach** với Bootstrap 5
- **Breakpoints**: xs, sm, md, lg, xl
- **Grid system** linh hoạt
- **Touch-friendly** interface

## 🔒 Security Features

- **Password verification** khi cập nhật profile
- **Authorization checks** cho post operations
- **Input validation** cho tất cả forms
- **XSS protection** với Vue.js built-in escaping

## 🚀 Performance Optimizations

- **Lazy loading** cho components
- **Pagination** để giảm tải dữ liệu
- **Computed properties** để cache calculations
- **Event cleanup** trong lifecycle hooks

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản có sẵn
- [ ] Tạo bài viết mới
- [ ] Chỉnh sửa bài viết
- [ ] Xóa bài viết
- [ ] Thêm bình luận
- [ ] Xóa bình luận
- [ ] Cập nhật profile
- [ ] Thay đổi avatar
- [ ] Tìm kiếm và lọc bài viết
- [ ] Phân trang
- [ ] Responsive trên mobile

## 🐛 Troubleshooting

### **Common Issues**

#### **1. json-server không khởi động**
```bash
# Kiểm tra file db.json có tồn tại không
ls db.json

# Khởi động lại với port khác
json-server --watch db.json --port 3001
```
#### **2. API calls bị lỗi**
- Kiểm tra json-server có đang chạy không
- Kiểm tra port 3000 có bị chiếm không
- Kiểm tra file db.json có đúng format JSON không

#### **3. Navbar không cập nhật**
- Kiểm tra localStorage có currentUser không
- Kiểm tra event listeners trong Navbar.vue
- Refresh page để reset state

### **Phase 1 (Completed)**
- ✅ Basic CRUD operations
- ✅ User authentication
- ✅ Comment system
- ✅ Profile management

## 👨‍💻 Tác giả

**Nguyễn Xuân Hải Nam**  
**MSSV**: PS43543  
**Lớp**: ASMGD1  
**Môn học**: Thiết kế giao diện Vue.js

## 📄 License

Project này được tạo ra cho mục đích học tập và nghiên cứu.

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

**⭐ Nếu project này hữu ích, hãy để lại một star!**
