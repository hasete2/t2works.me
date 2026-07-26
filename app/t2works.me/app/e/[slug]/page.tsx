import parse from "html-react-parser";

import fs from 'fs';
import TagCloud from "./../../components/tagCloud"
import AboutMe from "./../../components/aboutMe"
import contents_list from './../../../contents/contents_list.json';


async function getSlug() {

    let items: String[] = [];
    for (const c of contents_list) {
        items.push(c.slug);
    }

    return items
}

export async function generateStaticParams() {

    const slugs = await getSlug();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

interface Content {
    slug: string;
    title: string;
    html: string,
    tags: string[];
    posted_at: string;
}

async function getData(slug: string) {

    const raw = fs.readFileSync(`./contents/${slug}.json`, 'utf-8');
    const data = JSON.parse(raw);

    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const data: Content = await getData(slug)
    return {
        title: `${data.title} - t2works.me`,
        openGraph: {
            title: `${data.title} - t2works.me`,
            siteName: "t2works.me",
        },
        twitter: {
            title: `${data.title} - t2works.me`,
        }
    }
}

// ページコンポーネント
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const data: Content = await getData(slug)
    return (
        <main>
            <div className="content">
                <div className="meta-data">Posted: {data.posted_at} | Tags: {data.tags.join(', ')}</div>
                <article key={data.slug}>
                    {parse(data.html)}
                </article>
            </div>
            <nav>
                <TagCloud></TagCloud>
                <AboutMe></AboutMe>
            </nav>
        </main>
    )
}