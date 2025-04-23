import Content from "@til/README.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilReadme";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/README')({ component });
