import { supabase } from '../../util/supabase_client'
import Head from 'next/head'
import BlogComponent from "./../../components/Blog";

const Blog = ({ data }) => {
  return (<>
    <Head>
      <title>{data?.title || "BLOGPOST"}</title>
    </Head>
    <BlogComponent data={data} />
  </>)
}

export async function getStaticPaths() {
  let { data, error } = await supabase
    .from('blogs')
    .select('*, blog_content(*, contents(*, elements(*))), blog_tag(*, tags(*))');

  return {
    paths: data.map(blog=>{
      return { params: { pageId: `${blog.id}` } };
    }),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  let { data, error } = await supabase
    .from('blogs')
    .select('*, blog_content(*, contents(*, elements(*))), blog_tag(*, tags(*))')
    .eq('id', params.pageId);

  if (error) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: { 
      data: data[0]
    }, // will be passed to the page component as props
    revalidate: 10
  }
}

export default Blog