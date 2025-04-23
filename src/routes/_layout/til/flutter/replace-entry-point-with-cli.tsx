import Content from "@til/flutter/replace-entry-point-with-cli.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilContents";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/flutter/replace-entry-point-with-cli')({ component });
