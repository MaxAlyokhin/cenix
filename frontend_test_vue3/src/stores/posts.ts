import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', () => {
    interface IPost {
        id: string,
        name: string
    }

    type MappedPosts = Map<string, string>

    const postsIsLoaded = ref(false)
    const postsOnPage = ref(10)
    const page = ref(1)
    const mappedPosts = ref<MappedPosts>(new Map())
    const visiblePosts = computed(() => new Map(Array.from(mappedPosts.value).slice(0, postsOnPage.value * page.value)))
    const searchPostsResult = ref<MappedPosts>(new Map())
    const isSearchActive = ref(false)

    async function getPosts() {
        if (!localStorage.getItem('posts')) {
            const data = await (await fetch('test.json')).json()
            const posts: IPost[] = [...data.posts.reverse()] // В обратном порядке, чтобы новый пост был сверху
            posts.forEach(post => mappedPosts.value.set(post.id, post.name))

            setLocalStorage()
        } else {
            getLocalStorage()
        }

        postsIsLoaded.value = true
    }

    function deletePost(id: string) {
        mappedPosts.value.delete(id)
        setLocalStorage()
    }

    function editPost(newPost: IPost) {
        mappedPosts.value.set(newPost.id, newPost.name)
        setLocalStorage()
    }

    function createPost(newPost: IPost) {
        const withNew = Array.from(mappedPosts.value)
        withNew.unshift([newPost.id, newPost.name])
        mappedPosts.value = new Map(withNew)
        setLocalStorage()
    }

    function searchPost(query: string) {
        let results = [...mappedPosts.value.keys()].filter(id => {
            return id.toLowerCase().includes(query.toLowerCase())
        })

        results.forEach(id => searchPostsResult.value.set(id, String(mappedPosts.value.get(id))))
    }

    function setLocalStorage() {
        const posts = Array.from(mappedPosts.value)
        localStorage.setItem('posts', JSON.stringify(posts))
    }

    function getLocalStorage() {
        const posts = String(localStorage.getItem('posts'))
        const parsedPosts = JSON.parse(posts)
        mappedPosts.value = new Map(parsedPosts)
    }

    return { postsIsLoaded, postsOnPage, page, visiblePosts, mappedPosts, isSearchActive, searchPostsResult, getPosts, deletePost, editPost, createPost, searchPost }
})

