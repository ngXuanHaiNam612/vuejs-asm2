<template>
  <div class="profile py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải thông tin...</p>
    </div>

    <div v-else-if="!currentUser" class="text-center py-5">
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Vui lòng đăng nhập để xem thông tin cá nhân
      </div>
      <router-link to="/login" class="btn btn-primary">
        <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
      </router-link>
    </div>

    <div v-else class="row">
      <!-- Profile Sidebar -->
      <div class="col-md-4 mb-4">
        <div class="card shadow rounded-4 border-0">
          <div class="card-body text-center p-4">
            <!-- Avatar -->
            <div class="position-relative d-inline-block mb-3">
              <img
                :src="user.avatar || 'https://via.placeholder.com/120x120'"
                alt="Avatar"
                class="rounded-circle border border-3 border-primary"
                style="width: 120px; height: 120px; object-fit: cover;"
              >
            </div>
            <!-- User Info -->
            <h4 class="fw-bold mb-1">{{ user.name }}</h4>
            <p class="text-muted mb-3">{{ user.email }}</p>
            <!-- Stats -->
            <div class="row text-center">
              <div class="col-4 border-end">
                <h5 class="fw-bold text-primary mb-0">{{ userPosts.length }}</h5>
                <small class="text-muted">Bài viết</small>
              </div>
              <div class="col-4 border-end">
                <h5 class="fw-bold text-success mb-0">{{ totalComments }}</h5>
                <small class="text-muted">Bình luận</small>
              </div>
              <div class="col-4">
                <h5 class="fw-bold text-info mb-0">{{ totalViews }}</h5>
                <small class="text-muted">Lượt xem</small>
              </div>
            </div>
            <!-- Edit Toggle Button -->
            <button
              @click="toggleEditMode"
              class="btn btn-outline-primary mt-3"
            >
              <i :class="editMode ? 'fas fa-times' : 'fas fa-edit'" class="me-2"></i>
              {{ editMode ? 'Hủy' : 'Cập nhật thông tin' }}
            </button>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="card shadow mt-3 rounded-4 border-0">
          <div class="card-header bg-light">
            <h6 class="mb-0">Chức năng</h6>
          </div>
          <div class="card-body p-3">
            <div class="d-grid gap-2">
              <router-link to="/create-post" class="btn btn-success btn-sm">
                <i class="fas fa-plus me-2"></i>Đăng bài mới
              </router-link>
              <button @click="exportData" class="btn btn-info btn-sm">
                <i class="fas fa-download me-2"></i>Xuất dữ liệu
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="col-md-8">
        <!-- Alert Messages -->
        <div v-if="updateMessage" class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="fas fa-check-circle me-2"></i>{{ updateMessage }}
          <button type="button" class="btn-close" @click="updateMessage = ''"></button>
        </div>

        <div v-if="updateError" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ updateError }}
          <button type="button" class="btn-close" @click="updateError = ''"></button>
        </div>

        <!-- Edit Profile Form -->
        <div v-if="editMode" class="card shadow mb-4 rounded-4 border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="fas fa-user-edit me-2"></i>Chỉnh sửa thông tin cá nhân
            </h5>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="updateProfile" novalidate>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label fw-bold">
                    <i class="fas fa-user me-1"></i>Họ và tên
                  </label>
                  <input
                    id="name"
                    v-model="editForm.name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    required
                  >
                  <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label fw-bold">
                    <i class="fas fa-envelope me-1"></i>Email
                  </label>
                  <input
                    id="email"
                    v-model="editForm.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    required
                  >
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="currentPassword" class="form-label fw-bold">
                    <i class="fas fa-lock me-1"></i>Mật khẩu hiện tại
                  </label>
                  <input
                    id="currentPassword"
                    v-model="editForm.currentPassword"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.currentPassword }"
                    placeholder="Nhập để xác nhận thay đổi"
                  >
                  <div v-if="errors.currentPassword" class="invalid-feedback">{{ errors.currentPassword }}</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="newPassword" class="form-label fw-bold">
                    <i class="fas fa-key me-1"></i>Mật khẩu mới
                  </label>
                  <input
                    id="newPassword"
                    v-model="editForm.newPassword"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.newPassword }"
                    placeholder="Để trống nếu không đổi"
                  >
                  <div v-if="errors.newPassword" class="invalid-feedback">{{ errors.newPassword }}</div>
                </div>
              </div>
              
              <!-- Avatar URL Input -->
              <div class="row">
                <div class="col-12 mb-3">
                  <label for="avatarUrl" class="form-label fw-bold">
                    <i class="fas fa-image me-1"></i>URL hình đại diện mới
                  </label>
                  <div class="input-group">
                    <input
                      id="avatarUrl"
                      v-model="editForm.avatarUrl"
                      type="url"
                      class="form-control"
                      :class="{ 'is-invalid': errors.avatarUrl }"
                      placeholder="https://example.com/image.jpg"
                    >
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="previewAvatar"
                      :disabled="!editForm.avatarUrl"
                    >
                      <i class="fas fa-eye"></i> Xem trước
                    </button>
                  </div>
                  <div v-if="errors.avatarUrl" class="invalid-feedback">{{ errors.avatarUrl }}</div>
                  <small class="form-text text-muted">
                    Nhập URL hình ảnh từ internet hoặc để trống để giữ hình hiện tại
                  </small>
                </div>
              </div>
              
              <!-- Avatar Preview -->
              <div v-if="editForm.avatarUrl && avatarPreview" class="row">
                <div class="col-12 mb-3">
                  <label class="form-label fw-bold">Xem trước hình đại diện:</label>
                  <div class="text-center">
                    <img
                      :src="editForm.avatarUrl"
                      alt="Avatar Preview"
                      class="rounded-circle border border-3 border-primary"
                      style="width: 100px; height: 100px; object-fit: cover;"
                      @error="handleAvatarError"
                    >
                  </div>
                </div>
              </div>
              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isUpdating"
                >
                  <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-save me-2"></i>
                  {{ isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  class="btn btn-outline-secondary"
                  :disabled="isUpdating"
                >
                  <i class="fas fa-times me-2"></i>Hủy
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- User Posts Table -->
        <div class="card shadow rounded-4 border-0">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="fas fa-newspaper me-2"></i>
              Bài viết của tôi ({{ userPosts.length }})
            </h5>
          </div>
          <div class="card-body">
            <div v-if="userPosts.length > 0">
              <table class="table table-bordered table-hover align-middle">
                <thead class="table-light text-center text-uppercase">
                  <tr>
                    <th scope="col">Tiêu đề</th>
                    <th scope="col">Ngày đăng</th>
                    <th scope="col">Lượt xem</th>
                    <th scope="col">Bình luận</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in userPosts" :key="post.id">
                    <td>
                      <router-link :to="`/post/${post.id}`" class="fw-bold text-decoration-none">
                        {{ post.title }}
                      </router-link>
                      <div class="text-muted small">{{ truncateContent(post.content, 100) }}</div>
                    </td>
                    <td>{{ formatDate(post.createdAt) }}</td>
                    <td>{{ post.views || 0 }}</td>
                    <td>{{ post.comments?.length || 0 }}</td>
                    <td>
                      <router-link
                        :to="`/create-post?edit=${post.id}`"
                        class="btn btn-outline-primary btn-sm me-1"
                        title="Chỉnh sửa"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button
                        @click="deletePost(post.id)"
                        class="btn btn-outline-danger btn-sm"
                        title="Xóa"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-4 text-muted">
              <i class="fas fa-newspaper fa-2x mb-3"></i>
              <p>Bạn chưa có bài viết nào. Hãy <router-link to="/create-post">đăng bài đầu tiên</router-link>!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      loading: true,
      user: {},
      editMode: false,
      editForm: {
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        avatarUrl: ''
      },
      avatarPreview: false,
      errors: {},
      updateMessage: '',
      updateError: '',
      isUpdating: false,
      userPosts: []
    }
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    },
    totalComments() {
      return this.userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)
    },
    totalViews() {
      return this.userPosts.reduce((total, post) => total + (post.views || 0), 0)
    }
  },
  methods: {
    async loadUserData() {
      try {
        if (!this.currentUser) return

        // Load user data from json-server
        const response = await fetch(`http://localhost:3000/users/${this.currentUser.id}`)
        if (response.ok) {
          this.user = await response.json()
        } else {
          // Fallback to localStorage data
          this.user = { ...this.currentUser }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        this.user = { ...this.currentUser }
      }
    },

    async loadUserPosts() {
      try {
        if (!this.currentUser) return

        // Load posts from json-server
        const response = await fetch('http://localhost:3000/posts')
        if (response.ok) {
          const allPosts = await response.json()
          this.userPosts = allPosts.filter(post => post.authorId === this.currentUser.id)
        }
      } catch (error) {
        console.error('Error loading user posts:', error)
        this.userPosts = []
      } finally {
        this.loading = false
      }
    },

    toggleEditMode() {
      this.editMode = !this.editMode
      if (this.editMode) {
        this.editForm = {
          name: this.user.name,
          email: this.user.email,
          currentPassword: '',
          newPassword: '',
          avatarUrl: ''
        }
        this.errors = {}
        this.updateMessage = ''
        this.updateError = ''
      }
    },

    cancelEdit() {
      this.editMode = false
      this.errors = {}
    },

    async updateProfile() {
      if (!this.validateEditForm()) {
        return
      }

      this.isUpdating = true
      this.updateMessage = ''
      this.updateError = ''

      try {
        // Verify current password
        if (this.editForm.currentPassword !== this.user.password) {
          throw new Error('Mật khẩu hiện tại không chính xác')
        }

        // Prepare update data
        const updateData = {
          ...this.user,
          name: this.editForm.name,
          email: this.editForm.email
        }

        // Update password if provided
        if (this.editForm.newPassword.trim()) {
          updateData.password = this.editForm.newPassword
        }

        // Update avatar if provided
        if (this.editForm.avatarUrl.trim()) {
          updateData.avatar = this.editForm.avatarUrl
        }

        // Update user in json-server
        const response = await fetch(`http://localhost:3000/users/${this.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })

        if (!response.ok) {
          throw new Error('Không thể cập nhật thông tin')
        }

        const updatedUser = await response.json()
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        
        // Update local state
        this.user = updatedUser
        this.editMode = false
        this.updateMessage = 'Cập nhật thông tin thành công!'

        // Dispatch event to update navbar
        window.dispatchEvent(new Event('login-success'))

      } catch (error) {
        this.updateError = error.message
      } finally {
        this.isUpdating = false
      }
    },

    validateEditForm() {
      this.errors = {}
      let isValid = true

      if (!this.editForm.name.trim()) {
        this.errors.name = 'Vui lòng nhập họ và tên'
        isValid = false
      }

      if (!this.editForm.email.trim()) {
        this.errors.email = 'Vui lòng nhập email'
        isValid = false
      } else if (!this.isValidEmail(this.editForm.email)) {
        this.errors.email = 'Email không hợp lệ'
        isValid = false
      }

      if (!this.editForm.currentPassword) {
        this.errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
        isValid = false
      }

      if (this.editForm.newPassword && this.editForm.newPassword.length < 6) {
        this.errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
        isValid = false
      }

      if (this.editForm.avatarUrl && !this.isValidUrl(this.editForm.avatarUrl)) {
        this.errors.avatarUrl = 'URL hình ảnh không hợp lệ'
        isValid = false
      }

      return isValid
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    previewAvatar() {
      if (this.editForm.avatarUrl && this.isValidUrl(this.editForm.avatarUrl)) {
        this.avatarPreview = true
        this.errors.avatarUrl = ''
      } else {
        this.errors.avatarUrl = 'URL hình ảnh không hợp lệ'
        this.avatarPreview = false
      }
    },

    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    },

    handleAvatarError() {
      this.errors.avatarUrl = 'Không thể tải hình ảnh từ URL này'
      this.avatarPreview = false
    },

    async deletePost(postId) {
      if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        return
      }

      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          // Remove from local state
          this.userPosts = this.userPosts.filter(post => post.id !== postId)
          this.updateMessage = 'Xóa bài viết thành công!'
        } else {
          throw new Error('Không thể xóa bài viết')
        }

      } catch (error) {
        this.updateError = error.message
      }
    },

    exportData() {
      const userData = {
        user: this.user,
        posts: this.userPosts,
        stats: {
          totalPosts: this.userPosts.length,
          totalComments: this.totalComments,
          totalViews: this.totalViews
        },
        exportDate: new Date().toISOString()
      }

      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `user-data-${this.user.name}-${new Date().toISOString().split('T')[0]}.json`
      link.click()
    },

    truncateContent(content, length = 100) {
      if (!content || content.length <= length) return content
      return content.substring(0, length) + '...'
    },

    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  },
  mounted() {
    this.loadUserData()
    this.loadUserPosts()
  }
}
</script>

<style scoped>
.table th {
  font-size: 0.875rem;
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>