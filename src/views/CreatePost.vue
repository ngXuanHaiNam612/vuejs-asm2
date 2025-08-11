<template>
  <div class="create-post">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-header" :class="isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'">
            <h3 class="mb-0">
              <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
              {{ isEditing ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới' }}
              <span v-if="isEditing && isLoading" class="ms-2">
                <small class="text-muted">(Đang tải...)</small>
              </span>
            </h3>
          </div>
          <div class="card-body p-4">
            <!-- Alert Messages -->
            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
              <button type="button" class="btn-close" @click="errorMessage = ''"></button>
            </div>

            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = ''"></button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="title" class="form-label fw-bold">
                  <i class="fas fa-heading me-1"></i>Tiêu đề bài viết
                  <span class="text-danger">*</span>
                </label>
                
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.title }"
                  placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                  required
                >

                <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
              </div>

              <div class="mb-3">
                <label for="image" class="form-label fw-bold">
                  <i class="fas fa-image me-1"></i>Hình ảnh minh họa
                </label>
                <input
                  id="image"
                  v-model="form.image"
                  type="url"
                  class="form-control"
                  :class="{ 'is-invalid': errors.image }"
                  placeholder="Nhập URL hình ảnh (tùy chọn)"
                >
                <div v-if="errors.image" class="invalid-feedback">{{ errors.image }}</div>
                <div class="form-text">Để trống nếu không có hình ảnh</div>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label fw-bold">
                  <i class="fas fa-align-left me-1"></i>Nội dung bài viết
                  <span class="text-danger">*</span>
                </label>
                <textarea
                  id="content"
                  v-model="form.content"
                  class="form-control"
                  :class="{ 'is-invalid': errors.content }"
                  rows="10"
                  placeholder="Viết nội dung bài viết của bạn ở đây..."
                  required
                ></textarea>
                <div v-if="errors.content" class="invalid-feedback">{{ errors.content }}</div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else :class="isEditing ? 'fas fa-save' : 'fas fa-paper-plane'" class="me-2"></i>
                  {{ isLoading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Đăng bài') }}
                </button>
                <button type="reset" class="btn btn-outline-secondary" @click="resetForm">
                  <i class="fas fa-times me-2"></i>{{ isEditing ? 'Hủy' : 'Làm mới' }}
                </button>
                <button v-if="isEditing" type="button" class="btn btn-outline-info" @click="previewPost">
                  <i class="fas fa-eye me-2"></i>Xem trước
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreatePost',
  data() {
    return {
      form: {
        title: '',
        content: '',
        image: ''
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      isLoading: false,
      isEditing: false,
      postId: null,
    }
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const postData = {
          title: this.form.title,
          content: this.form.content,
          image: this.form.image || 'CHƯA CÓ ẢNH', // Default image if none provided
          author: this.currentUser.name,
          authorId: this.currentUser.id,
          createdAt: this.isEditing ? undefined : new Date().toISOString(),
          updatedAt: this.isEditing ? new Date().toISOString() : undefined,
          comments: [],
          views: this.isEditing ? undefined : 0
        }

        let response

        if (this.isEditing) {
          // Update existing post - preserve existing fields that shouldn't change
          try {
            const existingResponse = await fetch(`http://localhost:3000/posts/${this.postId}`)
            if (!existingResponse.ok) {
              throw new Error('Không thể tải bài viết để cập nhật')
            }
            
            const existingPost = await existingResponse.json()
            
            // Check if current user is the author
            if (existingPost.authorId !== this.currentUser.id) {
              throw new Error('Bạn không có quyền chỉnh sửa bài viết này')
            }
            
            const updateData = {
              ...existingPost,
              title: postData.title,
              content: postData.content,
              image: postData.image || existingPost.image, // Keep existing image if no new one provided
              updatedAt: postData.updatedAt
            }
            
            response = await fetch(`http://localhost:3000/posts/${this.postId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData)
            })
          } catch (error) {
            throw new Error(`Lỗi khi cập nhật: ${error.message}`)
          }
        } else {
          // Create new post
          response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          })
        }

        if (!response.ok) {
          throw new Error(this.isEditing ? 'Không thể cập nhật bài viết' : 'Không thể tạo bài viết')
        }

        const result = await response.json()
        
        this.successMessage = this.isEditing ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết thành công!'
        
        // Clear form after successful submission
        if (!this.isEditing) {
          this.resetForm()
        }

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)

      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.form.title.trim()) {
        this.errors.title = 'Vui lòng nhập tiêu đề bài viết'
        isValid = false
      } else if (this.form.title.trim().length < 10) {
        this.errors.title = 'Tiêu đề phải có ít nhất 10 ký tự'
        isValid = false
      }

      if (!this.form.content.trim()) {
        this.errors.content = 'Vui lòng nhập nội dung bài viết'
        isValid = false
      } else if (this.form.content.trim().length < 50) {
        this.errors.content = 'Nội dung phải có ít nhất 50 ký tự'
        isValid = false
      }

      if (this.form.image && !this.isValidUrl(this.form.image)) {
        this.errors.image = 'URL hình ảnh không hợp lệ'
        isValid = false
      }

      return isValid
    },

    isValidUrl(string) {
      try {
        new URL(string)
        return true
      } catch (_) {
        return false
      }
    },

    resetForm() {
      this.form = {
        title: '',
        content: '',
        image: ''
      }
      this.errors = {}
      this.errorMessage = ''
      this.successMessage = ''
    },

    async loadPostForEdit() {
      if (!this.postId) return

      try {
        this.isLoading = true
        this.errorMessage = ''
        
        // First check if the post exists
        const response = await fetch(`http://localhost:3000/posts/${this.postId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Bài viết không tồn tại')
          } else {
            throw new Error(`Lỗi server: ${response.status}`)
          }
        }

        const post = await response.json()
        
        // Check if current user is the author
        if (post.authorId !== this.currentUser.id) {
          this.errorMessage = 'Bạn không có quyền chỉnh sửa bài viết này'
          setTimeout(() => {
            this.$router.push('/')
          }, 2000)
          return
        }

        // Update form with post data
        this.form.title = post.title || ''
        this.form.content = post.content || ''
        this.form.image = post.image || ''

        console.log('Post loaded successfully for editing:', post)

      } catch (error) {
        console.error('Error loading post for edit:', error)
        this.errorMessage = 'Không thể tải bài viết để chỉnh sửa: ' + error.message
        
        // Show error for longer time
        setTimeout(() => {
          this.$router.push('/')
        }, 5000)
      } finally {
        this.isLoading = false
      }
    }
  },
  
  mounted() {
    // Check if user is logged in
    if (!this.currentUser) {
      this.$router.push('/login')
      return
    }

    // Check if this is edit mode
    const editId = this.$route.query.edit
    if (editId) {
      this.isEditing = true
      this.postId = parseInt(editId)
      
      // Load post data for editing
      this.$nextTick(() => {
        this.loadPostForEdit()
      })
    }
  }
}
</script>

<style scoped>
.modal.show {
  z-index: 1050;
}
</style>



