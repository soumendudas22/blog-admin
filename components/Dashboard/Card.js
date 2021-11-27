import Image from "next/image";
import Link from "next/link";

const getThumbnails = (blog) => {
  return blog.blog_content.filter(el => el.contents.elements.type === 'THUMBNAIL').map(({ blog_id, contents }) => ({
    blog_id,
    thumbnail: contents.value
  }));
}

const getTags = (blog) => {
  return blog.blog_tag.map(tag => tag.tags);
}

const getFirstText = (blog) => {
  return blog.blog_content.find(el => el.contents.elements.type === 'TEXT')?.contents?.value || "No text was found.";
}

export default function Card({ blog }) {
  const thumbnail = getThumbnails(blog);
  const tags = getTags(blog);
  const date = new Date(blog.created_at).toString();
  const text = getFirstText(blog);

  return (
    <Link href={`/dashboard/${blog.id}`} passHref>
      <div className="dashboard-card">
        <div className="dashboard-card-thumbanail" >
          {
            thumbnail[0] && (<Image src={thumbnail[0].thumbnail} alt="The image is about the scene of sunset" width={300} height={300} quality={70} />)
          }
        </div>
        <div className="dashboard-card-content">
          <div className="dashboard-card-title"><div className="ellipsed">{blog.title}</div></div>
          <div className="dashboard-card-time">{date}</div>
          <div className="dashboard-card-tags">
            {tags.map(tag => (<div key={tag.id} className="dashboard-card-tag">{tag.name}</div>))}
          </div>
          <div className="divider"></div>
          <div className="dashboard-card-desc">{text}</div>
        </div>
      </div>
    </Link>
  );
}