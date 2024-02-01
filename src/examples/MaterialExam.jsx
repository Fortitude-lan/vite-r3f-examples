// 2.

import { OrbitControls, Plane, Sphere, Stage, Torus } from "@react-three/drei";
import { useControls } from "leva";
import React, { Suspense, useState } from "react";
import { useEffect } from "react";
import * as THREE from "three";

export default function MaterialExam({ orbitControls }) {
  const materialProps = useControls({
    color: "aqua",
    roughness: 0.5,
    metalness: 0.5,
  });
  const [material, setMaterial] = useState();

  const MaterialRender = () => (
    <>
      <meshPhysicalMaterial
        ref={setMaterial}
        side={THREE.DoubleSide}
        {...materialProps}
      />
      <Sphere args={[1, 32, 32]} material={material} />
      <Plane args={[2, 2]} position={[3, 0, 0]} material={material} />
      <Torus
        args={[1, 0.5, 32, 32]}
        position={[-3.5, 1, 0]}
        material={material}
      />
    </>
  );
  return (
    <>
      {orbitControls ? <OrbitControls makeDefault autoRotate={false} /> : null}

      <Suspense fallback={null}>
        <Stage intensity={1} environment={null}>
          {MaterialRender()}
        </Stage>
      </Suspense>
    </>
  );
}
