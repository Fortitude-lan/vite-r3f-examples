import React, { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import {
  shaderMaterial,
  Sparkles,
  Center,
  useTexture,
  useGLTF,
} from "@react-three/drei";
import { Color } from "three";
import pVertex from "./shaders/portal/vertex";
import pFragment from "./shaders/portal/fragment";
// shaderMaterial creates a THREE.ShaderMaterial, and auto-creates uniform setter/getters
// extend makes it available in JSX, in this case <portalMaterial />

export default function PortalScreen() {
  const { nodes } = useGLTF("/models/PortalScreen/portal.glb");
  // console.log(nodes);
  const portalMaterialRef = useRef();
  const backTexture = useTexture("/models/PortalScreen/baked.jpg");
  // backTexture.flipY = false
  useFrame((state, delta) => {
    //方法1 
    // return portalMaterialRef.current.uTime += delta 
    //方法2
    return (portalMaterialRef.current.uniforms.uTime.value += delta);
  });
  return (
    <>
      {/* <color arg={["#201919"]} attach="background"></color> */}
      <Center>
        <Sparkles
          size={6}
          scale={[4, 2, 4]}
          position-y={1}
          speed={0.2}
          count={40}
        />
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={backTexture} map-flipY={false} />
        </mesh>
        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh
          geometry={nodes.portalLight.geometry}
          position={nodes.portalLight.position}
          rotation={nodes.portalLight.rotation}
        >
          {/* shader两种写法 1.自定义类 2.直接写*/}
          {/* <portalMaterial
              ref={portalMaterialRef}
              uColorStart="orange"
              uColorEnd="yellow"
            /> */}
          <shaderMaterial
            ref={portalMaterialRef}
            vertexShader={pVertex}
            fragmentShader={pFragment}
            uniforms={{
              uTime: { value: 0 },
              uColorStart: { value: new Color("#ffcc00") },
              uColorEnd: { value: new Color("#fff") },
            }}
          />
        </mesh>
      </Center>
    </>
  );
}
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color("hotpink"),
    uColorEnd: new Color("white"),
  },
  pVertex,
  pFragment
);
extend({ PortalMaterial });
