const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-gray-400">{text}</p>
  </div>
)

export default LoadingSpinner