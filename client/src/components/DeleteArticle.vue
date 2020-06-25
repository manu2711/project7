<template>
    <div>
        <b-button
            variant="danger"
            @click="deleteArticle(articleId)"
        >Delete</b-button>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'DeleteArticle',
        props: {
            articleId: Number
        },
        methods: {
            deleteArticle: async function (articleId) {
                try {
                    axios.delete(`http://localhost:3000/api/articles/${articleId}`)
                    .then((response) => {
                    console.log(response.data)
                    this.$router.go()
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>