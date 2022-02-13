export interface Post {
    owner: String,
    title: String,
    body: String,
    image: String,
    upvotes?: Map<String, boolean>
}