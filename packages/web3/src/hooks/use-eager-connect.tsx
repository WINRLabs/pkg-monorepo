import { useEffect } from "react";
import { useClient, useConnect } from "wagmi";

const useEagerConnect = () => {
  const config = useClient();
  const { connectAsync, connectors } = useConnect();
  useEffect(() => {
    if (
      !(typeof window === "undefined") &&
      window?.parent !== window &&
      // @ts-ignore
      !window.cy
    ) {
      config;
    } else {
      console.log("hey");
    }
  }, [config, connectAsync, connectors]);
};

export default useEagerConnect;
