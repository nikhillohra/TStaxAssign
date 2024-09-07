import React from 'react';

function Toolbar() {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
  };

  return (
   <>
    <div className="flex space-x-2 p-4  w-full justify-center items-center text-center text-sm" >
      <div
        className="p-2 bg-[#1156d6] hover:bg-[#053b9f]  text-white rounded cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, 'filterData')}
      >
        Filter Data 
      </div>
      <div
        className="p-2 bg-[#1156d6] hover:bg-[#053b9f] text-white rounded cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, 'wait')}
      >
        Wait Node
      </div>
      <div
        className="p-2 bg-[#1156d6] hover:bg-[#053b9f] text-white rounded cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, 'convertFormat')}
      >
        Convert Format
      </div>
      <div
        className="p-2 bg-[#1156d6] hover:bg-[#053b9f] text-white rounded cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, 'sendPostRequest')}
      >
        Send POST
      </div>
    </div>
    </>
  );
}

export default Toolbar;
