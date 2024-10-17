import type { Site, SocialObjects } from './types'

export const SITE: Site = {
  website: 'https://blog.rdias66.codes/',
  author: 'Rodrigo Dias de Almeida',
  profile: 'https://rdias66.codes/',
  desc: 'Blog for Dev related tutorials',
  title: 'rdias Codes ',
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000,
}

export const LOCALES = {
  en: {
    lang: 'en',
    langTag: ['en-US'],
  },
  pt: {
    lang: 'pt',
    langTag: ['pt-BR'],
  },
} as const

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
}

export const SOCIALS: SocialObjects = [
  {
    name: 'Github',
    href: 'https://github.com/rdias66',
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: 'Instagram',
    href: 'https://github.com/satnaing/astro-paper',
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: 'LinkedIn',
    href: 'https://github.com/satnaing/astro-paper',
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: 'Mail',
    href: 'mailto:yourmail@gmail.com',
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: 'Twitter',
    href: 'https://github.com/satnaing/astro-paper',
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
]
