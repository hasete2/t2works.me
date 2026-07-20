import Head from 'next/head'

export default function HeadTag({ title = "t2works.me", description = "t2works.me is My Blog Site." }) {

  return (
    <Head>
      <title>{title}</title>
      <meta property="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  )
}