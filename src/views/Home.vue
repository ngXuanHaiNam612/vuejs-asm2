<template>
  <div class="home">
    <!-- Slide show -->
    <div class="container-fluid">
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
            aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/images/banner-1.jpg" class="d-block w-100  " alt="..."
              style="object-fit: cover; max-height: 500px;">
          </div>
          <div class="carousel-item">
            <img src="/images/banner-2.jpg" class="d-block w-100  " alt="..."
              style="object-fit: cover;max-height: 500px;">
          </div>
          <div class="carousel-item">
            <img src="/images/banner-3.jpg" class="d-block w-100  " alt="..."
              style="object-fit: cover; max-height: 500px;">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

    </div>

    <!-- Search and Filter -->
    <div class="row">
      <!-- Slide Bar -->
      <div class="col-md-3 slidebar">
        <div class="list-group mt-5">
          <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
            Danh sách bài viết yêu thích
          </a>
          <a href="#" class="list-group-item list-group-item-action" v-for="post in savedPosts.slice(0, 5)"
            :key="post.id">
            {{ post.title }}</a>

        </div>

        <form class="mt-4 card p-4">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Nhập email nhận thông báo</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
              placeholder="Email">
          </div>

          <button type="submit" class="btn btn-primary">Đăng ký</button>
        </form>
      </div>

      <!-- Search -->
      <div class="col-md-9">
        <div class="row mb-4 mt-5">
          <div class="col-md-8">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Tìm kiếm bài viết...">
              <button class="btn btn-outline-secondary" type="button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Posts Grid -->
        <div v-if="paginatedPosts.length > 0" class="row">
          <div v-for="post in paginatedPosts" :key="post.id" class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
              <img v-if="post.image" :src="post.image" class="card-img-top" style="height: 200px; object-fit: cover;"
                :alt="post.title">
              <div class="card-body d-flex flex-column">
                <!-- <h5 class="card-title">{{ post.title }}</h5> -->
                <h5>
                  <router-link :to="`/post/${post.id}`" class="card-title">
                    {{ post.title }}
                  </router-link>
                </h5>
                <p class="card-text flex-grow-1">{{ truncateContent(post.content) }}</p>
                <div class="card-footer-info text-end">
                  <small class="text-muted">
                    <i class="fas fa-user me-1"></i>{{ post.author }}
                    <span class="ms-3">
                      <i class="fas fa-calendar me-1"></i>{{ formatDate(post.createdAt) }}
                    </span>
                  </small>
                  <div class="mt-2">
                    <span class="badge bg-secondary me-2">
                      <i class="fas fa-comments me-1"></i>{{ post.comments?.length || 0 }} Bình luận
                    </span>
                    <span class="badge bg-info">
                      <i class="fas fa-eye me-1"></i>{{ post.views || 0 }} Lượt xem
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <nav v-if="totalPages > 1" aria-label="Pagination">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Trước</button>
            </li>
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">Sau</button>
            </li>
          </ul>
        </nav>
      </div>

    </div>


  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      posts: [],
      filteredPosts: [],
      currentPage: 1,
      postsPerPage: 6
    }
  },
  computed: {

    // isAuthenticated() {
    //   return localStorage.getItem('user') !== null
    // },

    currentUser() {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    },

    savedPosts() {
      return this.posts || []
    },

    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    },

    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage
      const end = start + this.postsPerPage
      return this.filteredPosts.slice(start, end)
    },

    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },

  methods: {
    async loadPosts() {
      try {
        const savedPosts = localStorage.getItem('posts')
        // Gọi API từ json-server
        const response = await fetch('http://localhost:3000/posts')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        this.posts = await response.json()

        // Cập nhật filteredPosts
        this.filteredPosts = [...this.posts]

      } catch (error) {
        console.error('Error loading posts:', error)
      }
    },
    truncateContent(content, length = 150) {
      if (content.length <= length) return content
      return content.substring(0, length) + '...'
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
  },
  mounted() {
    this.loadPosts()
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-img-top {
  transition: opacity 0.3s ease;
}

.card-title:hover {
  font-weight: 650;
  color: rgb(16, 16, 148);
}

.slidebar .list-group-item.active {
  background-color: #DAB49D !important;
  /* Nâu nhẹ cho item active */
  border-color: #DAB49D !important;
  color: #fff !important;
  font-weight: bold;
}

.slidebar .list-group-item {
  background-color: #fff;
  color: #333;
  border: 1px solid #DAB49D;
  transition: background 0.2s, color 0.2s;
}

.slidebar .list-group-item:hover {
  background-color: #E59866 !important;
  /* Cam đậm khi hover */
  color: #fff !important;
}

.slidebar form .btn-primary {
  background-color: #E59866 !important;
  /* border-color: #E59866 !important; */
}

.page-link {
  color: #007bff;
}

.page-item.active .page-link {
  background-color: #117becf8;
  border-color: #007bff;
  color: white;
}
</style>