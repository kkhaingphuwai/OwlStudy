import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { formatDate } from "../store/blog/functions";
import { useNavigate } from "react-router-dom";

const BlogList = observer(() => {
  const { blogStore } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim() === "") {
        blogStore.getAllBlog();
      } else {
        blogStore.searchBlogs(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleBlogDetails = (id: number) => {
    navigate(`/blogs/${id}`);
  };

  const sortedBlogs = [...blogStore.state.blogs].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.favoriteCount || 0) - (a.favoriteCount || 0);
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  const SearchIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg
      className={`w-5 h-5 inline-block ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <header className="relative pt-10 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Etutor
            </span>{" "}
            Blog
          </h1>
        </div>
      </header>

      {/* Navigation & Filters */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">

          {/* Search & Sort */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white outline-none transition-all"
              />
            </div>
            <select
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {blogStore.state.blogs.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-bold text-slate-800">
              No articles yet
            </h3>
            <p className="text-slate-500">
              Check back during the next sunrise!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {sortedBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col bg-white rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-[0_20px_40px_rgba(255,107,0,0.1)] transition-all duration-500 overflow-hidden"
              >
                {/* Visual Header */}
                <div className="relative h-64 bg-slate-50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-rose-500/20 group-hover:scale-110 transition-transform duration-700">
                    <img
                      src={`http://localhost:8080/images/${blog.imageUrl}`}
                      alt={blog.title || "Blog Post"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur text-[11px] font-black uppercase tracking-widest text-rose-600 rounded-full shadow-sm">
                      {blog.authorName}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mb-3 uppercase tracking-tighter">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>•</span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {blog.authorName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {blog.authorName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBlogDetails(blog.id)}
                      className="cursor-pointer flex items-center gap-2 font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600 uppercase tracking-widest"
                    >
                      Full Article{" "}
                      <ArrowRightIcon className="text-orange-500" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
});

export default BlogList;
