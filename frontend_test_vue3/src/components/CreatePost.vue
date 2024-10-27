<template>
    <v-card
        class="mx-auto px-6 py-8 mx-auto my-5"
        max-width="600"
    >
        <v-form @submit.prevent="onSubmit">
            <v-text-field
                v-model="newPost.id"
                required
                class="mb-2"
                label="id"
                placeholder="ID of new post"
                clearable
                variant="solo-filled"
            ></v-text-field>

            <v-text-field
                v-model="newPost.name"
                required
                label="Text"
                placeholder="Test of new post"
                clearable
                variant="solo-filled"
            ></v-text-field>

            <br />

            <v-btn
                :disabled="!newPost.id && !newPost.name"
                color="success"
                size="large"
                type="submit"
                variant="elevated"
                block
            >
                Create post
            </v-btn>
        </v-form>
    </v-card>
</template>

<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts.ts'

const store = usePostsStore()
const newPost = reactive({ id: '', name: '' })

function onSubmit() {
    store.createPost(newPost)
}
</script>

<style lang="scss"></style>
