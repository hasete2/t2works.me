import Link from 'next/link'
import tag_list from './../../contents/tag_list.json';

interface Tags {
    tag: string;
}

async function getData() {

    let tags: Tags[] = []
    for (const t of Object.keys(tag_list)) {
        tags.push({
            tag: t
        })
    }

    return tags
}
export default async function TagCloud() {
    const data: Tags[] = await getData()

    return (
        <div>
            <h2>tags</h2>
            <ul className="tag-cloud">
                {data?.map((d) => (
                    <li key={d.tag}>
                        <Link href={`/tag/${d.tag}`}>{d.tag}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}