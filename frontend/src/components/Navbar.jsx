import React from "react";

const Navbar = () => {
  return (
    <>
      <div className="w-screen h-[5rem] flex justify-between items-center shadow-gray-600  bg-[#ea9414e3] shadow-lg">
        <div className="p-4 flex">
          <img
            className=" mix-blend-multiply object-contain"
            src="./src/assets/tstax.webp"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <div className="flex p-2 items-center justify-center">
          <h2 className="text-xl font-[400] text-center text-gray-800 p-2">WORKFLOW BUILDER</h2>
        </div>
      </div>
    </>
  );
};

export default Navbar;
