const Input = ({ label, type = "text", value, onChange, placeholder, className = "", error = "" }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-400" : "border-gray-200"} bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export default Input