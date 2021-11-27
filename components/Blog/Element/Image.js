
export default function Image({ src }) {
  return (<div className="blog-content-image">
    <Image src={ src } alt="The image is of admin" width={100} height={100} quality={70} />
  </div>);
}