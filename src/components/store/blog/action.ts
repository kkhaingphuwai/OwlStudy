import { makeAutoObservable, runInAction } from "mobx";
import type { BlogState } from "./state";
import { blogApi } from "../../../service/blog/blogApi";

export class BlogAction {

    private state: BlogState;

    constructor(state: BlogState) {
        this.state = state;
        makeAutoObservable(this);
    }

    createBlog = async () => {
        try {
            const formData = new FormData();

            formData.append("title", this.state.title);
            formData.append("content", this.state.content);

            if (this.state.image) {
                formData.append("image", this.state.image);
            }
            this.state.loading = true;
            const response = await blogApi.createNewBlog(formData);
            this.state.setMessage(response.data.message)
            this.state.loading = false;
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }

    getAllBlogs = async () => {
        try {
            this.state.loading = true
            const response = await blogApi.getAllBlogs();
            this.state.setBlogs(response.data.data)
            this.state.loading = false
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }

    async searchBlogs(keyword: string) {
        try {
            const res = await blogApi.searchBlog(keyword);
            runInAction(() => {
                this.state.blogs = res.data.data;
            });
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.state.loading = false;
            });
        }
    }

    getBlogById = async (id: number) => {
        try {
            this.state.loading = true
            const response = await blogApi.getAllBlogById(id);
            console.log('Detail', response.data.data);
            this.state.setBlogDetail(response.data.data);
            this.state.loading = false;
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }

    increaseFavoriteBlog = async (id: number) => {

        const blogInDetail = this.state.blogDetail?.id === id ? this.state.blogDetail : null;
        const blogInList = this.state.blogs.find(b => b.id === id);

        const isCurrentlyLiked = blogInList?.likedByCurrentUser ?? false;

        runInAction(() => {
            if (blogInDetail) {
                blogInDetail.favoriteCount += isCurrentlyLiked ? -1 : 1;
                blogInDetail.likedByCurrentUser = !isCurrentlyLiked;
            }

            if (blogInList) {
                blogInList.favoriteCount += isCurrentlyLiked ? -1 : 1;
                blogInList.likedByCurrentUser = !isCurrentlyLiked;
            }
        });

        try {
            const response = await blogApi.increaseFavoriteCount(id);
            const serverCount = response.data.data;

            runInAction(() => {
                if (blogInDetail) blogInDetail.favoriteCount = serverCount;
                if (blogInList) blogInList.favoriteCount = serverCount;
            });

        } catch (err) {

            // rollback
            runInAction(() => {
                if (blogInDetail) {
                    blogInDetail.favoriteCount += isCurrentlyLiked ? 1 : -1;
                    blogInDetail.likedByCurrentUser = isCurrentlyLiked;
                }

                if (blogInList) {
                    blogInList.favoriteCount += isCurrentlyLiked ? 1 : -1;
                    blogInList.likedByCurrentUser = isCurrentlyLiked;
                }
            });

        }
    };

    getMostFavoriteBlog = async () => {
        try {
            this.state.loading = true
            const response = await blogApi.getMostFavoriteBlog();
            console.log('Most Favorite Blogs', response.data.data);
            this.state.setFavoriteBlogs(response.data.data)
            this.state.loading = false
        } catch (err) {
            console.log(err)
        } finally {
            this.state.loading = false
        }
    }
}