import React, { useState, useContext } from "react";
import Image from "next/image";

import images from "../assets";
import Style from "../styles/Pools.module.css";
import { PoolAdd, PoolConnect } from "../Components/index";
import { SwapTokenContext } from "@/Context/SwapContext";

const Pool = () => {
  const { account, createLiquidityAndPool, tokenData, getAllLiquidity } =
    useContext(SwapTokenContext);

  const [closePool, setClosePool] = useState(false);

  return (
    <div className={Style.Pool}>
      {account ? (
        <PoolAdd
          account={account}
          setClosePool={setClosePool}
          tokenData={tokenData}
          createLiquidityAndPool={createLiquidityAndPool}
        />
      ) : (
        <PoolConnect
          setClosePool={setClosePool}
          getAllLiquidity={getAllLiquidity}
          account={account}
        />
      )}
    </div>
  );
};

export default Pool;
