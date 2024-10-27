<template>
    <v-card
        :key="post.id"
        class="card mx-auto my-5"
        elevation="16"
        max-width="600"
        width="100%"
    >
        <v-card-item>
            <v-card-title> {{ post.id }} </v-card-title>
        </v-card-item>

        <v-card-text v-if="!isEdit"> {{ message }} </v-card-text>
        <v-card-text v-else>
            <v-form>
                <v-text-field
                    v-model="message"
                    :append-icon="'mdi-send'"
                    clear-icon="mdi-close-circle"
                    label="Message"
                    type="text"
                    variant="solo-filled"
                    clearable
                    @click:append="sendMessage(post.id)"
                    @click:clear="clearMessage(post.id)"
                ></v-text-field>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-btn
                text="Edit"
                @click="editPost(post.id)"
            ></v-btn>
            <v-btn
                text="Delete"
                @click="deletePost(post.id)"
            ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { usePostsStore } from '@/stores/posts.ts'

const props = defineProps(['post'])
const store = usePostsStore()
const isEdit = ref(false)
const message = ref(props.post.name)

function deletePost(id) {
    store.deletePost(id)
}

function editPost(id) {
    isEdit.value = true
}

function sendMessage(id) {
    store.editPost({ id: id, name: message.value })
    isEdit.value = false
}

function clearMessage(id) {
    message.value = ''
    store.editPost({ id: id, name: message.value })
}

// watch(message, (newValue) => {
//     console.log(newValue);

// })
onUpdated(() => {
    // console.log(props.post.name);
    // console.log(message.value);


    message.value = props.post.name
})
</script>

<style lang="scss">
.card {
    &:hover {
        background-color: #161616;
    }
}
</style>
