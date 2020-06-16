<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">Groupomania</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/compose">Compose</b-nav-item>
          <b-nav-item to="#">Admin</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="isLoggedIn" :to="profile(this.$store.getters.userId)">{{this.$store.getters.userName}}</b-nav-item>
          <b-nav-item v-if="isLoggedIn" href="#" @click="logout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Header",
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      })
    },
    profile: function(id) {
      return `/profile/${id}`
    },
  }
};
</script>

<style scoped lang="scss">
</style>
