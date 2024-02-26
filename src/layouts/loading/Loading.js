import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import { loading } from "src/theme/Colors";

export default function Loading() {
  const [isLoading, setLoading] = useState(false);
  const data = useSelector((state) => state.loading.data);

  useEffect(() => {
    if (data.isLoading !== null) {
      setLoading(data.isLoading);
      const element = document.getElementById("__next");
      if (element) {
        element.style.opacity = data.isLoading ? 0.6 : 1;
      }
    }
  }, [data.isLoading]);

  return isLoading ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        zIndex: 20000,
      }}
    >
      <ReactLoading type="spin" height={200} width={100} color={loading.main} />
    </div>
  ) : null;
}
