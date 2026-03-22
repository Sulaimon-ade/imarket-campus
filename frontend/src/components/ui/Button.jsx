const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) => {
  const base = "w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white",
    ghost: "text-primary bg-transparent hover:bg-purple-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button