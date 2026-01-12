import { Suspense } from 'react';

const Content = () => {
    return <main>
        <h1>Blog Page</h1>
    </main>
};

export const BlogPage = () => {
    return (
        <Suspense>
            <Content />
        </Suspense>
    );
};
