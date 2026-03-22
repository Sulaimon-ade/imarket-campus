const Badge = ({ label, color = "#6C63FF" }) => (
  <span
    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
    style={{ backgroundColor: color }}
  >
    {label}
  </span>
)

export default Badge