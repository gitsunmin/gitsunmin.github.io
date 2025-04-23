import Content from "@til/javascript/the-easiest-way-to-create-uuid-in-js.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilContents";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/javascript/the-easiest-way-to-create-uuid-in-js')({ component });
