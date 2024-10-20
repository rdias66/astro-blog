import { SITE } from '@config'
import type { CollectionEntry } from 'astro:content'

export const getSortedPosts = (posts: CollectionEntry<'blog'>[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000,
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000,
        ),
    )
}

export const postFilter = ({ data }: CollectionEntry<'blog'>) => {
  const isPublishTimePassed =
    Date.now() > new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed)
}
