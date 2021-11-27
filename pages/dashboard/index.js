import { supabase } from "../../util/supabase_client";
import Dashboard from '../../components/Dashboard';

export default function DashboardPage({ data }) {
  return (
    <>
      <Dashboard data={data}/>
    </>
  )
}

export async function getStaticProps() {
  let { data, error } = await supabase
    .from('blogs')
    .select('*, blog_content(*, contents(*, elements(*))), blog_tag(*, tags(*))');

  if (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
    revalidate: 10
  }
}