<template>
  <div class="about">
    <Header />
    <h1>About</h1>
    <b-container fluid>
      <b-row>
        <b-col>1 of 3</b-col>
        <b-col>2 of 3</b-col>
        <b-col>3 of 3</b-col>
    </b-row>
    </b-container>
    
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'About',
  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>

</style>
