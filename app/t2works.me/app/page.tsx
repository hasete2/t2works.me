import TagCloud from "./components/tagCloud"
import AboutMe from "./components/aboutMe"

export default async function Page({ params }: { params: { slug: string } }) {

    // const data: Content = await getData(params.slug)
    return (
        <main>
            <div className="content">
            <article>
                <h1><a href="./contents.html">メインコンテンツ</a></h1>
                <p>ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。ここにメインコンテンツを記述します。</p>
            </article>
                {/* <div className="meta-data">Posted: {data.posted_at} | Tags: {data.tags.join(', ')}</div>
                <article>
                    <li>{data.html}</li>
                </article> */}
            </div>
            <nav>
                <TagCloud></TagCloud>
                <AboutMe></AboutMe>
            </nav>
        </main>
    )
}