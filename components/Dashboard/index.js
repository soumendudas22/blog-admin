import Card from "./Card";

export default function Dashboard({ data }) {
  return (
    <div className="dashboard-wrapper">
      { data.map(blog=>(<Card key={blog.id} blog={blog}/>)) }
    </div>
  )
}