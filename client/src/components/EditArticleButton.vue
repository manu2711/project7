<template>
    <div>
        <b-button
            variant="info"
            :to="'/edit/' + articleId"
            @click="editArticle(articleId)"
        >Edit</b-button>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        name: 'EditArticleButton',
        props: {
            articleId: Number
        },
        methods: {
            editArticle: async function (articleId) {
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