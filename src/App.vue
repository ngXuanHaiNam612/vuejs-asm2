<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <main class="container mt-4">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

main {
  flex: 1;
}

</style>
