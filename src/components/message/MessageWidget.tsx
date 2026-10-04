import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { observer } from "mobx-react-lite";

const Icon = {
    Message: ({ cls = "w-6 h-6" }) => (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Send: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    ),
    Close: ({ cls = "w-5 h-5" }) => (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    ),
    Back: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
        </svg>
    ),
    Edit: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    Dots: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    ),

    Emoji: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
    ),
    Attach: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
    ),

    Search: () => (
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
    ),
};

const MessengeWidget = observer(() => {
    const [panelOpen, setPanelOpen] = useState(false);
    const [messengerOpen] = useState(false);

    const { messageStore } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = sessionStorage.getItem("user");
        if (!userInfo) return;
        const user = JSON.parse(userInfo);
        messageStore.getChatContacts(user.id);
        // messageStore.getAllUnreadMessage(user.id);
    })

    const handleContactClick = (partnerId: number) => {
        navigate(`/message/${partnerId}`);
    };

    return (
        <>
            <div className="msg-root">
                {/* ── Slide-up contact panel ───────────────────────────────────────────── */}
                <div
                    className={`fixed bottom-24 right-6 z-[9999] w-[360px] max-w-[calc(100vw-3rem)] 
                                bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden 
                                transition-all duration-300 ease-in-out transform
                                ${panelOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}
                >
                    {/* Panel Header */}
                    <div className="p-5 text-white" style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}>
                        <h3 className="text-lg font-bold">Messages</h3>
                        <p className="text-xs opacity-90">How can we help you today?</p>
                    </div>

                    <div className="h-80 overflow-y-auto bg-gray-50 p-4">
                        {messageStore.state.messageContacts.length > 0 ? (
                            <div className="space-y-3">
                                {messageStore.state.messageContacts.map((message) => (
                                    <div
                                        onClick={() => handleContactClick(message.partnerId)}
                                        key={message.partnerId || message.partnerEmail} className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                        {/* Example Content - Replace with real message data */}
                                        <div className="w-10 h-10 rounded-full bg-orange-100 mr-3 flex items-center justify-center font-bold text-orange-600">
                                            {message.partnerFirstName?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-gray-800">{message.partnerFirstName} {message.partnerLastName}</div>
                                            <div className="text-xs text-gray-500 truncate">{message.lastMessage}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State: Only shows if there are no messages */
                            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                    {/* <Icon.Message className="w-8 h-8 text-orange-500" /> */}
                                </div>
                                <p className="text-gray-500 font-medium text-sm">No recent chats</p>
                                <button
                                    onClick={() => navigate('/message')}
                                    className="mt-4 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                                >
                                    Start a conversation
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── FAB (Floating Action Button) ────────────────────────────────────── */}
                {!messengerOpen && (
                    <div className="fixed bottom-6 right-6 z-[9998] flex items-center justify-center">
                        {/* ── Pulse Effect Layer ────────────────────────────────────────── */}
                        {messageStore.state.unReadCount > 0 && !panelOpen && (
                            <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75 animate-ping" />
                        )}
                        {/* ── Main FAB ──────────────────────────────────────────────────── */}
                        <button
                            onClick={() => setPanelOpen(v => !v)}
                            aria-label="Toggle messages"
                            className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}
                        >
                            {panelOpen ? (
                                <Icon.Close cls="w-6 h-6 text-white" />
                            ) : (
                                <Icon.Message cls="w-6 h-6 text-white" />
                            )}

                            {/* ── Unread Badge Dot ────────────────────────────────────────── */}
                            {messageStore.state.unReadCount > 0 && !panelOpen && (
                                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                                    <span className="relative inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white border-[1.5px] border-rose-500 shadow-sm">
                                        <span className="text-[10px] font-bold leading-none text-rose-600">
                                            {messageStore.state.unReadCount}
                                        </span>
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
})

export default MessengeWidget;
