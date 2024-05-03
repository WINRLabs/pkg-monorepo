import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { CoinCanvasProps } from "../../types";

const CoinCanvas: React.FC<CoinCanvasProps> = ({
  width = 250,
  height = 250,
  onLoad,
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (canvas.current && !initialized) {
      const initRenderer = (_canvas: HTMLCanvasElement) => {
        const renderer = new THREE.WebGLRenderer({
          canvas: _canvas,
          alpha: true,
        });

        if (window.innerWidth > 768) {
          renderer.setPixelRatio(5);
        }

        renderer.setSize(width, height);

        return renderer;
      };

      const initCamera = () => {
        const camera = new THREE.PerspectiveCamera(41, width / height, 1, 2000);
        camera.position.z = 630;

        return camera;
      };

      const initScene = () => {
        return new THREE.Scene();
      };

      onLoad({
        canvas: canvas.current,
        renderer: initRenderer(canvas.current),
        camera: initCamera(),
        scene: initScene(),
      });
      setInitialized(true);
    }
  }, [canvas, width, height, onLoad, initialized]);

  return (
    (<div className="wr-absolute wr-left-1/2 wr-top-[45%] wr--translate-x-1/2 wr--translate-y-1/2 wr-w-[250px] wr-h-[250px] wr-max-md:scale-75 wr-max-md:top-1/2">
      <div className="wr-absolute wr-z-[0] wr-top-[50%] wr-left-[50%] wr--translate-x-1/2 wr--translate-y-1/2 wr-w-[250px] wr-h-[250px] wr-bg-white wr-opacity-40 wr-blur-[50px]" />
      <canvas ref={canvas} className="wr-relative wr-z-[1]" />
    </div>)
  );
};

export default React.memo(CoinCanvas);
