<template>
  <div>
    <b-navbar class="bg" toggleable="lg" type="dark" fixed="top">
      <b-navbar-brand to="/">
         <img class="logo" src="../assets/images/logo.png" alt="Groupomania logo">
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" aria-expanded="false"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item aria-label="Home" to="/">Home</b-nav-item>
          <b-nav-item aria-label="Compose" to="/compose">Compose</b-nav-item>
          <b-nav-item v-if="isAdmin" aria-label="Admin" to="/admin">Admin</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="isLoggedIn" aria-label="Profile" to="/profile">{{this.$store.getters.userName}}</b-nav-item>
          <b-nav-item v-if="isLoggedIn" aria-label="Logout" href="#" @click="logout">Logout</b-nav-item>
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
    },
    isAdmin: function(){
      return this.$store.getters.isAdmin;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.replace("/login");
      })
    }
  }
};
</script>

<style scoped lang="scss">
.logo {
  max-width: 12rem;
}

.bg {
  background-color:#091f43;
}
</style>
