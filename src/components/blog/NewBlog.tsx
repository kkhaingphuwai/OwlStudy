import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import LoaderIcon from "../common/LoaderIcon";
import { toast } from "react-toastify";
import { 
  Image as ImageIcon, 
  X, 
  Lightbulb, 
  ArrowRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  ChevronDown
} from "lucide-react";

interface NewBlogProps {
  show: boolean;
  onClose: () => void;
}

const NewBlog: React.FC<NewBlogProps> = observer(({ show, onClose }) => {
  const { blogStore } = useStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== blogStore.state.content) {
      contentRef.current.innerHTML = blogStore.state.content;
    }
  }, [blogStore.state.content]);

  if (!show) return null;

  const image = blogStore.state.image;
  const preview = image ? URL.createObjectURL(image) : null;

  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

  const handleFormat = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    document.execCommand(command, false, value || undefined);
    if (contentRef.current) {
      blogStore.state.setField("content", contentRef.current.innerHTML);
    }
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      setSelectedImage(target as HTMLImageElement);
    } else {
      setSelectedImage(null);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      blogStore.state.setField("content", contentRef.current.innerHTML);
      if (selectedImage && !contentRef.current.contains(selectedImage)) {
        setSelectedImage(null);
      }
    }
  };

  const handleSubmit = async () => {
    await blogStore.createBlog();
    toast.success(blogStore.state.message || "Blog created successfully!", {
      hideProgressBar: true,
      style: {
        background: "linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)",
        color: "#9a3412",
        fontWeight: "700",
        fontSize: "14px",
        borderRadius: "16px",
        border: "1px solid #ffedd5",
        boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.15)",
        padding: "16px"
      }
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    blogStore.state.setImage(file);
  };

  const removeImage = () => {
    blogStore.state.setImage(undefined);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    blogStore.state.setImage(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1b4b]/40 backdrop-blur-sm p-4 sm:p-6">
      {blogStore.state.loading && <LoaderIcon />}
      <div className="w-full bg-white shadow-2xl rounded-3xl max-w-4xl max-h-[95vh] flex flex-col overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="flex-1 overflow-y-auto p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#1e1b4b] tracking-tight">
              Create New Blog
            </h2>
            <p className="text-[#818cf8] mt-1 font-medium">
              Share your ideas with the world
            </p>
          </div>

          {/* Top Section: Image & Title */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 mb-8">
            {/* Image Upload */}
            <div>
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#e0e7ff] h-[140px] group">
                  <img
                    src={preview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={removeImage}
                      className="bg-white text-red-500 text-sm font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed h-[140px] cursor-pointer transition-all ${
                    dragging
                      ? "border-[#818cf8] bg-[#e0e7ff]/50"
                      : "border-[#c7d2fe] bg-[#f8fafc] hover:bg-[#f1f5f9]"
                  }`}
                >
                  <ImageIcon size={32} className="text-[#818cf8] mb-3" strokeWidth={1.5} />
                  <span className="font-bold text-[#1e1b4b] text-sm">Add Cover Image</span>
                  <span className="text-xs text-[#818cf8] mt-1 font-medium">JPG, PNG up to 5MB</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Title */}
            <div className="flex flex-col justify-center">
              <label className="mb-3 block text-lg font-bold text-[#1e1b4b]">
                Blog Title
              </label>
              <input
                className="w-full border border-[#e0e7ff] rounded-xl px-5 py-4 text-[#1e1b4b] font-medium placeholder-[#a5b4fc] focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50 focus:border-[#818cf8] transition-all"
                placeholder="Enter an engaging title..."
                value={blogStore.state.title}
                onChange={(e) =>
                  blogStore.state.setField("title", e.target.value)
                }
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col">
            <label className="mb-3 block text-lg font-bold text-[#1e1b4b]">
              Content
            </label>
            <div className="relative border border-[#e0e7ff] rounded-xl overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[#818cf8]/50 focus-within:border-[#818cf8] transition-all">
              {/* Toolbar Mockup */}
              <div className="bg-[#f8fafc] border-b border-[#e0e7ff] px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.preventDefault(); setShowHeadingMenu(!showHeadingMenu); }} 
                      className="flex items-center gap-1 text-[#64748b] hover:text-[#1e1b4b] font-medium text-sm px-2 py-1 rounded hover:bg-[#e2e8f0] transition-colors"
                    >
                      Normal <ChevronDown size={16} />
                    </button>
                    {showHeadingMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e7ff] rounded-lg shadow-lg py-1 z-50 w-32">
                        <button onMouseDown={(e) => { handleFormat(e, 'formatBlock', 'P'); setShowHeadingMenu(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-[#f8fafc]">Normal</button>
                        <button onMouseDown={(e) => { handleFormat(e, 'formatBlock', 'H1'); setShowHeadingMenu(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold hover:bg-[#f8fafc]">Heading 1</button>
                        <button onMouseDown={(e) => { handleFormat(e, 'formatBlock', 'H2'); setShowHeadingMenu(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold hover:bg-[#f8fafc]">Heading 2</button>
                      </div>
                    )}
                  </div>
                  
                  <div className="hidden sm:block w-px h-5 bg-[#cbd5e1]"></div>
                  
                  <div className="flex items-center gap-1">
                    <button onMouseDown={(e) => handleFormat(e, 'bold')} className="p-1.5 text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><Bold size={18} /></button>
                    <button onMouseDown={(e) => handleFormat(e, 'italic')} className="p-1.5 text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><Italic size={18} /></button>
                    <button onMouseDown={(e) => handleFormat(e, 'underline')} className="p-1.5 text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><Underline size={18} /></button>
                    <button onMouseDown={(e) => handleFormat(e, 'strikeThrough')} className="p-1.5 text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><Strikethrough size={18} /></button>
                  </div>

                  <div className="w-px h-5 bg-[#cbd5e1]"></div>

                  <div className="flex items-center gap-1">
                    <button onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} className="p-1.5 text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><List size={18} /></button>
                    <button onMouseDown={(e) => handleFormat(e, 'insertOrderedList')} className="p-1.5 text-[#64748b] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><ListOrdered size={18} /></button>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-auto sm:ml-4">
                  <button onMouseDown={(e) => handleFormat(e, 'undo')} className="p-1.5 text-[#94a3b8] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><Undo size={18} /></button>
                  <button onMouseDown={(e) => handleFormat(e, 'redo')} className="p-1.5 text-[#94a3b8] hover:text-[#1e1b4b] hover:bg-[#e2e8f0] rounded transition-colors"><Redo size={18} /></button>
                </div>
              </div>
              <div
                ref={contentRef}
                contentEditable
                onInput={handleInput}
                onClick={handleEditorClick}
                className="w-full p-5 text-[#1e1b4b] font-medium focus:outline-none min-h-[200px] overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-[#a5b4fc] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#818cf8] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:mb-2 [&_a]:text-[#818cf8] [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 [&_img]:cursor-pointer [&_img]:transition-all"
                data-placeholder="Start writing your blog post here..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-8 py-6 border-t border-[#e0e7ff] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#64748b] text-sm font-medium">
            <Lightbulb size={20} className="text-[#818cf8]" />
            <p>Tip: Write clear, engaging content to captivate your readers.</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-[#e0e7ff] text-[#64748b] font-bold hover:bg-[#f8fafc] hover:text-[#1e1b4b] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20"
            >
              Create Blog
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewBlog;
