import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import LoaderIcon from "../common/LoaderIcon";
import { useNavigate } from "react-router-dom";
import MessengerWidget from "../message/MessageWidget";
import TodayMeeting from "../upcomingMeeting/TodayMeeting";

const IconChevronLeft = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m15 18-6-6 6-6" />
    </svg>
);
const IconChevronRight = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);
const IconArrowRight = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);

const BlogDashboard = observer(() => {
    const { blogStore } = useStore();
    const [currentPage, setCurrentPage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    const navigate = useNavigate();

    useEffect(() => {
        blogStore.getMostFavoriteBlog();
    }, [blogStore]);

    const blogs = blogStore.state.favoriteBlogs || [];
    const displayBlogs = blogs;

    // Set to 3 per page 
    const itemsPerPage = 3;
    const totalPages = Math.max(1, Math.ceil(displayBlogs.length / itemsPerPage));

    const nextSlide = () =>
        setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    const prevSlide = () =>
        setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));

    useEffect(() => {
        if (!isHovered && displayBlogs.length > itemsPerPage) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [currentPage, isHovered, displayBlogs.length, totalPages]);

    const handleTouchStart = (e: any) =>
        (touchStart.current = e.targetTouches[0].clientX);
    const handleTouchMove = (e: any) =>
        (touchEnd.current = e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (touchStart.current - touchEnd.current > 75) nextSlide();
        if (touchStart.current - touchEnd.current < -75) prevSlide();
    };

    const handleBlogDetails = (id: number) => {
        navigate(`/blogs/${id}`);
    };

    return (
        <div
            className="relative w-full max-w-[1400px] mx-auto py-5 px-6 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {blogStore.state.loading && <LoaderIcon />}
            {/* Navigation Header */}
            <div className="flex items-end justify-between mb-8 px-2">
                {totalPages >= 1 && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 w-full pb-4">

                        {/* Left Column: Typography */}
                        <div className="space-y-2">
                            <span className="text-orange-600 font-bold tracking-[0.2em] text-xs uppercase italic">
                                Top Pick
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Must Read{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                                    Blogs.
                                </span>
                            </h2>
                        </div>

                        {/* Right Column: Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={prevSlide}
                                className="cursor-pointer w-12 h-12 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-tr from-orange-500 to-rose-500 rounded-xl border border-slate-200 text-white hover:opacity-90 transition-all duration-300 active:scale-95 group"
                                title="Previous"
                            >
                                <div className="group-hover:-translate-x-0.5 transition-transform duration-300">
                                    <IconChevronLeft />
                                </div>
                            </button>

                            <button
                                onClick={nextSlide}
                                className="cursor-pointer w-12 h-12 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-tr from-orange-500 to-rose-500 rounded-xl border border-slate-200 text-white hover:opacity-90 transition-all duration-300 active:scale-95 group"
                                title="Next"
                            >
                                <div className="group-hover:translate-x-0.5 transition-transform duration-300">
                                    <IconChevronRight />
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Slider Track */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                    {[...Array(totalPages)].map((_, pageIndex) => (
                        <div
                            key={pageIndex}
                            className={`grid gap-8 min-w-full p-2 ${
                                // 3 Columns on Large Screens
                                displayBlogs.length === 1
                                    ? "grid-cols-1 justify-items-center"
                                    : displayBlogs.length === 2
                                        ? "grid-cols-1 md:grid-cols-2"
                                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                }`}
                        >
                            {displayBlogs
                                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                .map((blog) => (
                                    <article
                                        key={blog.id}
                                        className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 hover:border-orange-200 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(255,107,0,0.12)] transition-all duration-500 overflow-hidden h-full transform hover:-translate-y-2"
                                    >
                                        <div className="relative h-60 overflow-hidden bg-slate-50">
                                            <img
                                                src={`http://localhost:8080/images/${blog.imageUrl}`}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 flex flex-col flex-grow">
                                            <h4 className="text-xl font-extrabold text-slate-800 leading-tight mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h4>


                                            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium"
                                                dangerouslySetInnerHTML={{ __html: blog.content }}
                                            />

                                            {/* Footer */}
                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                                        {blog.authorName?.charAt(0) || "A"}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[14px] font-bold text-slate-800">
                                                            {blog.authorName}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                            Author
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleBlogDetails(blog.id)}
                                                    className="cursor-pointer w-10 h-10 rounded-full bg-slate-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300"
                                                >
                                                    <IconArrowRight />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2.5 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`transition-all duration-500 rounded-full ${currentPage === i
                                ? "w-10 h-2 bg-gradient-to-r from-orange-500 to-rose-500 shadow-md shadow-orange-100"
                                : "w-2 h-2 bg-slate-200 hover:bg-slate-300"
                                }`}
                        />
                    ))}
                </div>
            )}
            <div className="flex">
                <TodayMeeting />
            </div>
            <MessengerWidget />
        </div>
    );
});

export default BlogDashboard;
