import { slugifyAll, slugifyStr } from './slugify'
import type { CollectionEntry } from 'astro:content'
import { getSortedPosts, postFilter } from './post.utils'

interface Tag {
  tag: string
  tagName: string
}

export const getUniqueTags = (posts: CollectionEntry<'blog'>[]) => {
  const tags: Tag[] = posts
    .filter(postFilter)
    .flatMap((post) => post.data.tags)
    .map((tag) => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex((tag) => tag.tag === value.tag) === index,
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag))
  return tags
}

export const getPostsByTag = (posts: CollectionEntry<'blog'>[], tag: string) =>
  getSortedPosts(
    posts.filter((post) => slugifyAll(post.data.tags).includes(tag)),
  )
