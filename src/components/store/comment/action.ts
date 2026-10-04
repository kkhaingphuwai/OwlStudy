import { makeAutoObservable } from "mobx";
import type { CommentState } from "./state";
import { commentApi, type CommentRequest } from "../../../service/comment/commentApi";

export interface EditCommentRequestDto {
  commentId: number;
  description: string;
}

export class CommentAction {

    private state: CommentState;

    constructor(state: CommentState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getAllComments = async (id: number) => {
        try {
            const response = await commentApi.getAllComments(id);
            this.state.setComments(response.data.data);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {

        }
    };

    deleteComment = async (id: number) => {
        try {
            await commentApi.deleteComment(id);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {

        }
    };

    updateComment = async (payload: EditCommentRequestDto) => {
        try {
            await commentApi.updateComment(payload);
        } catch (err) {
            console.log(err)
        } finally {
            
        }
    }

    getAllFeedBacks = async (id: number | null) => {
        try {
            const response = await commentApi.getAllFeedbacks(id);
            this.state.setFeedBacks(response.data.data);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
        }
    };

    postComments = async (data: CommentRequest) => {
        try {
            const response = await commentApi.postComments(data);
            const newComment = response.data.data;

            if (data.submissionId) {
                this.state.feedbacks.push(newComment);
            } else if (data.blogId) {
                this.state.comments.push(newComment);
            }
            this.state.description = '';
        } catch (err) {
            console.error(err);
            throw err;
        }
    };
}