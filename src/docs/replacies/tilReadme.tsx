import { Link } from '@tanstack/react-router';
import type { MDXComponents } from 'mdx/types';
import { match, P } from 'ts-pattern';

const TilReadmeReplacies: MDXComponents = {
  a: (props) =>
    match(props.href)
      .with(P.string.startsWith('/'), (href) => (
        <Link
          {...props}
          href={'/til' + href.replace('.mdx', '').replace(/\/index$/, '')}
          to={'/'}
          className="text-blue-400"
        />
      ))
      .otherwise(() => <a className="text-blue-400" {...props} />)
};

export default TilReadmeReplacies;
