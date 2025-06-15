import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function generateSiteMap(posts, tools) {
  const baseUrl = 'https://proteiniq.io';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/tools', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
  ];

  // Combine all URLs
  const allUrls = [
    // Static pages
    ...staticPages.map((page) => ({
      loc: `${baseUrl}${page.url}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    // Tool pages
    ...tools.map((tool) => ({
      loc: `${baseUrl}${tool.url}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    // Blog posts
    ...posts.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.publishedDate || currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

function SiteMap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Get blog posts
    const postsDirectory = path.join(process.cwd(), 'content/blog');
    let posts = [];

    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);
      posts = fileNames
        .filter((name) => name.endsWith('.mdx'))
        .map((fileName) => {
          const slug = fileName.replace(/\.mdx$/, '');
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);

          return {
            slug,
            publishedDate: data.publishedDate,
            ...data,
          };
        })
        .filter((post) => post.slug);
    }

    // Get tools by scanning the tools directory
    const toolsDirectory = path.join(process.cwd(), 'pages/tools');
    let tools = [];

    if (fs.existsSync(toolsDirectory)) {
      const toolFiles = fs.readdirSync(toolsDirectory);
      tools = toolFiles
        .filter(
          (name) =>
            name !== 'index.js' &&
            name !== 'index.tsx' &&
            (name.endsWith('.js') || name.endsWith('.tsx'))
        )
        .map((fileName) => {
          const toolName = fileName.replace(/\.(js|tsx)$/, '');
          return {
            url: `/tools/${toolName}`,
          };
        });
    }

    // Generate the XML sitemap
    const sitemap = generateSiteMap(posts, tools);

    // Set proper headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate'
    );

    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();

    return {
      props: {},
    };
  }
}

export default SiteMap;
