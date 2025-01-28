/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2023-12-28 10:52:06
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-28 21:04:10
 */
import React, { useRef } from "react";
import { OrbitControls, Plane, Sphere } from "@react-three/drei";
import { a } from "@react-spring/three";
import { useSpring } from "@react-spring/web";

export default function SphereGame({ orbitControls }) {
  const sphereRef = useRef();

  // React Spring animation for sphere movement
  const { position } = useSpring({
    position: [0, 1, 0], // Initial position
    config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 },
  });

  return (
    <>
      {orbitControls && <OrbitControls  makeDefault autoRotate={false}/>}
      {/* <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[5, 5, 5]} /> */}

      {/* Ground plane */}
      {/* <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shadowMaterial attach="material" opacity={1} color='green'/>
      </Plane> */}
      {/* Sphere */}
      <a.mesh ref={sphereRef} position={position} castShadow>
        <Sphere args={[1, 32, 32]} />
        <meshStandardMaterial color="red" />
      </a.mesh>
      {/* Keyboard controls */}
      <mesh
        onWheel={(e) => {
            console.log(e)
          // Adjust sphere position based on scroll direction
          const delta = e.deltaY;
          sphereRef.current.position.y += delta * 0.005;
        }}
        onKeyDown={(e) => {
            console.log(e)
          switch (e.key) {
            case "w":
              position.set(
                position.get().x,
                position.get().y,
                position.get().z - 0.1
              );
              break;
            case "s":
              position.set(
                position.get().x,
                position.get().y,
                position.get().z + 0.1
              );
              break;
            case "a":
              position.set(
                position.get().x - 0.1,
                position.get().y,
                position.get().z
              );
              break;
            case "d":
              position.set(
                position.get().x + 0.1,
                position.get().y,
                position.get().z
              );
              break;
            default:
              break;
          }
        }}
      />
    </>
  );
}
