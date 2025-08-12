<template>
  <div class="create-post">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-header" :class="isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'">
            <h3 class="mb-0">
              <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus'" class="me-2"></i>
              {{ isEditing ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới' }}
            </h3>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="title" class="form-label fw-bold">
                  <i class="fas fa-heading me-1"></i>Tiêu đề bài viết
                </label>
                <input id="title" v-model="form.title" type="text" class="form-control" 
                       placeholder="Nhập tiêu đề bài viết..." required>
              </div>

              <div class="mb-3">
                <label for="image" class="form-label fw-bold">
                  <i class="fas fa-image me-1"></i>Hình ảnh minh họa
                </label>
                <input id="image" v-model="form.image" type="text" class="form-control" 
                       placeholder="Nhập URL hình ảnh (tùy chọn)">
              </div>

              <div class="mb-3">
                <label for="content" class="form-label fw-bold">
                  <i class="fas fa-align-left me-1"></i>Nội dung bài viết
                </label>
                <textarea id="content" v-model="form.content" class="form-control" rows="10"
                          placeholder="Viết nội dung bài viết của bạn ở đây..." required></textarea>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                  <i :class="isEditing ? 'fas fa-save' : 'fas fa-paper-plane'" class="me-2"></i>
                  {{ isEditing ? 'Cập nhật' : 'Đăng bài' }}
                </button>
                <button type="reset" class="btn btn-outline-secondary">
                  <i class="fas fa-times me-2"></i>{{ isEditing ? 'Hủy' : 'Làm mới' }}
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
      try {
        const postData = {
          title: this.form.title,
          content: this.form.content,
          image: this.form.image || 'CHƯA CÓ ẢNH',
          author: this.currentUser.name,
          authorId: this.currentUser.id,
          createdAt: this.isEditing ? undefined : new Date().toISOString(),
          updatedAt: this.isEditing ? new Date().toISOString() : undefined,
          comments: [],
          views: this.isEditing ? undefined : 0
        }

        let response

        if (this.isEditing) {
          // cập nhật post nếu đang ở chế độ chỉnh sửa bài viết
          const existingResponse = await fetch(`http://localhost:3000/posts/${this.postId}`)
          const existingPost = await existingResponse.json()

          const updateData = {
            ...existingPost,
            title: postData.title,
            content: postData.content,
            image: postData.image || existingPost.image,
            updatedAt: postData.updatedAt
          }

          response = await fetch(`http://localhost:3000/posts/${this.postId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
          })

        } else {
          // tạo post mới
          response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          })
        }

        if (response.ok) {
          if (!this.isEditing) {
            this.resetForm()
          }
          
          this.$router.push('/profile')
        }

      } catch (error) {
        console.error('Error:', error)
      }
    },

    resetForm() {
      this.form = {
        title: '',
        content: '',
        image: ''
      }
    },

    async loadPostForEdit() {
      if (!this.postId) return

      try {
        const response = await fetch(`http://localhost:3000/posts/${this.postId}`)
        const post = await response.json()

        // Update form with post data
        this.form.title = post.title || ''
        this.form.content = post.content || ''
        this.form.image = post.image || ''

      } catch (error) {
        console.error('Error loading post for edit:', error)
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
      this.loadPostForEdit()
    }
  }
}
</script>

<style scoped>
.modal.show {
  z-index: 1050;
}
</style>
