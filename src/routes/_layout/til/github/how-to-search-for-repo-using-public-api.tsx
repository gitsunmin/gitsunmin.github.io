import Content from "@til/github/how-to-search-for-repo-using-public-api.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilContents";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/github/how-to-search-for-repo-using-public-api')({ component });
