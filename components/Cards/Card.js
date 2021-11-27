export default function Card({
  text,
  children
}) {
  return(
    <div className="card-wrapper">
      <div className="card-icon">
        {children}
      </div>
      <div className="card-text">
        {text}
      </div>
    </div>
  );
}