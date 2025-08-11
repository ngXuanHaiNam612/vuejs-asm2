<template>
  <div class="login container-fluid justify-content-center" style="width: 1000px; margin: 0 auto;">
    <div class="container justify-content-center">
      <div class="row">
        <div class="card shadow">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold">Đăng nhập</h2>
              <p class="text-muted">Chào mừng bạn quay trở lại!</p>
            </div>

            <!-- Alert Messages -->
            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
              <button type="button" class="btn-close"></button>
            </div>

            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
              <button type="button" class="btn-close"></button>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="fas fa-envelope me-1"></i>Email
                </label>
                <input id="email" v-model="form.email" type="email" class="form-control"
                  placeholder="Nhập email của bạn" required
                 >

              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fas fa-lock me-1"></i>Mật khẩu
                </label>
                <div class="input-group">
                  <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                    class="form-control" :class="{ 'is-invalid': errors.password }" placeholder="Nhập mật khẩu"
                    required>

                </div>
              </div>

              <div class="mb-3 form-check">
                <input id="rememberMe" v-model="form.rememberMe" type="checkbox" class="form-check-input">
                <label class="form-check-label" for="rememberMe">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-sign-in-alt me-2"></i>
                  {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
                </button>
              </div>
            </form>

            <hr class="my-4">

            <div class="text-center">
              <p class="mb-0">
                Chưa có tài khoản?
                <router-link to="/register" class="text-decoration-none">
                  Đăng ký ngay
                </router-link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      errorMessage: '',
      successMessage: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    async handleLogin() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        // Gọi API từ json-server để xác thực user
        const response = await fetch('http://localhost:3000/users')
        if (!response.ok) {
          throw new Error('Không thể kết nối đến server')
        }
        
        const users = await response.json()
        const user = users.find(u => u.email === this.form.email && u.password === this.form.password)

        if (!user) {
          throw new Error('Email hoặc mật khẩu không chính xác')
        }

        // Lưu user session => chuyển trang chủ => url: "/"
        localStorage.setItem('currentUser', JSON.stringify(user))
        this.successMessage = 'Đăng nhập thành công!'

        // Dispatch event để Navbar cập nhật ngay lập tức
        window.dispatchEvent(new Event('login-success'))

        // Redirect
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

      if (!this.form.email) {
        isValid = false
      } else if (!this.isValidEmail(this.form.email)) {
        isValid = false
      }

      if (!this.form.password) {
        isValid = false
      } else if (this.form.password.length < 6) {
        isValid = false
      }

      return isValid
    },

    // validatre Password và Email với biểu thức chính quy
    validateEmail() {
      // kiểm tra email với biểu thức chính quy
      if (this.form.email && !this.isValidEmail(this.form.email)) {
        this.errors.email = 'Email không hợp lệ'
      }
    },
    validatePassword() {
      if (this.form.password && this.form.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      }
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },



  },
  mounted() {

  }
}
</script>

<style scoped></style>