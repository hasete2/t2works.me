import TagCloud from "./components/tagCloud"
import AboutMe from "./components/aboutMe"

import Link from 'next/link'
import contents_list from './../contents/contents_list.json';

interface Content {
    slug: string;
    title: string;
    html: string,
    tags: string[];
    posted_at: string;
}


export default async function Page() {

    let items = Array();
    contents_list.sort((a, b) => b.posted_at.localeCompare(a.posted_at)).slice(0, 5);
    for (const c of contents_list) {
        items.push(
            <article key={c.slug}>
                <h1><Link href={`/e/${c.slug}`}>{c.title}</Link></h1>
                <p>{c.summary}</p>
            </article>
        );
    }
    return (
        <main>
            <div className="content">
                {items}
            </div>
            <nav>
                <TagCloud></TagCloud>
                <AboutMe></AboutMe>
            </nav>
        </main>
    )
}