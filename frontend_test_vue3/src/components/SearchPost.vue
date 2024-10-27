<template>
    <v-card
        class="mx-auto mx-auto my-5"
        max-width="600"
    >
        <v-card-text>
            <v-text-field
                v-model="query"
                :loading="loading"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Search posts"
                variant="solo-filled"
                hide-details
                single-line
                @click:append-inner="search"
            ></v-text-field>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts'

const store = usePostsStore()
const loading = ref(false)
const query = ref('')

function search() {
    if (query.value) {
        store.searchPost(query.value)
        store.isSearchActive = true
    } else {
        store.isSearchActive = false
    }
}

watch(query, (newValue) => {
    if (!newValue) {
        store.isSearchActive = false
    }
})
</script>
