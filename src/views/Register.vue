<template>
  <div class="register container-fluid justify-content-center" style="width: 1000px; margin: 0 auto;">
    <div class="container justify-content-center">
      <div class="row">
        <div class="card shadow">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold">Đăng ký</h2>
              <p class="text-muted">Tạo tài khoản mới để bắt đầu</p>
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

            <!-- Register Form -->
            <form @submit.prevent="handleRegister" novalidate>

              <div class="mb-3">
                <label for="name" class="form-label">
                  <i class="fas fa-user me-1"></i>Họ và tên
                </label>
                <input id="name" v-model="form.name" type="text" class="form-control" placeholder="Nhập họ và tên"
                  required>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="fas fa-envelope me-1"></i>Email
                </label>
                <input id="email" v-model="form.email" type="email" class="form-control"
                  placeholder="Nhập email của bạn" required>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fas fa-lock me-1"></i>Mật khẩu
                </label>
                <div class="input-group">
                  <input id="password" v-model="form.password" type="password" class="form-control"
                    placeholder="Nhập mật khẩu" required>
                </div>
                <div class="form-text">
                  Mật khẩu phải có ít nhất 6 ký tự
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  <i class="fas fa-lock me-1"></i>Xác nhận mật khẩu
                </label>
                <div class="input-group">
                  <input id="confirmPassword" v-model="form.confirmPassword" type="password" class="form-control"
                    placeholder="Nhập lại mật khẩu" required>
                </div>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-success btn-lg" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-user-plus me-2"></i>
                  {{ isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
                </button>
              </div>
              
            </form>
            
            <hr class="my-4">
            <div class="text-center">
              <p class="mb-0">
                Đã có tài khoản?
                <router-link to="/login" class="text-decoration-none">
                  Đăng nhập ngay
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
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errorMessage: '',
      successMessage: '',
      isLoading: false
    }
  },
  methods: {
    async handleRegister() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        // Kiểm tra email đã tồn tại chưa từ json-server
        const response = await fetch('http://localhost:3000/users')
        if (!response.ok) {
          throw new Error('Không thể kết nối đến server')
        }

        const users = await response.json()
        const existingUser = users.find(u => u.email === this.form.email)

        if (existingUser) {
          throw new Error('Email đã được sử dụng')
        }

        // Tạo user mới
        const newUser = {
          id: Date.now(),
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          avatar: 'https://via.placeholder.com/150',
          createdAt: new Date().toISOString()
        }

        // Lưu user mới vào json-server
        const createResponse = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })

        if (!createResponse.ok) {
          throw new Error('Không thể tạo tài khoản')
        }

        // Tự động đăng nhập sau khi đăng ký
        localStorage.setItem('currentUser', JSON.stringify(newUser))

        this.successMessage = 'Đăng ký thành công! Bạn sẽ được chuyển đến trang chủ.'

        // Dispatch event để Navbar cập nhật ngay lập tức
        window.dispatchEvent(new Event('login-success'))

        // Redirect sau 2 giây
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
      this.errorMessage = ''

      if (!this.form.name.trim()) {
        this.errorMessage = 'Vui lòng nhập họ và tên'
        return false
      }

      if (!this.form.email.trim()) {
        this.errorMessage = 'Vui lòng nhập email'
        return false
      }

      if (!this.isValidEmail(this.form.email)) {
        this.errorMessage = 'Email không hợp lệ'
        return false
      }

      if (!this.form.password) {
        this.errorMessage = 'Vui lòng nhập mật khẩu'
        return false
      }

      if (this.form.password.length < 6) {
        this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự'
        return false
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = 'Mật khẩu xác nhận không khớp'
        return false
      }

      return true
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },


  }
}
</script>

<style scoped></style>