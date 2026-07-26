'use client';

import { usePathname } from "next/navigation";

interface TagData {
  tag: string;
  posts: string[];
}

interface TagClientProps {
  tagData: TagData;
}

export default function TagClient({ tagData }: TagClientProps) {
  const pathname = usePathname();
  
  return (
    <div>
      <h1>Tag: {tagData.tag}</h1>
      <p>Current pathname: {pathname}</p>
      <ul>
        {tagData.posts.map((post, index) => (
          <li key={index}>{post}</li>
        ))}
      </ul>
    </div>
  );
}