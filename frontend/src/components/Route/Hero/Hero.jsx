import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-report ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-[#4B5320] font-[600] capitalize">
          Welcome to
          <br />
          Gadget Mart
        </h1>
        <p className="pt-5 text-[16px] font-400 text-[#006A4E]">
          Whether you're building your dream PC, upgrading your gear, or looking
          for the latest gadgets, we've got everything <br />
          you need from powerful GPUs to sleek monitors, top of the line RAM,
          and more. Explore our wide range of high <br />
          quality tech products and find the perfect fit for your needs. Let's
          power up your tech world!"
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px] ">Shop Now</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;