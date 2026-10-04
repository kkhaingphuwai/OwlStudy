import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import LoaderIcon from "../common/LoaderIcon";
import { formatDate } from "../store/comment/function";

const BlogDetailPage = observer(() => {
  const { id } = useParams();
  const { blogStore } = useStore();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { commentStore } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      blogStore.getBlogDetailById(Number(id));
    }
  }, [id, blogStore]);

  useEffect(() => {
    if (id) {
      commentStore.getAllComments(Number(id));
    }
  }, [id])

  const blog = blogStore.state.blogDetail;

  if (!blog) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <LoaderIcon />
    </div>
  );

  const handleFavorite = (id: number) => {
    blogStore.increaseFavoriteBlog(id);
  }

  const handleSubmitComment = async () => {
    const userInfo = sessionStorage.getItem("user");
    if (!userInfo) return;

    const user = JSON.parse(userInfo);

    if (editingId) {
      const payload = {
        commentId: editingId,
        description: commentStore.state.description
      };

      await commentStore.updateComment(payload);
      setEditingId(null);

    } else {
      const payload = {
        description: commentStore.state.description,
        authorId: user.id,
        blogId: Number(id),
        submissionId: null
      };
      await commentStore.postComments(payload);
    }

    commentStore.state.setField("description", "");

    await commentStore.getAllComments(Number(id));
  };

  const handleEdit = (comment: any) => {
    setEditingId(comment.id);

    commentStore.state.setField(
      "description",
      comment.description
    );
  };

  const handleDelete = async (id: number) => {
    commentStore.deleteComment(id);
    await commentStore.getAllComments(Number(id));
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 relative selection:bg-orange-100 overflow-x-hidden">
      {blogStore.state.loading && <LoaderIcon />}

      <div className="hidden xl:block fixed inset-y-0 left-1/2 -translate-x-[500px] w-1" />
      <div className="fixed top-0 left-0 w-full h-1 z-[70] bg-transparent">
        <div className="h-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-300 shadow-sm" style={{ width: '100%' }}></div>
      </div>

      <header className="max-w-2xl mx-auto pt-16 md:pt-20 pb-8 md:pb-12 px-6">
        <button
          onClick={() => navigate("/blogs")}
          className="cursor-pointer group mb-8 flex items-center gap-2.5 px-4 py-2 
             bg-white/40 backdrop-blur-md border border-slate-200/60 
             rounded-full transition-all duration-300 
             hover:bg-white hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 active:scale-95"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-rose-50">
            <svg
              className="w-3.5 h-3.5 text-slate-600 transition-transform group-hover:-translate-x-0.5 group-hover:text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900">
            Back
          </span>
        </button>
        <div className="flex items-center justify-center gap-3 mb-6 md:mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Written by</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
            {blog.authorName}
          </span>

          <span className="w-px h-3 bg-slate-200" />

          <div className="flex items-center gap-1.5 text-rose-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span className="text-[10px] font-medium lowercase tracking-wider">
              {blog.email}
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 text-center leading-[1.2] md:leading-[1.15] tracking-tight">
          {blog.title}
        </h1>

        <p className="text-center text-slate-400 text-xs md:text-sm mt-6 italic font-serif opacity-80">
          Published : {formatDate(blog.createdAt)}
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mb-16 md:mb-10">
        <div className="aspect-video relative bg-[#F7F3ED] rounded-2xl md:rounded-3xl border border-slate-200/50 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] group">
          <img
            src={`http://localhost:8080/images/${blog.imageUrl}`}
            alt={blog.title || "Blog Post"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="hidden md:block h-px w-12 bg-slate-200/60"></div>

          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">
              Was this helpful?
            </span>

            <button
              onClick={() => handleFavorite(blog.id)}
              className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-rose-50/50 transition-all duration-300 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                // 1. Toggle fill based on the boolean
                fill={blog.likedByCurrentUser ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                // 2. Add 'fill-rose-400' classes when true
                className={`w-4 h-4 transition-all duration-300 ${blog.likedByCurrentUser
                  ? "text-rose-500 fill-rose-500"
                  : "text-rose-400 group-hover:text-rose-500"
                  }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>

              <span className="text-xs font-bold text-slate-500 tabular-nums">
                {blog.favoriteCount}
              </span>
            </button>
          </div>
          <div className="hidden md:block h-px w-12 bg-slate-200/60"></div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 md:px-8 pb-32 md:pb-48">
        <article className="
            prose prose-slate 
            prose-lg md:prose-xl 
            max-w-none 
            text-slate-800/90 
            leading-[1.85] md:leading-[1.95] 
            text-left 
            font-serif
            selection:bg-orange-200
          ">
          <div
            className="prose max-w-none whitespace-pre-line [&_h1]:text-3xl [&_h1]:font-bold
                  [&_h2]:text-2xl [&_h2]:font-bold
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                  [&_li]:mb-1
                  [&_blockquote]:border-l-4 [&_blockquote]:pl-4 italic
                  [&_img]:rounded-xl [&_img]:my-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </main>

      <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full px-6 flex justify-center">
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`
            relative flex items-center gap-2 md:gap-3 bg-gradient-to-r from-orange-400 to-rose-500 
            text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold shadow-2xl transition-all duration-500
            hover:-translate-y-1 active:scale-95 border border-white/20 cursor-pointer whitespace-nowrap
            ${!isCommentsOpen ? 'animate-sunset-float' : ''}
          `}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span className="text-[10px] md:text-xs uppercase tracking-widest">
            {commentStore.state.comments.length} {isCommentsOpen ? "Hide Discussion" : "Discussion"}
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-[100] transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${isCommentsOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="max-w-3xl mx-auto bg-white border-x border-t border-slate-100 shadow-[0_-40px_100px_rgba(0,0,0,0.08)] rounded-t-[2.5rem] md:rounded-t-[3.5rem] h-[85vh] md:h-[75vh] flex flex-col">

          <div
            className="w-full flex justify-center py-4 cursor-pointer group"
            onClick={() => setIsCommentsOpen(false)}
          >
            <div className="flex flex-col items-center gap-1 transition-all duration-300 group-hover:translate-y-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-6 h-6 text-slate-300 group-hover:text-orange-400 transition-colors"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Close
              </span>
            </div>
          </div>

          <div className="px-8 md:px-16 pb-12 overflow-y-auto flex-1">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center tracking-tight uppercase italic font-serif">
              Comments
            </h3>

            <div className="mb-12">
              <textarea
                value={commentStore.state.description}
                onChange={(e) => {
                  commentStore.state.setField("description", e.target.value);
                }}
                className="w-full bg-[#FDFBF7] rounded-2xl p-6 text-slate-800 focus:bg-white border-2 border-transparent focus:border-orange-100 focus:ring-4 focus:ring-orange-50/50 transition-all outline-none resize-none text-base shadow-inner"
                placeholder="What are your thoughts?"
                rows={4}
              />
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmitComment}
                  className="bg-gradient-to-r from-orange-400 to-rose-500 text-white px-10 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">
                  {editingId ? "Update Comment" : "Post Comment"}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      commentStore.state.setField("description", "");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-10 max-w-xl mx-auto mb-5">
              {commentStore.state.comments.map((comment) => {
                const userInfo = sessionStorage.getItem("user");
                const loginUser = userInfo ? JSON.parse(userInfo) : null;
                const isOwner = loginUser?.id === comment.userId;

                return (
                  <div key={comment.id} className="flex gap-4 items-start">

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-rose-500 text-xs shadow-sm border border-orange-100/50 flex-shrink-0">
                      {comment.whoComment.charAt(0)}
                    </div>

                    <div className="flex-1 border-b border-orange-100/30 pb-4">

                      {/* Header */}
                      <div className="flex justify-between items-center mb-1">

                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {comment.whoComment}
                          </p>

                          <p className="text-slate-400 text-[10px] uppercase tracking-wide">
                            {formatDate(comment.timeStamp)}
                          </p>
                        </div>

                        {/* Owner Actions */}
                        {isOwner && (
                          <div className="flex gap-3 items-center">


                            <button
                              onClick={() => handleEdit(comment)}
                              className="text-xs text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(Number(comment.id))}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}

                      </div>

                      {/* Body */}
                      <p className="text-slate-600 text-sm leading-relaxed font-serif italic">
                        {comment.description}
                      </p>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BlogDetailPage;