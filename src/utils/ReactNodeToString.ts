import { isValidElement, type ReactNode, Children } from 'react';
import { match, P } from 'ts-pattern';

export interface HeadingInfo {
    level: number;
    id: string;
    text: string;
}

export function reactToText(node: ReactNode): string {

    return match({
        typeof: typeof node,
        isValidElement: isValidElement(node),
        node,
    }).with({
        node: P.union(P.nullish, P.boolean)
    }, () => {
        return '';
    })
        .with({
            node: P.union(P.string, P.number)
        }, (node) => {
            return String(node.node);
        })
        .with({
            node: { props: { children: P.nonNullable } }
        }, ({ node }) => {
            const element = node as React.ReactElement<Record<string, unknown>>;
            return Children.toArray(element.props.children as ReactNode).map(reactToText).join('');
        })
        .with({ typeof: 'object', node: { type: P.nonNullable } }, ({ node }) => {
            if (typeof node.type === 'function') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return reactToText(node.type());
            }
            return '';
        })
        .otherwise(() => {
            return '';
        })
}

export const extractHeadings = (node: ReactNode): HeadingInfo[] => {
    const headings: HeadingInfo[] = [];

    return match({
        typeof: typeof node,
        isValidElement: isValidElement(node),
        node,
    })
        .with({ typeof: 'object', node: { type: P.union('h1', 'h2', 'h3', 'h4', 'h5', 'h6') } }, ({ node }) => {

            const element = node as React.ReactElement<{ children?: ReactNode }>;
            return [...headings, {
                level: typeof element.type === 'string' ? Number.parseInt(element.type.slice(1), 10) : 0,
                id: `${element.type}-${reactToText(element.props.children)}`,
                text: reactToText(element.props.children)
            }];
        })
        .with({
            node: { props: { children: P.nonNullable } }
        }, ({ node }) => {
            return [
                ...headings,
                ...Children.toArray(node.props.children as ReactNode).flatMap(extractHeadings)
            ];
        })
        .with({ typeof: 'object', node: { type: P.nonNullable } }, ({ node }) => {
            if (typeof node.type === 'function') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return [...headings, ...extractHeadings(node.type())];
            }
            return headings;
        })
        .otherwise(() => headings).flat();
}