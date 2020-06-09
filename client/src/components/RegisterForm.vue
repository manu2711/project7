<template>
  <div class="registerForm">
    <b-form id="registerForm" @submit.prevent="register">
      <b-form-group id="name-group">
        <b-form-input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Enter your name"
          v-model="registerName"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="email-group">
        <b-form-input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter you email"
          v-model="registerEmail"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="password-group">
        <b-form-input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          v-model="registerPassword"
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" block variant="info" @click="$bvModal.hide('register-modal')">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "RegisterForm",
  data() {
    return {
      registerName: '',
      registerEmail: '',
      registerPassword: ''
    };
  },
  methods: {
    // Register Function
    register: function() {
      let data = {
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword
      }
      this.$store.dispatch('register', data)
      .then(() => this.$router.push('/'))
      .catch(error => console.log(error))
      
      this.registerName = ''
      this.registerEmail = ''
      this.registerPassword = ''
    }
  }
};
</script>

<style scoped lang="scss">
</style>
