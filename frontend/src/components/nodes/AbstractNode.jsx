// AbstractNode.js
import React from 'react';
import { Handle } from '@xyflow/react';

const AbstractNode = ({ id, data, isConnectable, children }) => {
  return (
    <div className="bg-white border border-gray-300 shadow-md rounded p-4 relative">
      {children}
      <Handle
        type="source"
        position="right"
        id="source"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"
      />
      <Handle
        type="target"
        position="left"
        id="target"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2"
      />
    </div>
  );
};

export default AbstractNode;
