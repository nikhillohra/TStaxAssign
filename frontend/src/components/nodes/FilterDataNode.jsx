// FilterDataNode.js
import React from 'react';
import AbstractNode from './AbstractNode';

const FilterDataNode = ({ id, data, isConnectable }) => {
  return (
    <AbstractNode id={id} data={data} isConnectable={isConnectable}>
      <div className="p-4 bg-blue-100 border border-blue-300 rounded">
        <div className="font-bold text-blue-800">Filter Data Node</div>
        <div className="text-blue-600">Converts data to lowercase</div>
      </div>
    </AbstractNode>
  );
};

export default FilterDataNode;
