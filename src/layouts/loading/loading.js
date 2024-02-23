import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import Color from "../Color";

export default function Loading() {
  const [isLoading, setLoading] = useState(false);
  const data = useSelector((state) => state.loading.data);

  useEffect(() => {
    if (data.isLoading !== null) {
      setLoading(data.isLoading);
      var element = document.getElementsByClassName("App");
      if (data.isLoading) {
        element[0].style.opacity = 0.5;
      } else {
        element[0].style.opacity = 1;
      }
    }
  }, [data.isLoading]);

  const renderLoadingComponent = (load) => {
    return load === true ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          zIndex: 1,
        }}
      >
        <ReactLoading type="spin" height={200} width={100} color={Color.Main} />
      </div>
    ) : (
      <div></div>
    );
  };

  return <React.Fragment>{renderLoadingComponent(isLoading)}</React.Fragment>;
}
