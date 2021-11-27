
export default function Note({ text, color }) {
  return (
    <div className="blog-content-note" style={{ border: `1px solid ${color}`, borderLeft: `10px solid ${color}` }}>
      { text }
    </div>
  )
}