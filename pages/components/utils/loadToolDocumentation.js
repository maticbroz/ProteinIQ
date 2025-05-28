import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

/**
 * Load MDX documentation for a tool
 * @param {string} toolSlug - The tool slug (e.g., 'fastq-to-fasta')
 * @returns {Promise<{mdxSource: any, frontMatter: any} | {mdxSource: null, frontMatter: null}>}
 */
export async function loadToolDocumentation(toolSlug) {
  try {
    const mdxPath = path.join(
      process.cwd(),
      'content/tools',
      `${toolSlug}.mdx`
    );

    if (fs.existsSync(mdxPath)) {
      const fileContents = fs.readFileSync(mdxPath, 'utf8');
      const { data, content } = matter(fileContents);

      const mdxSource = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      });

      return {
        mdxSource,
        frontMatter: data,
      };
    }
  } catch (error) {
    console.warn(
      `No MDX documentation found for ${toolSlug} tool:`,
      error.message
    );
  }

  return {
    mdxSource: null,
    frontMatter: null,
  };
}

/**
 * Create getStaticProps function for tools with optional documentation
 * @param {string} toolSlug - The tool slug
 * @param {object} additionalProps - Additional props to include
 * @returns {Function} getStaticProps function
 */
export function createToolStaticProps(toolSlug, additionalProps = {}) {
  return async function getStaticProps() {
    const { mdxSource, frontMatter } = await loadToolDocumentation(toolSlug);

    return {
      props: {
        mdxSource,
        frontMatter,
        ...additionalProps,
      },
    };
  };
}
