import React, { useState } from "react";

const BuySellButtons = () => {
  const [isBuy, setIsBuy] = useState(true);

  return (
    <div className="inline-flex bg-white rounded-lg shadow-sm relative">
      <button
        className={`px-8 py-3 font-medium relative ${isBuy ? "bg-emerald-500 text-white z-10" : "text-gray-500"}`}
        onClick={() => setIsBuy(true)}
        style={{
          clipPath: isBuy ? "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)" : undefined,
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          width: "100px",
        }}
      >
        Buy
      </button>
      <button
        className={`px-8 py-3 font-medium relative ${!isBuy ? "bg-red-500 text-white z-10" : "text-gray-500"}`}
        onClick={() => setIsBuy(false)}
        style={{
          clipPath: !isBuy ? "polygon(100% 0, 10% 0, 0 50%, 10% 100%, 100% 100%)" : undefined,
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          width: "100px",
          marginLeft: "-20px",
        }}
      >
        Sell
      </button>
    </div>
  );
};

export default BuySellButtons;
