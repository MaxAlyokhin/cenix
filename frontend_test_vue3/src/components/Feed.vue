<template>
    <v-infinite-scroll
        :items="store.visiblePosts"
        :onLoad="load"
    >
        <Card
            v-if="store.postsIsLoaded && !store.isSearchActive"
            v-for="[key, value] of store.visiblePosts"
            :post="{ id: key, name: value }"
        />

        <Card
            v-else-if="store.isSearchActive"
            v-for="[key, value] of store.searchPostsResult"
            :post="{ id: key, name: value }"
        />

        <v-skeleton-loader
            v-else
            v-for="post of store.postsOnPage"
            :elevation="16"
            type="article"
            max-width="600"
            height="140"
            width="100%"
            class="mx-auto my-5"
        />
    </v-infinite-scroll>
</template>

<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts.ts'

const store = usePostsStore()

function load({ done }) {
    if (!store.isSearchActive) {
        store.page++
        if (store.visiblePosts.length >= store.mappedPosts.length) done('empty')
        else done('ok')
    } else {
        done('empty')
    }
}

onBeforeMount(() => {
    // Таймаут для демонстрации скелетона
    setTimeout(async () => {
        await store.getPosts()
    }, 1500)
})
</script>

<style lang="scss"></style>
