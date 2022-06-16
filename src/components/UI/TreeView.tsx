import React from 'react';
import TreeNode from '@components/UI/TreeNode';

interface TreeViewProps {
  nodes: Menu[];
}

const TreeView: React.FC<TreeViewProps> = ({ nodes }) => {
  return (
    <>
      {nodes.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </>
  );
};

export default TreeView;
