<template>
  <div class="register">
    <span>Register</span>

    <RegisterForm class="registerContent" />
    
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue"

export default {
  name: 'Register',
  components: {
    RegisterForm
  }
}
</script>

<style lang="scss" scoped>

.registerContent {
  max-width: 40rem;
}

</style>
