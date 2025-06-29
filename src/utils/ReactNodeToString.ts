import { isValidElement, type ReactNode } from 'react';
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
            return Array.isArray(node.props.children) ? node.props.children.map(reactToText).join('') : reactToText(node.props.children);
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

            return [...headings, {
                level: Number.parseInt(node.type.slice(1), 10),
                id: `${node.type}-${node.props.children}`,
                text: node.props.children
            }];
        })
        .with({
            node: { props: { children: P.nonNullable } }
        }, ({ node }) => {
            return Array.isArray(node.props.children) ? [...headings, ...node.props.children.map(extractHeadings)] : [...headings, ...extractHeadings(node.props.children)];
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