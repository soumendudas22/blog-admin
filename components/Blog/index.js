import Image from "next/image";
import BlogText from "./Element/Text";
import BlogHeading4 from "./Element/Heading4";
import BlogQuote from "./Element/Quote";
import BlogNote from "./Element/Note";

const formatData = (data) => {
  const res = data.blog_content.map(content => {
    return {
      id: content.contents.id,
      type: content.contents.elements.type,
      value: content.contents.value
    }
  })

  return res || [];
}

const getTags = (blog) => {
  return blog.blog_tag.map(tag => tag.tags);
}

const  getRandomColor = () => {
  const color = ['rgb(13, 76, 131)', 'rgb(68, 13, 131)', 'rgb(131, 13, 125)', 'rgb(131, 13, 72)', 'rgb(13, 104, 131)', 'rgb(13, 131, 121)']
  return color[Math.floor(Math.random()*color.length)];
}

export default function Blog({ data }) {
  const date = new Date(data.created_at).toString();
  const contents = formatData(data);
  const tags = getTags(data);
  const hightlightColor = getRandomColor();
  console.log(contents)
  return (
    <div className="blog-container">
      <div className="blog-title">{data.title}</div>
      <div className="blog-creation-time">{date}</div>
      <div className="blog-profile">
        <div className="blog-profile-img">
          <Image src="/profile.png" alt="The image is of admin" width={50} height={50} quality={70} />
        </div>
        <div className="blog-profile-name">SOUMENDU DAS</div>
      </div>
      {tags && tags.length !== 0 && (
        <div className="blog-tags">
          { tags.map(tag=>(<div key={tag.id} className="blog-tag-name" style={{
            backgroundColor: `${getRandomColor()}`
          }}>#{tag.name}</div>)) }
        </div>
      )}

      {/* BLOG CONTENTS */}
      {
        contents && contents.length!==0 && contents.map((content) => (
          <div className="blog-content-wrapper" key={content.id}>
            { content.type === 'TEXT' && (<BlogText text={content.value}/>) }
            { content.type === 'HEADING_TYPE_4' && (<BlogHeading4 text={content.value}/>) }
            { content.type === 'QUOTE' && (<BlogQuote text={content.value}/>) }
            { content.type === 'NOTE' && (<BlogNote text={content.value} color={hightlightColor} />) }
          </div>
        ))
      }
    </div>
  )
}