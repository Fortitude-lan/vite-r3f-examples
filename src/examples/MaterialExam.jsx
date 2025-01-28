// 2.

import {
  OrbitControls,
  Plane,
  Sphere,
  Stage,
  Torus,
  useTexture,
  useCubeTexture,
  Box,
  MeshTransmissionMaterial
} from "@react-three/drei";

import { useControls } from "leva";
import React, { Suspense, useState } from "react";
import * as THREE from "three";

export default function MaterialExam({ orbitControls }) {

  const texture = useCubeTexture(
    ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    { path: "map/" }
  );
  const matcap = useTexture("/matcap/1.png");
  // 盲盒玩偶材质
  const materialProps = useControls({
    color: "aqua",
    roughness: 0.5,
    metalness: 0.5,
  });
  const [material, setMaterial] = useState();
  // 玻璃配置
  const glassesProps = {
    thickness: 0.4,
    roughness: 0,
    transmission: 1,
    ior: 1.2,
    chromaticAberration: 0.02,
    backside: true,
  };
  const MaterialRender = () => (
    <group position={[0, 0, 4]}>
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
    </group>
  );
  return (
    <>
      {orbitControls ? <OrbitControls makeDefault autoRotate={false} /> : null}

      <Suspense fallback={null}>
        <Stage intensity={1} environment={null}>
          {MaterialRender()}

          {/* 半透明 */}
          <Box args={[2, 2, 2]} position={[-4, 0, 0]}>
            <meshStandardMaterial color="red" transparent opacity={0.5} />
          </Box>
          {/* 金属 */}
          <Torus args={[2, 0.5, 32, 128]} position={[-8, 1, 0]}>
            <meshStandardMaterial metalness={0} roughness={1} />
          </Torus>
          {/* 深度 */}
          <Box args={[2, 2, 2]} position={[0, 0, 0]}>
            {/*默认true 会遮挡  depthWrite={false} 取消深度缓冲区=>不会遮挡后面的物体  */}
            {/* <meshStandardMaterial color="green" depthWrite={false} /> */}
            {/* alphaTest 用于处理透明度阈值。当材质的透明度（alpha）值低于这个阈值时，对应的像素将被丢弃。 */}
            <meshStandardMaterial color="green" />
          </Box>
          {/* 环境贴图 envMap  相关度reflectivity*/}
          <Torus args={[2, 0.5, 32, 128]} position={[5, 1, 0]}>
            <meshBasicMaterial color="#2fe4fc" envMap={texture} reflectivity={1} />
          </Torus>
          {/*  法线 */}
          <Box args={[2, 2, 2]} position={[-4, 0, -4]}>
            <meshNormalMaterial />
          </Box>
          {/* matcap 不受光影响 */}
          <Box args={[2, 2, 2]} position={[0, 0, -4]}>
            <meshMatcapMaterial matcap={matcap} />
          </Box>
          {/*  Lamber 受灯光影响*/}
          <Torus args={[2, 0.5, 8, 16]} position={[5, 1, -4]}>
            <meshLambertMaterial color={0xff0000} emissive={0x000000} />
          </Torus>

          {/* 玻璃 */}
          <Torus args={[2, 0.5, 8, 16]} position={[5, 1, -8]}>
            <MeshTransmissionMaterial {...glassesProps} />
          </Torus>
        </Stage>
      </Suspense>
    </>
  );
}
