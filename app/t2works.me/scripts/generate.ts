import fs from "fs";
import { writeFileSync } from 'fs';
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { format } from 'date-fns';
import striptags from "striptags";


function get_files(): string[] {
    return fs.readdirSync('./contents/')
        .filter((file) => /\.md$/.test(file))
        .sort((a, b) => b.localeCompare(a));
}

async function parsePost(filePath: string) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const html = (await remark().use(remarkHtml).process(content)).toString();
    const summary = striptags(html).slice(0, 120);

    return {
        title: data.Title as string,
        posted_at: format(data.Posted_at, 'yyyy-MM-dd'),
        slug: data.Slug as string,
        tags: (data.Tags as string[]) ?? [],
        html,
        summary,
    };
}

function writeFile(path: string, content: object): boolean {
    try {
        writeFileSync(path, JSON.stringify(content));
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function main() {
    const files: string[] = get_files();
    let contents_list: object[] = [];
    let tag_list: Record<string, any> = {};
    let _path: string

    for (const f of files) {
        _path = './contents/' + f;
        let res = await parsePost(_path);

        // contents list
        contents_list.push({
            'title': res.title,
            'slug': res.slug,
            'posted_at': res.posted_at,
            'summary': res.summary,
        })

        // tag list
        for (const t of res.tags) {
            if (t in tag_list) {
                tag_list[t].push({
                    'title': res.title,
                    'slug': res.slug,
                    'posted_at': res.posted_at,
                    'summary': res.summary,
                })
            } else {
                tag_list[t] = [{
                    'title': res.title,
                    'slug': res.slug,
                    'posted_at': res.posted_at,
                    'summary': res.summary,
                }]
            }

        }

    }

    writeFile('./contents/contents_list.json', contents_list);
    writeFile('./contents/tag_list.json', tag_list);
}

main();
console.log('Done.');