<template>
  <div class="uploadAvatar">
    <b-img
    v-if="avatarPreview"
    :src="avatarPreview"
    style="max-width: 200px"
    ></b-img>
    <form @submit.prevent="saveAvatar" enctype="multipart/form-data">
      <input
      type="file"
      style="display:none"
      ref=avatarInput
      @change="avatarSelected"
      >
      <b-button variant="info" @click="selectFile">Select Avatar</b-button>
      <b-button type="submit" variant="success" class="ml-2">Save</b-button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UploadAvatar',
  data() {
    return {
      avatar: '',
      avatarPreview: ''
    }
  },
  methods: {
    selectFile: function() {
      this.$refs.avatarInput.click();
    },
    avatarSelected(event) {
      this.avatar = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.avatar);
      reader.onload = event => {
        this.avatarPreview = event.target.result;
      }
    },
    async saveAvatar() {
      const formData = new FormData()
      formData.append('avatar', this.avatar)
      try {
        await axios.post(`http://localhost:3000/api/users/profile/${this.$route.params.id}/avatar`, formData)
        this.message = 'File has been uploaded'
        this.avatar = ''
        this.avatarPreview = ''
      } catch (error) {
        this.message = 'Something went wrong'
        console.log(error)
      }
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
