


export const Notification = ({message, setMessage}) => {

    setTimeout(() => {
        setMessage("")
    }, 3000)

    return (
        <div className="fixed bottom-0 right-0 z-50 mr-2 p-2">
            <div className="flex items-center bg-emerald-400 border-l-4 border-emerald-700 py-1 px-2 shadow-md mb-2">
                <div className="text-green-500 rounded-full bg-white mr-3">
                    <svg width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4 13h-8v-2h2V9h2v6h2v2z"/>
                    </svg>
                </div>
                <div className="text-white max-w-xs text-sm">
                    {message}
                </div>
            </div>
        </div>
    )
}