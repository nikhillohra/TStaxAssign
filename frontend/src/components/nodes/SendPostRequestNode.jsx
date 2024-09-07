// SendPostRequestNode.js
import React from 'react';
import AbstractNode from './AbstractNode';

const SendPostRequestNode = ({ id, data, isConnectable }) => {
  return (
    <AbstractNode id={id} data={data} isConnectable={isConnectable}>
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <div className="font-bold text-red-800">Send POST Request Node</div>
        <div className="text-red-600">Sends JSON payload to a URL</div>
      </div>
    </AbstractNode>
  );
};

export default SendPostRequestNode;
