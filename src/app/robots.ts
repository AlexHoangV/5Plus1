import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login/', '/request-order/'],
    },
    sitemap: 'https://fiveplusone.com/sitemap.xml',
  }
}
