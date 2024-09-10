import React from "react";

const Footer = () => {
  return (
    <>
      <div className="w-screen h-[5rem] mt-4 flex justify-center items-center shadow-gray-600  bg-[#ea9414e3]   shadow-lg">
        <div className="py-4 flex">
          <img
            className=" mix-blend-multiply object-contain"
            src="./tstax.webp"
            alt="logo"
            width={80}
            height={80}
          />
        </div>
        <div className="flex py-2 items-center justify-center">
          <h2 className="text-lg flex font-[400] text-center text-gray-800 p-2">WORKFLOW BUILDER<span className="text-sm flex">©</span></h2>
        </div>
      </div>
    </>
  );
};

export default Footer;
