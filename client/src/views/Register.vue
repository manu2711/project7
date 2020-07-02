<template>
  <div class="register d-flex flex-column">
    <b-container id="main" fluid="lg" class="d-flex flex-column align-items-center my-5">
      <!-- Groupomania Logo -->
      <b-row class="d-flex justify-content-center w-100">
        <b-col cols="12">
          <img src="../assets/images/icon-left-font.png" alt="Groupomania icon" />
        </b-col>
      </b-row>
      <b-row class="w-100 d-flex flex-column justify-content-center align-items-center mt-5">
          <!-- Register Form -->
          <h1>Register</h1>
          <b-form id="registerForm" class="mt-5 text-left" @submit.prevent="register">
            <b-form-group
            label="Name:"
            label-for="name">
              <b-form-input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                v-model="$v.name.$model"
                :state="validateState('name')"
              ></b-form-input>
              <b-form-invalid-feedback>Name is required and must be a least 3 characters</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
            label="Email:"
            label-for="email">
              <b-form-input
                id="email"
                name="email"
                type="email"
                placeholder="Enter you email"
                v-model="$v.email.$model"
                :state="validateState('email')"
              ></b-form-input>
              <b-form-invalid-feedback>Email is required and must be valid</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="password-group"
            label="Password:"
            label-for="password">
              <b-form-input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                v-model="$v.password.$model"
                :state="validateState('password')"
              ></b-form-input>
              <b-form-invalid-feedback>Password is required and must at least 8 characters (special charaters allowed: @/+*!%&.)</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="confirm-password-group"
            label="Confirm Password:"
            label-for="confirmPassword">
              <b-form-input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                v-model="$v.confirmPassword.$model"
                :state="validateState('confirmPassword')"
              ></b-form-input>
              <b-form-invalid-feedback>Passwords must be the same</b-form-invalid-feedback>
            </b-form-group>
            
            <!-- Error message alert -->
            <b-alert :show="errorShow" variant="danger">{{ errorMessage }}</b-alert>

            <b-button type="submit" variant="primary" aria-label="Register">Register</b-button>
          </b-form>
          <p class="mt-2">You already have account ? <router-link to="/login" aria-label="Login">Login</router-link></p>
        
      </b-row>
    </b-container>

    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs, helpers } from "vuelidate/lib/validators";

const passModel = helpers.regex("passModel", /^[a-zA-Z0-9-@/+*!%&.]*$/);

export default {
  name: "Register",
  components: {
    Footer
  },
  metaInfo: {
    title: 'Groupomania - Registration page',
    htmlAttrs: {
        lang: 'en'
      }
  },
  mixins: [validationMixin],
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      errorShow: false
    };
  },
  // Input validation
  validations: {
    name: {
      required,
      minLength: minLength(3)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8),
      passModel
    },
    confirmPassword: {
      sameAsPasword: sameAs('password')
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    // Register Function
    register: function() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      this.$store
        .dispatch("register", {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(() => {
          // If registration is successful, we immediately login the user
          this.$store
            .dispatch("login", {
              email: this.email,
              password: this.password
            })
            .then(() => this.$router.replace("/"))
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          // In case of error when registering, we alert the error message
              this.errorMessage = error
              this.errorShow = true
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.register {
  height: 100%;

  #main {
    flex: 1;

    img {
      width: 100%;
      max-width: 30rem;
    }
  }

  #registerForm {
    width: 100%;
    max-width: 40rem;
  }
}
</style>
