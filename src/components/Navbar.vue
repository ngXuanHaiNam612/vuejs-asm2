<template>
  <nav class="navbar navbar-expand-lg custom-navbar" style="z-index: 1000;">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        HN24BLOG
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" :class="{ active: $route.name === 'Home' }">
              <i class="fas fa-home me-1"></i>Trang chủ
            </router-link>
          </li>
          
          <li v-if="currentUser" class="nav-item">
            <!-- <li class="nav-item"> -->
            <router-link class="nav-link" to="/create-post" :class="{ active: $route.name === 'CreatePost' }">
              <i class="fas fa-plus me-1"></i>Đăng bài
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav">

          <template v-if="!currentUser">
            <li class="nav-item">
              <router-link class="nav-link" to="/login" :class="{ active: $route.name === 'Login' }">
                <i class="fas fa-sign-in-alt me-1"></i>Đăng nhập
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register" :class="{ active: $route.name === 'Register' }">
                <i class="fas fa-user-plus me-1"></i>Đăng ký
              </router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>{{ currentUser ? currentUser.name : 'User' }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="fas fa-user-cog me-1"></i>Thông tin cá nhân
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="logout">
                    <i class="fas fa-sign-out-alt me-1"></i>Đăng xuất
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      currentUser: null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser')
      this.currentUser = null
      this.$router.push('/')
    },
    checkAuth() {
      const user = localStorage.getItem('currentUser')
      if (user) {
        this.currentUser = JSON.parse(user)
      } else {
        this.currentUser = null
      }
    }

  },
  
  mounted() {
    this.checkAuth()
    window.addEventListener('storage', this.checkAuth)
    window.addEventListener('auth-changed', this.checkAuth)
    // Thêm event listener cho đăng nhập thành công
    window.addEventListener('login-success', this.checkAuth)
  },
  beforeUnmount() {
    // Cleanup event listeners
    window.removeEventListener('storage', this.checkAuth)
    window.removeEventListener('auth-changed', this.checkAuth)
    window.removeEventListener('login-success', this.checkAuth)
  }
}
</script>

<style scoped>
.custom-navbar {
  background-color: #DAB49D !important; /* Nâu nhẹ cho header/nav */
}

.navbar-brand {
  color: #fff;
  font-weight: bold;
  letter-spacing: 2px;
}

.nav-link {
  color: #fff !important;
  transition: background 0.2s, color 0.2s;
  border-radius: 6px;
}

.nav-link.active,
.nav-link.router-link-exact-active {
  background-color: #E59866 !important; /* Cam đậm cho link active */
  color: #fff !important;
}

.nav-link:hover {
  background-color: #E59866 !important; /* Cam đậm khi hover */
  color: #fff !important;
}

.dropdown-menu {
  border-radius: 8px;
}
</style>