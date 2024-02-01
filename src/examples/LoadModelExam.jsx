import React, { Suspense } from "react";
import { Perf } from "r3f-perf";
import { OrbitControls, Clone, useGLTF } from "@react-three/drei";
import { Hamburger } from "./models/Hamburger";
import Fox from "./models/Fox";
import PortalScreen from "./models/PortalScreen";
import Racoon from "./models/Racoon";
export default function LoadModelExam({ orbitControls }) {
  return (
    <>
      {orbitControls&& <OrbitControls makeDefault autoRotate={false} />}
      <Perf position="top-left" />
      <directionalLight
        position={[1, 2, 3]}
        intensity={2}
        castShadow
        shadow-normalMatrix={0.04}
      />
      <ambientLight intensity={0.5} />

      {/* <primitive object={model.scene} scale={0.35} /> */}
      {/* <Clone object={model.scene} position-x={0} scale={0.35} />
      <Clone object={model.scene} position-x={-4} scale={0.35} />
      <Clone object={model.scene} position-x={4} scale={0.35} /> */}
      {/* <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
      <Suspense
      // fallback={}
      >
        {/* <Hamburger scale={0.35} /> */}
      </Suspense>

      <Fox />
      <Racoon />
      <PortalScreen />
    </>
  );
}
