<template>
  <div class="home">
    <Header v-if="isLoggedIn" />
    <b-container id="main" fluid="lg">
      <b-row
        v-if="!isLoggedIn"
        align-v="center"
        align-h="center"
        class="justify-content-lg-between"
      >
        <b-col cols="12" lg="6" class="mb-5 mb-lg-0" style="max-width: 30rem">
          <img src="../assets/images/icon-left-font.png" alt="Groupomania icon" />
        </b-col>
        <b-col class="text-left" cols="12" lg="6" style="max-width: 30rem">
          <h3 class="text-center">Login</h3>

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
          <div class="mt-2 text-center">
            <a href="#" v-b-modal.register-modal>Register</a>
          </div>
          <b-modal id="register-modal" action="#" title="User registration" centered hide-footer>
            <RegisterForm />
          </b-modal>
        </b-col>
      </b-row>
      <b-row v-if="isLoggedIn">
        <b-col>Bienvenue sur le forum Groupomania !</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import RegisterForm from "@/components/RegisterForm.vue";

// Depedencies
// import axios from "axios";

export default {
  name: "Home",
  components: {
    Header,
    RegisterForm
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  data() {
    return {
      loginEmail: "",
      loginPassword: ""
    };
  },
  methods: {
    // Login Function
    login: function() {
      const data = {
        email: this.loginEmail,
        password: this.loginPassword
      };
      this.$store
        .dispatch("login", data)
        .then(() => this.$router.push("/dashboard"))
        .catch(error => {
          console.log(error);
          this.$router.push("/");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 90vh;

  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      width: 100%;
    }
  }
}
</style>
