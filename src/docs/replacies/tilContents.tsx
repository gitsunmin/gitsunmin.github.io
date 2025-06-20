import { Link } from '@tanstack/react-router';
import type { MDXComponents } from 'mdx/types';
import { match, P } from 'ts-pattern';

const TilContentsReplacies: MDXComponents = {
  a: (props) =>
    match(props.href)
      .with(P.string.startsWith('/'), (href) => (
        <Link {...props} href={href} to={'/'} className="text-blue-400" />
      ))
      .otherwise(() => <a className="text-blue-400" {...props} />),
  img: (props) => (
    <img
      {...props}
      alt={props.alt || 'Image'}
      className="rounded-lg shadow-md m-auto"
    />
  )
};

export default TilContentsReplacies;
