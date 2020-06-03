<template>
  <div class="home">
    <b-container id="main" fluid="lg">
      <b-row align-v="center" align-h="center" class="justify-content-lg-between">
        <b-col cols="12" lg="6" class="mb-5 mb-lg-0" style="max-width: 30rem">
          <img src="../assets/images/icon-left-font.png" alt="Groupomania icon" />
        </b-col>
        <b-col class="text-left" cols="12" lg="6" style="max-width: 30rem">
          <h3 class="text-center">Login</h3>

          <b-form>
            <b-form-group id="email-group" label="Email address:" label-for="email">
              <b-form-input id="email" type="email" required placeholder="Enter email"></b-form-input>
            </b-form-group>
            <b-form-group id="password-group" label="Password:" label-for="password">
              <b-form-input id="password" type="password" required placeholder="Enter password"></b-form-input>
            </b-form-group>
            <b-button type="submit" block variant="info">Login</b-button>
          </b-form>
          <div class="mt-2 text-center">
            <a href="#" v-b-modal.register-modal>Register</a>
          </div>
          <b-modal id="register-modal" action="#" title="Register" centered hide-footer>
            <b-form id="registerForm" @submit="register">
              <b-form-group id="name-group" label="Name:" label-for="name">
                <b-form-input id="name" name="name" type="text" required placeholder="Enter name" v-model="registerName"></b-form-input>
              </b-form-group>
              <b-form-group id="email-group" label="Email address:" label-for="email">
                <b-form-input id="email" name="email" type="email" required placeholder="Enter email" v-model="registerEmail"></b-form-input>
              </b-form-group>
              <b-form-group id="password-group" label="Password:" label-for="password">
                <b-form-input id="password" name="password" type="password" required placeholder="Enter password" v-model="registerPassword"></b-form-input>
              </b-form-group>
              <b-button type="submit" block variant="info" @click="$bvModal.hide('register-modal')">Submit</b-button>
            </b-form>
          </b-modal>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src

// Depedencies
import axios from "axios";


export default {
  name: "Home",
  data() {
    return {
      registerName: '',
      registerEmail: '',
      registerPassword: ''
    };
  },
  methods: {
    register: function(e) {
      e.preventDefault()
      
      axios.post('http://localhost:3000/api/users/signup', {
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword
      })
      .then(result => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })

      this.registerName = ''
      this.registerEmail = ''
      this.registerPassword = ''
    }
  }
}
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
