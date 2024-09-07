import React from "react";
import WorkflowCanvas from "./components/WorkflowCanvas";
import CallWorkflow from "./components/CallWorkflow";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="flex flex-col ">
        <Navbar />
        <WorkflowCanvas />
        <div className="mt-4 p-2">
          <CallWorkflow />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
