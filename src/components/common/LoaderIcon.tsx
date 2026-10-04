import { HashLoader } from "react-spinners"

const LoaderIcon = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[2px]">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-center">
                <HashLoader color="#ea580c" />
                <span className="mt-4 text-[10px] font-bold tracking-[0.2em] text-orange-600 uppercase">
                    Processing...
                </span>
            </div>
        </div>
    )
}

export default LoaderIcon;