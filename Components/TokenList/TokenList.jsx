import React from "react";
import Image from "next/image";

import Style from "./TokenList.module.css";
import images from "../../assets";

const TokenList = ({ tokenData, setOpenTokenBox }) => {
  const data = [1, 2, 3, 4, 5, 6, 7];
  // console.log(tokenDate);
  let tokenList = [];
  // for (let i = 0; i < tokenData.length; i++) {
  //    if(i % 2 == 1)tokenList.push(tokenData[i]);
  // }
  for (let i = 0; i < tokenData.length; i++) {
    if(i % 2 == 1) tokenList.push(tokenData[i]);
  }
  return (
    <div className={Style.TokenList}>
      <p
        className={Style.TokenList_close}
        onClick={() => setOpenTokenBox(false)}
      >
        <Image src={images.close} alt="close" width={20} height={20} />
      </p>
      <div className={Style.TokenList_title}>
        <h2>Your Token List</h2>
      </div>

      {tokenList.map((el, i) => (
        <div className={Style.TokenList_box}>
          <div className={Style.TokenList_box_info}>
            <p className={Style.TokenList_box_info_symbol}>{el.symbol}</p>
            <p>
              <span>{el.tokenBalance.slice(0, 9)}</span>
              {el.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
