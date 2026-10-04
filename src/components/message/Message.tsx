import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, Plus, ArrowLeft } from "lucide-react";
import type { Student } from "../store/student/state";
import { formatDate } from "../store/comment/function";
import { useLocation, useParams } from "react-router-dom";

const Message = observer(() => {
  const { messageStore } = useStore();
  const [message, setMessage] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);

  const stompClient = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedPartnerRef = useRef<number | null>(null);

  const sessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const currentUserEmail = sessionUser.email;

  const { partnerId } = useParams();

  const location = useLocation();
  const navState = location.state as any;

  useEffect(() => {
    if (navState?.partnerId) {
      setSelectedPartnerId(navState.partnerId);
      setPartnerEmail(navState.partnerEmail);
      messageStore.getChatHistory(sessionUser.id, navState.partnerId);
    }
  }, []);

  useEffect(() => {
    if (!partnerId) return;

    const pid = Number(partnerId);

    const target = messageStore.state.messageContacts.find(
      (c) => c.partnerId === pid
    );

    if (target) {
      handleSelectContact(target);
    } else {
      setSelectedPartnerId(pid);
      messageStore.getChatHistory(sessionUser.id, pid);
    }
  }, [partnerId]);

  useEffect(() => {
    if (!partnerId && !selectedPartnerId && messageStore.state.messageContacts.length > 0) {
      handleSelectContact(messageStore.state.messageContacts[0]);
    }
  }, [messageStore.state.messageContacts]);

  useEffect(() => {
    selectedPartnerRef.current = selectedPartnerId;
  }, [selectedPartnerId]);

  const handleSelectContact = (contact: any) => {
    if (selectedPartnerId === contact.partnerId) return;
    setSelectedPartnerId(contact.partnerId);
    setPartnerEmail(contact.partnerEmail);
    messageStore.getChatHistory(sessionUser.id, contact.partnerId);
    messageStore.markAsRead(sessionUser.id, contact.partnerId);

    messageStore.setUnreadToZero(contact.partnerId);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messageStore.state.messages]);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const userInfo = sessionStorage.getItem("user");
    if (!userInfo) return;

    const user = JSON.parse(userInfo);

    messageStore.getChatContacts(user.id);

    const socket = new SockJS("http://localhost:8080/ws-stomp");

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },

      onConnect: () => {
        client.subscribe(`/user/queue/messages`, (payload) => {
          const msg = JSON.parse(payload.body);

          const isActiveChat = selectedPartnerRef.current === msg.senderId;
          if (isActiveChat) {
            messageStore.addMessage(msg);
          }

          const isFromMe = msg.senderEmail === currentUserEmail;

          const contactExists = messageStore.state.messageContacts.some(
            (c) => c.partnerEmail === msg.senderEmail
          );

          if (!contactExists) {
            messageStore.getChatContacts(sessionUser.id);
            return;
          }

          messageStore.updateLastMessage(msg.senderEmail, msg.content);

          if (!isFromMe) {
            const isActiveChat = selectedPartnerRef.current === msg.senderId;

            if (isActiveChat) {
              messageStore.markAsRead(sessionUser.id, msg.senderId);
              messageStore.setUnreadToZero(msg.senderId);
            } else {
              messageStore.incrementUnread(msg.senderId);
            }
          }
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      stompClient.current?.deactivate();
    };

  }, []);

  const handleSendMessage = () => {
    if (message.trim() && stompClient.current?.connected && partnerEmail) {
      const payload = {
        senderEmail: currentUserEmail,
        receiverEmail: partnerEmail,
        content: message,
        timestamp: new Date().toISOString()
      };

      messageStore.addMessage(payload);

      messageStore.updateLastMessage(partnerEmail, message);
      stompClient.current.publish({ destination: "/app/chat.send", body: JSON.stringify(payload) });
      setMessage("");
    }
  };

  const handleOnChange = (value: string) => {
    if (value.trim() === "") {
      messageStore.clearStudents();
      return;
    }
    messageStore.getAllStudents(value);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedPartnerId(student.id);
    setPartnerEmail(student.email);

    messageStore.clearStudents();
    const exists = messageStore.state.messageContacts.some((c) => c.partnerId === student.id);

    if (!exists) {
      messageStore.state.messageContacts.unshift({
        partnerId: student.id,
        partnerEmail: student.email,
        partnerName: student.fullName,
        partnerFirstName: "",
        lastMessage: "",
        partnerLastName: "",
        unreadCount: 0,
      });
    }
    messageStore.getChatHistory(sessionUser.id, student.id);
  };

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden font-sans antialiased text-slate-900">

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-[360px] bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
              <div className="h-1 w-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full mt-1" />
            </div>
            <button className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-300">
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Search Section */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 outline-none transition-all placeholder:text-slate-400"
            />

            {/* Floating Results Dropdown */}
            <AnimatePresence>
              {messageStore.state.students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden py-2"
                >
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Results</div>
                  {messageStore.state.students.map((student) => (
                    <button
                      key={student.email}
                      onClick={() => handleSelectStudent(student)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left group/item"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs">
                        {student.fullName.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-700 group-hover/item:text-orange-600 truncate">{student.fullName}</span>
                        <span className="text-[11px] text-slate-400 truncate">{student.email}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
          {messageStore.state.messageContacts.map((contact) => (
            <button
              onClick={() => handleSelectContact(contact)}
              key={contact.partnerId}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${selectedPartnerId === contact.partnerId
                ? "bg-white shadow-md ring-1 ring-slate-100 scale-[1.02]"
                : "hover:bg-slate-50 active:scale-95"
                }`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white transition-all duration-500 ${selectedPartnerId === contact.partnerId
                  ? "bg-gradient-to-br from-orange-500 to-rose-500 rotate-[10deg] shadow-lg shadow-orange-200"
                  : "bg-slate-200 group-hover:bg-slate-300"
                  }`}>
                  {contact.partnerFirstName?.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <span className={`text-[14px] font-bold truncate ${selectedPartnerId === contact.partnerId ? "text-orange-600" : "text-slate-800"}`}>
                    {contact.partnerName}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">10m</span>
                </div>
                <p className="text-xs truncate mt-1 leading-relaxed text-slate-500">
                  {contact.lastMessage || "Start a conversation..."}
                </p>
              </div>
              {selectedPartnerId === contact.partnerId && (
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* ── CHAT AREA ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
        {selectedPartnerId ? (
          <>
            <header className="h-20 px-8 bg-white border-b border-slate-200 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                  {partnerEmail ? partnerEmail.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800">{partnerEmail}</h3>
                  <div className="flex items-center gap-1.5 text-green-500">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => window.history.back()}
                  className="cursor-pointer group flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 rounded-lg transition-all duration-200 active:scale-95"
                >
                  <ArrowLeft
                    size={19}
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6">
              <AnimatePresence initial={false}>
                {messageStore.state.messages.map((m, index) => {
                  const isMe = m.senderEmail === currentUserEmail;
                  return (
                    <motion.div
                      key={m.timestamp || index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      // We use flex-col and items- alignment to handle the outside timestamp
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      {/* Message Bubble */}
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[14px] shadow-sm ${isMe
                        ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-tr-none"
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                        }`}>
                        <p className="leading-relaxed">{m.content}</p>
                      </div>

                      {/* Timestamp - Outside the div */}
                      <span className={`mt-1 px-1 text-[10px] font-medium uppercase tracking-wider text-slate-400`}>
                        {formatDate(m.timestamp)}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <footer className="p-6 bg-gradient-to-t from-white to-transparent">
              <div className="max-w-4xl mx-auto flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-2 py-2 text-sm outline-none bg-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-xl transition-all ${message.trim() ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-300"
                    }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-pulse">
            <p>Loading your conversations...</p>
          </div>
        )}
      </main>
    </div>
  );
});

export default Message;