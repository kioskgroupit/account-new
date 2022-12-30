<template>
  <v-app>
    <main>
      <!-- <router-link @click="showMenu = false" to="/order" tag="span" active-class="primary--text" style="cursor: pointer">New order</router-link>
      <router-link @click.native="showMenu = true" to="/order" tag="span" active-class="primary--text" style="cursor: pointer">New order</router-link> -->
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.background {
  background-color: #FF9800;
}

.bgV-list {
  background-color: #FFE0B2;
}

.fontV-list {
  color: #FFCC80;
}
</style>
