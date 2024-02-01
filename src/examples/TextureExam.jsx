// 1.

import React, { Suspense } from "react";
import * as THREE from "three";
import { OrbitControls, useTexture, Sphere } from "@react-three/drei"; //烘焙
import { Stage } from "@react-three/drei"; //舞台
import { useControls } from "leva";

import mapImg from "/textures/color.jpg";
import mapDisplacementMap from "/textures/displacement.jpg";
import mapMetalnessMap from "/textures/metalness.jpg";
import mapNormalMap from "/textures/normal.jpg";
import mapRoughnessMap from "/textures/roughness.jpg";

export default function textureExam({ orbitControls }) {
  const { args1 } = useControls({ args1: [1, 32, 32] });

  const textureProps = useTexture({
    map: "/textures/color.jpg",
    displacementMap: mapDisplacementMap,
    metalnessMap: mapMetalnessMap,
    normalMap: mapNormalMap,
    roughnessMap: mapRoughnessMap,
  });
  const TextureRender = () => (
    <Sphere args={[...args1]}>
      <meshPhysicalMaterial
        {...textureProps}
        map-magFilter={THREE.NearestFilter}
        displacementScale={0.5}
      />
    </Sphere>
  );
  return (
    <>
      {orbitControls ? <OrbitControls makeDefault autoRotate={false} /> : null}
      <Suspense fallback={null}>
        <Stage intensity={1} environment={null}>
          <TextureRender />
        </Stage>
      </Suspense>
    </>
  );
}
