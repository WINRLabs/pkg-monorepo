import * as THREE from "three";

import { CDN_URL } from "../../../../constants";

const getMaterials = () => {
  const loader = new THREE.TextureLoader();

  return [
    new THREE.MeshBasicMaterial({
      map: loader.load(`${CDN_URL}/coin-flip-2d/side.png`),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(`${CDN_URL}/coin-flip-2d/back.jpg`),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(`${CDN_URL}/coin-flip-2d/front.jpg`),
    }),
  ];
};

const createCylinder = (): THREE.Mesh<
  THREE.CylinderGeometry,
  THREE.MeshBasicMaterial[]
> => {
  const materials = getMaterials();

  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(220, 220, 32, 100, 100, false),
    materials
  );

  cylinder.rotation.y = 0;
  cylinder.rotation.x = Math.PI / 2;
  cylinder.rotation.z = 0;

  return cylinder;
};

export default createCylinder;
