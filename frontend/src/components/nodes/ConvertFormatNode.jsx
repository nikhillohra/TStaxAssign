// ConvertFormatNode.js
import React from 'react';
import AbstractNode from './AbstractNode';

const ConvertFormatNode = ({ id, data, isConnectable }) => {
  return (
    <AbstractNode id={id} data={data} isConnectable={isConnectable}>
      <div className="p-4 bg-green-100 border border-green-300 rounded">
        <div className="font-bold text-green-800">Convert Format Node</div>
        <div className="text-green-600">Transforms CSV to JSON</div>
      </div>
    </AbstractNode>
  );
};

export default ConvertFormatNode;
