<template>
  <div class="post-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3">Đang tải bài viết...</p>
    </div>

    <div v-else-if="!post" class="text-center py-5">
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Không tìm thấy bài viết
      </div>
      <router-link to="/" class="btn btn-primary">
        <i class="fas fa-arrow-left me-2"></i>Quay lại trang chủ
      </router-link>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 class="fw-bold mb-3">{{ post.title }}</h1>
                  <div class="post-meta text-muted">
                    <span class="me-3">
                      <i class="fas fa-user me-1"></i>{{ post.author }}
                    </span>
                    <span class="me-3">
                      <i class="fas fa-calendar me-1"></i>{{ formatDate(post.createdAt) }}
                    </span>
                    <span class="me-3">
                      <i class="fas fa-eye me-1"></i>{{ post.views || 0 }} lượt xem
                    </span>
                    <span>
                      <i class="fas fa-comments me-1"></i>{{ post.comments?.length || 0 }} bình luận
                    </span>
                  </div>
                </div>
                <div v-if="canEdit" class="btn-group">
                  <router-link :to="`/create-post?edit=${post.id}`" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-edit me-1"></i>Chỉnh sửa
                  </router-link>
                  <button @click="deletePost" class="btn btn-outline-danger btn-sm">
                    <i class="fas fa-trash me-1"></i>Xóa
                  </button>
                </div>
              </div>
              
              <div v-if="post.image" class="mb-4">
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="img-fluid rounded"
                  style="width: 100%; max-height: 400px; object-fit: cover;"
                >
              </div>
              
              <div class="post-content">
                <p class="lead">{{ post.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-comments me-2"></i>
                Bình luận ({{ post.comments?.length || 0 }})
              </h5>
            </div>
            <div class="card-body">
              <!-- Add Comment Form -->
              <div v-if="currentUser" class="mb-4">
                <form @submit.prevent="addComment">
                  <div class="mb-3">
                    <textarea
                      v-model="newComment"
                      class="form-control"
                      rows="3"
                      placeholder="Viết bình luận của bạn..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-paper-plane me-2"></i>
                    {{ isSubmitting ? 'Đang gửi...' : 'Gửi bình luận' }}
                  </button>
                </form>
              </div>
              <div v-else class="mb-4 text-center">
                <p class="text-muted">Vui lòng <router-link to="/login">đăng nhập</router-link> để bình luận</p>
              </div>

              <!-- Comments List -->
              <div v-if="post.comments && post.comments.length > 0">
                <div v-for="comment in post.comments" :key="comment.id" class="comment-item border-bottom pb-3 mb-3">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-2">
                        <img 
                          :src="comment.avatar || 'https://via.placeholder.com/32x32'" 
                          class="rounded-circle me-2" 
                          width="32" 
                          height="32"
                          :alt="comment.author"
                        >
                        <strong>{{ comment.author }}</strong>
                        <small class="text-muted ms-2">{{ formatDate(comment.createdAt) }}</small>
                      </div>
                      <p class="mb-0">{{ comment.content }}</p>
                    </div>
                    <div v-if="canDeleteComment(comment)" class="ms-2">
                      <button @click="deleteComment(comment.id)" class="btn btn-outline-danger btn-sm">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted py-4">
                <i class="fas fa-comments fa-2x mb-3"></i>
                <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <router-link to="/" class="btn btn-outline-primary">
          <i class="fas fa-arrow-left me-2"></i>Quay lại trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostDetail',
  data() {
    return {
      post: null,
      loading: true,
      newComment: '',
      isSubmitting: false
    }
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    },
    canEdit() {
      return this.currentUser && this.post && this.post.authorId === this.currentUser.id
    }
  },
  methods: {
    async loadPost() {
      try {
        const postId = this.$route.params.id
        const response = await fetch(`http://localhost:3000/posts/${postId}`)
        
        if (!response.ok) {
          throw new Error('Không tìm thấy bài viết')
        }
        
        this.post = await response.json()
        
        // Increment view count
        await this.incrementViews()
        
      } catch (error) {
        console.error('Error loading post:', error)
        this.post = null
      } finally {
        this.loading = false
      }
    },

    async incrementViews() {
      try {
        const updatedPost = { ...this.post, views: (this.post.views || 0) + 1 }
        
        const response = await fetch(`http://localhost:3000/posts/${this.post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPost)
        })
        
        if (response.ok) {
          this.post.views = updatedPost.views
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
      }
    },

    async addComment() {
      if (!this.newComment.trim() || !this.currentUser) return
      
      this.isSubmitting = true
      
      try {
        const comment = {
          id: Date.now(),
          content: this.newComment.trim(),
          author: this.currentUser.name,
          authorId: this.currentUser.id,
          avatar: this.currentUser.avatar || 'https://via.placeholder.com/32x32',
          createdAt: new Date().toISOString()
        }

        // Add comment to post
        const updatedPost = {
          ...this.post,
          comments: [...(this.post.comments || []), comment]
        }

        const response = await fetch(`http://localhost:3000/posts/${this.post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPost)
        })

        if (response.ok) {
          this.post = updatedPost
          this.newComment = ''
        } else {
          throw new Error('Không thể thêm bình luận')
        }

      } catch (error) {
        console.error('Error adding comment:', error)
        alert('Có lỗi xảy ra khi thêm bình luận')
      } finally {
        this.isSubmitting = false
      }
    },

    async deleteComment(commentId) {
      if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return
      
      try {
        const updatedComments = this.post.comments.filter(c => c.id !== commentId)
        const updatedPost = { ...this.post, comments: updatedComments }

        const response = await fetch(`http://localhost:3000/posts/${this.post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPost)
        })

        if (response.ok) {
          this.post = updatedPost
        } else {
          throw new Error('Không thể xóa bình luận')
        }

      } catch (error) {
        console.error('Error deleting comment:', error)
        alert('Có lỗi xảy ra khi xóa bình luận')
      }
    },

    canDeleteComment(comment) {
      return this.currentUser && (
        comment.authorId === this.currentUser.id || 
        this.post.authorId === this.currentUser.id
      )
    },

    async deletePost() {
      if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return
      
      try {
        const response = await fetch(`http://localhost:3000/posts/${this.post.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          this.$router.push('/')
        } else {
          throw new Error('Không thể xóa bài viết')
        }

      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Có lỗi xảy ra khi xóa bài viết')
      }
    },

    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  mounted() {
    this.loadPost()
  }
}
</script>

<style scoped>
.comment-item:last-child {
  border-bottom: none !important;
}

.comment-item {
  transition: background-color 0.2s;
}

.comment-item:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  margin: -10px;
}
</style>