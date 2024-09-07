// WaitNode.js
import React from 'react';
import AbstractNode from './AbstractNode';

const WaitNode = ({ id, data, isConnectable }) => {
  return (
    <AbstractNode id={id} data={data} isConnectable={isConnectable}>
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <div className="font-bold text-yellow-800">Wait Node</div>
        <div className="text-yellow-600">Introduces a 60-second delay</div>
      </div>
    </AbstractNode>
  );
};

export default WaitNode;
