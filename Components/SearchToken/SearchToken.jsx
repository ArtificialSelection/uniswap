import React, { useState } from "react";
import Image from "next/image";

import Style from "./SearchToken.module.css";
import images from "../../assets";

const SearchToken = ({  tokens, tokenData }) => {
  //useState
  const [active, setActive] = useState(1);
  // const coin = [
  //   {
  //     img: images.ether,
  //     name: "ETH",
  //   },
  //   {
  //     img: images.ether,
  //     name: "BTC",
  //   },
  //   {
  //     img: images.ether,
  //     name: "Doge",
  //   },
  //   {
  //     img: images.ether,
  //     name: "Inu",
  //   },
  //   {
  //     img: images.ether,
  //     name: "WETH",
  //   },
  //   {
  //     img: images.ether,
  //     name: "DOT",
  //   },
  //   {
  //     img: images.ether,
  //     name: "TIME",
  //   },
  //   {
  //     img: images.ether,
  //     name: "GRT",
  //   },
  //   {
  //     img: images.ether,
  //     name: "LINK",
  //   },
  //   {
  //     img: images.ether,
  //     name: "LYX",
  //   },
  // ];

  // let tokenList = [];
  // for (let i = 0; i < tokenData.length; i++) {
  //   if (i % 2 == 1) tokenList.push(tokenData[i]);
  // }
  let tokenList = [];
  for (let i = 0; i < tokenData.length; i++) {
    if (i % 2 == 1) tokenList.push(tokenData[i]);
  }

  return (
    <div className={Style.SearchToken}>
      <div className={Style.SearchToken_box}>
        <div className={Style.SearchToken_box_heading}>
          <h4> Select a token</h4>
          <Image
            src={images.close}
            alt="close"
            width={20}
            height={20}
            onClick={() => openToken(false)}
          />
        </div>
        <div className={Style.SearchToken_box_search}>
          <div className={Style.SearchToken_box_search_img}>
            <Image src={images.search} alt="img" width={20} height={20} />
          </div>
          <input type="text" placeholder="Search name and paste the address" />
        </div>
        <div className={Style.SearchToken_box_tokens}>
          {tokenList.map((el, i) => (
            <span
              key={i + 1}
              className={active == i + 1 ? `${Style.active}` : " "}
              onClick={() => (
                setActive(i + 1),
                tokens({
                  name: el.name,
                  image: el.img,
                  symbol: el.symbol,
                  tokenBalance: el.tokenBalance,
                  tokenAddress: el,
                })
              )}
            >
              <Image
                src={el.img || images.ether}
                alt="image"
                width={30}
                height={30}
              />
              {el.symbol}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchToken;
