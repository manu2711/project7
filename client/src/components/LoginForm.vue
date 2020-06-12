<template>
  <div class="loginForm">
    <!-- Login Form -->
    <b-form id="loginForm" @submit.prevent="login">
      <b-form-group id="email-group">
        <b-form-input
          v-model="loginEmail"
          id="email"
          type="email"
          required
          placeholder="Enter your email"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="password-group">
        <b-form-input
          v-model="loginPassword"
          id="password"
          type="password"
          required
          placeholder="Enter your password"
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" block variant="info">Login</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      loginEmail: "",
      loginPassword: "",
    };
  },
  methods: {
    // Login Function
    login: function() {
      let loginCredentials = {
        email: this.loginEmail,
        password: this.loginPassword
      };
      // Dispatch to login action
      this.$store.dispatch("login", loginCredentials)
        .then(() => this.$router.push("/dashboard"))
        .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped lang="scss">
</style>
