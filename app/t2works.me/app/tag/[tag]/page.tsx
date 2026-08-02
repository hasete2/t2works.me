import Link from 'next/link'
import TagCloud from "./../../components/tagCloud"
import AboutMe from "./../../components/aboutMe"
import tag_list from './../../../contents/tag_list.json';

interface Contents {
  slug: string;
  title: string;
  tags: string[];
  posted_at: string;
  summary: string;
}

interface Tag {
  [tag: string]: Contents[];
}

async function getTags() {

    let tags: string[] = [];
    for (const t of Object.keys(tag_list)) {
        tags.push(t)
    }
  return tags;
}

export async function generateStaticParams() {
  const tags: string[] = await getTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

async function getData(tag: string) {
  const tags = tag_list as unknown as Tag;
  const contents: Contents[] = tags[tag];
  contents.sort((a, b) => b.posted_at.localeCompare(a.posted_at))
  return contents;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params
    return {
        title: `Tag: ${tag} - t2works.me`,
        openGraph: {
            title: `Tag: ${tag} - t2works.me`,
            siteName: "t2works.me",
        },
        twitter: {
            title: `Tag: ${tag} - t2works.me`,
        }
    }
}

// ページコンポーネント
export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const data: Contents[] = await getData(tag);
  return (
    <main>
      <div className="content">
        <div>tag: {tag}</div>
        {data?.map((d) => (
          <article key={d.slug}>
            <h1><Link href={`/e/${d.slug}`}>{d.title}</Link></h1>
            <p>{d.summary}</p>
          </article>
        ))}
      </div>
      <nav>
        <TagCloud></TagCloud>
        <AboutMe></AboutMe>
      </nav>
    </main>
  )
}