import { DollarSign } from "lucide-react";
import React from "react";

const AppLogo = () => {
  return (
    <div className="text-[#a452f8] font-bold text-[2rem] flex gap-[.6rem]">
      <DollarSign />
      <span>Kuro</span>
    </div>
  );
};

export default AppLogo;
