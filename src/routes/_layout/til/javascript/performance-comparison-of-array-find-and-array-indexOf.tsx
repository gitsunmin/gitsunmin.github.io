import Content from "@til/javascript/performance-comparison-of-array-find-and-array-indexOf.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilContents";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/javascript/performance-comparison-of-array-find-and-array-indexOf')({ component });
