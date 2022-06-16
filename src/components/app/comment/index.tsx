import React from 'react';
import { Disqus } from 'gatsby-plugin-disqus';

interface CommentProps {
  siteUrl: string;
  pathName: string;
  postId: string;
  postTitle: string;
}

const Comment: React.FC<CommentProps> = ({ pathName, postId, postTitle, siteUrl }) => {
  let disqusConfig = {
    url: `${siteUrl}${pathName}`,
    identifier: postId,
    title: postTitle,
  };
  return (
    <>
      <Disqus config={disqusConfig} />
    </>
  );
};

export default Comment;
