import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blogpost - admin</title>
        <meta name="description" content="The admin page to create posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
