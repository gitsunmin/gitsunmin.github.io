import Content from "@til/package/automatically-sink-the-node-version-using-nvmrc.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilContents";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/package/automatically-sink-the-node-version-using-nvmrc')({ component });
