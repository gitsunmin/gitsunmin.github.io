import Content from "@til/software_engineering/refactoring-with-the-separation-of-oncerns-rinciple.mdx";
import { createFileRoute } from "@tanstack/react-router";
import { MDXReplacer } from "@/docs/MDXReplacer";
import Replacies from "@/docs/replacies/tilContents";

const components = MDXReplacer({ components: Replacies });

function component() {
    return <Content components={components} />;
}

export const Route = createFileRoute('/_layout/til/software_engineering/refactoring-with-the-separation-of-oncerns-rinciple')({ component });
