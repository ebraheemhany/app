import React from "react";
import { Suggested } from "../items/Suggested";
import { ActiveNow } from "../items/ActiveNow";

const RighteSection = () => {
  return (
    <div className="w-full mt-10">
      <div>
        <Suggested />
      </div>
      <div className="mt-5">
        <ActiveNow />
      </div>
    </div>
  );
};

export default RighteSection;
