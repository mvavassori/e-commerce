export default function Loading() {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-75 z-50">
            <div
                className="border-8 border-gray-200 border-t-gray-400 rounded-full w-20 h-20 animate-spin"
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
