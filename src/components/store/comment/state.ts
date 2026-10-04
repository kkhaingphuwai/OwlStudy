import { makeAutoObservable } from "mobx";

interface Comment {
    id: string;
    description: string;
    timeStamp: string;
    whoComment: string;
    userId: number;
}

interface FeedBack {
    id: string;
    description: string;
    timeStamp: string;
}

export class CommentState {

    comments: Comment[] = [];
    description: string = ''
    feedbacks: FeedBack[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setComments(comments: Comment) {
       this.comments = Array.isArray(comments) ? comments : [];
    }

    setFeedBacks(feedbacks: FeedBack) {
       this.feedbacks = Array.isArray(feedbacks) ? feedbacks : [];
    }

    setField<K extends keyof CommentState>(key: K, value: CommentState[K]) {
        (this as CommentState)[key] = value;
    }
}
