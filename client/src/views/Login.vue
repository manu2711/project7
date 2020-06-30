<template>
  <div class="login d-flex flex-column">
    <b-container id="main" fluid="lg" class="d-flex flex-column align-items-center my-5">
      <b-row class="d-flex justify-content-center w-100">
        <b-col cols="12">
          <img src="../assets/images/icon-left-font.png" alt="Groupomania icon" />
        </b-col>
      </b-row>
      <b-row class="w-100 d-flex flex-column justify-content-center align-items-center mt-5">
        
          <h1>Login</h1>
          <b-form id="loginForm" class="mt-5" @submit.prevent="login">
            <b-form-group>
              <b-form-input
                id="email"
                name="email"
                type="email"
                placeholder="Enter you email"
                v-model="$v.email.$model"
                :state="validateState('email')"
              ></b-form-input>
              <b-form-invalid-feedback>You must enter a valid Email</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="password-group">
              <b-form-input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                v-model="$v.password.$model"
                :state="validateState('password')"
              ></b-form-input>
              <b-form-invalid-feedback>You must enter a valide password</b-form-invalid-feedback>
            </b-form-group>

            
            <!-- Error message alert -->
            <b-alert :show="errorShow" variant="danger">{{ errorMessage }}</b-alert>

            <b-button type="submit" variant="primary">Login</b-button>
          </b-form>
          <p class="mt-2">Not a member yet ? <router-link to="/login">Register</router-link></p>
        
      </b-row>
      
    </b-container>

    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";

import { validationMixin } from "vuelidate";
import { required, minLength, email, helpers } from "vuelidate/lib/validators";

const passModel = helpers.regex("passModel", /^[a-zA-Z0-9-@/+*!%&.]*$/);

export default {
  name: "Register",
  components: {
    Footer
  },
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      errorShow: false
    };
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6),
      passModel
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    // Login Function
    login: function() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      
      // Dispatch to login action
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      })
        .then(() => this.$router.replace('/'))
        .catch(error => {
          // In case of error when login in, we alert the error message
              this.errorMessage = error
              this.errorShow = true
          console.log(error)
        }); 
    },
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;

  #main {
    flex: 1;

    img {
      width: 100%;
      max-width: 30rem;
    }
  }

  #loginForm {
    width: 100%;
    max-width: 40rem;
  }
}
</style>
