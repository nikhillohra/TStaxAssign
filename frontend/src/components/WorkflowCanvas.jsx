import React, { useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  addEdge,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import FilterDataNode from "./nodes/FilterDataNode";
import WaitNode from "./nodes/WaitNode";
import ConvertFormatNode from "./nodes/ConvertFormatNode";
import SendPostRequestNode from "./nodes/SendPostRequestNode";
import Toolbar from "./Toolbar";
import { createWorkflow } from "../services/WorkflowService";

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState("");

  const nodeTypes = {
    filterData: FilterDataNode,
    wait: WaitNode,
    convertFormat: ConvertFormatNode,
    sendPostRequest: SendPostRequestNode,
  };

  const onDrop = (event) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("application/reactflow");
    const nodeLabelMap = {
      filterData: "Filter Data Node",
      wait: "Wait Node",
      convertFormat: "Convert Format Node",
      sendPostRequest: "Send POST Request Node",
    };
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: event.clientX - 50, y: event.clientY - 50 },
      data: { label: nodeLabelMap[nodeType] || `${nodeType} Node` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const saveWorkflow = async () => {
    try {
      if (!workflowName) {
        alert("Please enter a name for the workflow");
        return;
      }
  
      const workflowId = nanoid(); // Generate unique ID
  
      // Ensure edges have required properties
      const updatedEdges = edges.map(edge => ({
        ...edge,
        type: edge.type || 'default', 
      }));
  
      // Define the workflow object
      const workflow = {
        id: workflowId,
        name: workflowName,
        nodes,
        edges: updatedEdges, 
      };
      
      // Call the createWorkflow function and wait for the response
      const response = await createWorkflow(workflow);
  
      // Check if response contains the workflow ID
      if (response && response.id) {
        alert(`Workflow "${workflowName}" saved successfully with ID: ${response.id}`);
      } else {
        alert("Error: Workflow ID not returned");
      }
  
      // Clear the workflow name input
      setWorkflowName(""); 
    } catch (error) {
      console.error("Error saving workflow:", error.message);
      alert("Error saving workflow. Please try again.");
    }
  };
  

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <>
      <main>
        <div className="flex h-[80vh] p-1 bg-gray-800">
          <div
            className="relative flex-grow items-center justify-center w-[80%]"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <div className="toolbarGlass">
              <Toolbar />

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 gap-1 justify-center">
                <input
                  type="text"
                  placeholder="Enter Workflow Name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs w-full sm:w-40 h-9"
                />
                <button
                  onClick={saveWorkflow}
                  className="bg-[#1156d6] hover:bg-[#053b9f] text-white rounded flex p-1.5 items-center justify-center text-center mt-2 h-9 sm:w-32"
                >
                  Save Workflow
                </button>
              </div>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="h-full"
            >
              <MiniMap />
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </main>
    </>
  );
}

export default WorkflowCanvas;
