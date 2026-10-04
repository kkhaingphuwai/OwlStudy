import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { observer } from "mobx-react-lite";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { meetingStore } from "../../store/meeting";
import { MeetingStatus } from "../../../service/meeting/meetingApi";
import { toast, ToastContainer } from "react-toastify";
import LoaderIcon from "../../common/LoaderIcon";
import PermissionGate from "../../auth/PermissionGate";
import { useNavigate } from "react-router-dom";

const Header = observer(
    ({
        name,
        onBlogClick,
        onMenuClick
    }: {
        onMenuClick: () => void;
        name: string;
        onBlogClick?: () => void;
    }) => {
        const { notificationStore, userStore } = useStore();

        const [showNotif, setShowNotif] = useState(false);
        const [declineId, setDeclineId] = useState<number | null>(null);
        const [reasons, setReasons] = useState<Record<number, string>>({});
        const [errors, setErrors] = useState<Record<number, boolean>>({});

        const navigate = useNavigate();

        useEffect(() => {
            const userInfo = sessionStorage.getItem("user");
            if (!userInfo) return;

            const user = JSON.parse(userInfo);
            const token = sessionStorage.getItem("accessToken");
            userStore.state.setFirstName(user.firstName);
            userStore.state.setLastName(user.lastName);
            userStore.state.setEmail(user.email);

            if (!user.previousLoginTime) {
                userStore.state.setLastLoginTime(
                    "Welcome to OwlStudy! This is your first login.",
                );
            } else {
                userStore.state.setLastLoginTime(
                    "Your last login was on " + user.lastLoginTime,
                );
            }
            notificationStore.getAllNotification();

            const socket = new SockJS("http://localhost:8080/ws-stomp");
            const stompClient = new Client({
                webSocketFactory: () => socket,
                debug: (str) => console.log("STOMP: " + str),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                onConnect: () => {
                    console.log("Connected!");
                    stompClient.subscribe("/user/queue/notifications", (message) => {
                        console.log("NOTIFICATION RECEIVED:", message.body);
                        const newNotification = JSON.parse(message.body);
                        notificationStore.state.addNotification(newNotification);
                    });
                },
                onStompError: (frame) => {
                    console.error("Broker reported error: " + frame.headers["message"]);
                },
            });

            stompClient.activate();

            return () => {
                if (stompClient.active) stompClient.deactivate();
            };
        }, []);

        const handleMeetingDecline = async (id: number) => {
            if (!reasons[id]?.trim()) {
                setErrors((prev) => ({ ...prev, [id]: true }));
                return;
            }

            try {
                await meetingStore.updateMeetingStatus(id, {
                    meetingStatus: MeetingStatus.DECLINED,
                    reason: reasons[id],
                });
                toast.success("Meeting declined!", {
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
                setDeclineId(null);
                setReasons((prev) => ({ ...prev, [id]: "" }));
                setErrors((prev) => ({ ...prev, [id]: false }));
                notificationStore.handleNotification(id);
            } catch {
                toast.error("Failed to decline meeting");
            }
        };

        const handleMeetingConfirm = (id: number) => {
            meetingStore.updateMeetingStatus(id, {
                meetingStatus: MeetingStatus.CONFIRMED,
            });
            toast.success("Meeting confirmed!", {
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
            notificationStore.handleNotification(id);
        };

        return (
            <div>
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 flex justify-between items-center sticky top-0 z-20">
                    <button
                        className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg"
                        onClick={onMenuClick} // This state is passed to SideBar as 'isOpen'
                    >
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-4">
                        <ToastContainer />
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                    Portal
                                </h2>
                            </div>
                            <span className="text-lg font-extrabold text-slate-800 tracking-tight">
                                {name}
                            </span>
                        </div>
                    </div>
                    <div className="hidden lg:inline-flex items-center gap-2.5 px-4 py-2 group hover:border-orange-200 transition-all duration-300">
                        {/* Animated Pulse Icon */}
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                                Security Activity
                            </span>
                            <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                                {userStore.state.lastLoginTime}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <PermissionGate permissions={["CREATE_BLOG"]}>
                            <button
                                onClick={() => navigate("/blogs")}
                                className="group cursor-pointer relative p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200 active:scale-95"
                            >
                                <svg
                                    className="w-6 h-6 transition-transform group-hover:rotate-[15deg]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                    <path d="M18 14h-8" />
                                    <path d="M15 18h-5" />
                                    <path d="M10 6h8v4h-8z" />
                                </svg>
                            </button>
                            <button
                                onClick={onBlogClick}
                                className="group cursor-pointer relative p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200 active:scale-95"
                            >
                                {/* The Plus Icon - Made thicker and cleaner */}
                                <svg
                                    className="w-6 h-6 transition-transform group-hover:rotate-[15deg]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </button>
                        </PermissionGate>

                        <PermissionGate permissions={["CREATE_STUDENT"]}>
                            <button
                                onClick={() => navigate("/studentRegistration")}
                                className="group cursor-pointer relative p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200 active:scale-95"
                            >
                                <svg
                                    className="w-6 h-6 transition-transform group-hover:rotate-[15deg]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {/* Graduation Cap / Mortarboard */}
                                    <path d="M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />

                                    {/* Plus Sign for Registration */}
                                    <line x1="19" y1="16" x2="19" y2="22" />
                                    <line x1="16" y1="19" x2="22" y2="19" />
                                </svg>
                            </button>
                        </PermissionGate>

                        {/* --- Notifications Section --- */}
                        <PermissionGate permissions={["VIEW_NOTIFICATION"]}>
                            <div
                                className="relative"
                            >
                                <button
                                    onClick={() => setShowNotif(!showNotif)}
                                    className="group cursor-pointer relative p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200 active:scale-95"
                                >
                                    {notificationStore.state.notifications.length > 0 && (
                                        <div className="absolute top-1.5 right-1.5 z-10">
                                            <span className="relative flex h-5 w-5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-orange-600 text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                                                    {notificationStore.state.notifications.length > 9
                                                        ? "9+"
                                                        : notificationStore.state.notifications.length}
                                                </span>
                                            </span>
                                        </div>
                                    )}

                                    <svg
                                        className="w-6 h-6 transition-transform group-hover:rotate-[15deg]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </button>

                                {showNotif && (
                                    <>
                                        <div className="absolute h-4 w-full top-full"></div>
                                        <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                                <h3 className="font-semibold text-slate-800">
                                                    Notification
                                                </h3>
                                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                                    {notificationStore.state.notifications.length} New
                                                </span>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notificationStore.state.notifications.length === 0 ? (
                                                    <div className="p-8 text-center">
                                                        <p className="text-slate-400 text-sm">All caught up!</p>
                                                    </div>
                                                ) : (
                                                    notificationStore.state.notifications.map((notif) => (
                                                        <div
                                                            key={notif.id}
                                                            className="p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                                                        >
                                                            {/* Notification content */}
                                                            <div className="flex flex-col gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                                <span className="text-sm font-semibold text-slate-900 leading-snug">
                                                                    {notif.detailMessage}
                                                                </span>

                                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-600">
                                                                    {/* Show scheduled time only if exists (mainly for meetings) */}
                                                                    {notif.scheduledAt && (
                                                                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                                                                            <svg
                                                                                className="w-3.5 h-3.5"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                />
                                                                            </svg>
                                                                            {notif.scheduledAt} • {notif.startTime}
                                                                        </span>
                                                                    )}
                                                                    <span className="flex items-center gap-1 text-slate-500">
                                                                        <span className="font-medium text-slate-400">From:</span>{" "}
                                                                        {notif.senderName}
                                                                        <span className="text-slate-300 mx-1">|</span>
                                                                        <span className="italic">{notif.senderEmail}</span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Accept/Decline buttons — only for MEETING type */}
                                                            {notif.type === "MEETING" && (
                                                                <>
                                                                    <div className="flex gap-2 mt-3">
                                                                        <button
                                                                            onClick={() => handleMeetingConfirm(notif.id)}
                                                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm shadow-orange-200"
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setDeclineId(notif.id)}
                                                                            className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold py-2 rounded-lg transition-colors"
                                                                        >
                                                                            Decline
                                                                        </button>
                                                                    </div>

                                                                    {declineId === notif.id && (
                                                                        <div
                                                                            className={`mt-3 p-2 rounded-lg animate-in slide-in-from-top-2 ${errors[notif.id]
                                                                                ? "border-rose-500 bg-rose-50 ring-2 ring-rose-100"
                                                                                : "border-gray-200 bg-gray-50"
                                                                                }`}
                                                                        >
                                                                            <textarea
                                                                                className={`w-full text-xs p-2 border rounded-md focus:ring-1 focus:ring-orange-500 outline-none resize-none ${errors[notif.id] ? "placeholder-rose-300" : "placeholder-gray-300"
                                                                                    }`}
                                                                                placeholder={errors[notif.id] ? "Reason is required" : "Provide a reason"}
                                                                                rows={2}
                                                                                value={reasons[notif.id] || ""}
                                                                                onChange={(e) => {
                                                                                    setErrors((prev) => ({ ...prev, [notif.id]: false }));
                                                                                    setReasons((prev) => ({ ...prev, [notif.id]: e.target.value }));
                                                                                }}
                                                                            />
                                                                            <div className="flex justify-end gap-2 mt-1">
                                                                                <button
                                                                                    onClick={() => setDeclineId(null)}
                                                                                    className="text-[10px] text-slate-400 font-bold"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleMeetingDecline(notif.id)}
                                                                                    className="text-[10px] text-rose-500 font-bold"
                                                                                >
                                                                                    Confirm
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                        </div>
                                    </>
                                )}
                            </div>
                        </PermissionGate>


                        {/* --- User Profile --- */}
                        <div className="group flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <p className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                                    {userStore.state.firstName} {userStore.state.lastName}
                                </p>
                                <p className="text-[11px] font-medium text-slate-400">
                                    {userStore.state.email}
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-700 transition-transform group-hover:scale-105">
                                    {userStore.state.firstName?.charAt(0)}
                                    {userStore.state.lastName?.charAt(0)}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                        </div>
                    </div>
                </header>
                {meetingStore.state.loading && <LoaderIcon />}
            </div>
        );
    },
);

export default Header;
