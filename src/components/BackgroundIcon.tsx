const BackgroundIcon = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Small Floating Book - Top Left */}
            <div className="absolute top-[5%] left-[5%] w-32 h-32 text-orange-200 animate-blob filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform -rotate-12"
                >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>

            {/* --- Floating Mathematical Compass Icon --- */}
            <div className="absolute top-[15%] left-[25%] w-32 h-32 text-rose-200 animate-blob animation-delay-5000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform rotate-12"
                >
                    {/* Modern Compass Geometry Tool SVG */}
                    <path d="M12 2a1 1 0 011 1v1.1c1.8.3 3.3 1.5 4.1 3.1l1.6 3.2a1 1 0 01-1.8.9L15.3 8.1c-.6-1.1-1.7-1.9-3-2.1V11a3 3 0 11-1 0V6c-1.3.2-2.4 1-3 2.1l-1.6 3.2a1 1 0 01-1.8-.9l1.6-3.2C6.7 5.6 8.2 4.4 10 4.1V3a1 1 0 011-1zm0 10a1 1 0 100 2 1 1 0 000-2zM6 21v-1l1-5-1.5-.3a.5.5 0 01-.1-.9l1.4-.7 1.4.7a.5.5 0 01-.1.9L7 14.7l-1 5v1h-.5a.5.5 0 01-.5-.5zM18 21v-1l-1-5 1.5-.3a.5.5 0 01.1-.9l1.4-.7 1.4.7a.5.5 0 01.1.9L19.5 14.7l1 5v1h-.5a.5.5 0 01-.5-.5z" />
                </svg>
            </div>

            {/* Modern Computer/Monitor SVG */}
            <div className="absolute top-[40%] left-[15%] w-32 h-32 text-indigo-200 animate-blob animation-delay-2000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform rotate-12"
                >
                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                </svg>
            </div>

            {/* Medium Ruler - Top Right */}
            <div className="absolute top-[15%] right-[2%] w-40 h-40 text-rose-200 animate-blob animation-delay-2000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform rotate-[110deg]"
                >
                    <path d="M7 2v20h10V2H7zm8 18H9V4h6v16zM11 6h2v2h-2V6zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                </svg>
            </div>

            {/* Mathematical Compass - Bottom Left */}
            <div className="absolute bottom-[10%] left-[8%] w-36 h-36 text-amber-200 animate-blob animation-delay-4000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform rotate-12"
                >
                    <path d="M12 2a1 1 0 011 1v2.076c2.834.477 5 2.948 5 5.924v.5c0 .24-.086.473-.243.657L12 19.35l-5.757-7.193A.996.996 0 016 11.5v-.5c0-2.976 2.166-5.447 5-5.924V3a1 1 0 011-1zm0 6a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
            </div>

            {/* --- Floating Document Icon --- */}
            <div className="absolute top-[10%] right-[20%] w-32 h-32 text-amber-200 animate-blob animation-delay-3000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform rotate-6"
                >
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
            </div>

            {/* Small Pencil - Bottom Right */}
            <div className="absolute bottom-[20%] right-[20%] w-28 h-28 text-orange-200 animate-blob animation-delay-3000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full transform -rotate-45"
                >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
            </div>

            {/* Graduation Cap - Center Right (Subtle) */}
            <div className="absolute top-1/2 right-[5%] w-32 h-32 text-rose-100 animate-blob animation-delay-5000 filter blur-[3px]">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                >
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
            </div>
        </div>
    )
}

export default BackgroundIcon;