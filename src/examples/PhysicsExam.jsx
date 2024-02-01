import React, { useState, useMemo, useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import { OrbitControls, Clone, useGLTF } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
  CylinderCollider,
  InstancedRigidBodies,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
export default function PhysicsExam({ orbitControls }) {
  const twisterRef = useRef();
  const sphereeRef = useRef();
  const cubeRef = useRef();
  const [hitSound, sethitSound] = useState(() => new Audio("/sounds/hit.mp3"));
  const hamburger = useGLTF("/models/hamburger.glb");
  const cubeJump = (ref) => {
    console.log("Jump: applyImpulse(vec3)");
    console.log("扭矩: applyTorqueImpulse(vec3) ");
    const mass = ref.current.mass();
    console.log(mass);
    ref.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true);
    ref.current.applyTorqueImpulse(
      {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5,
      },
      true
    );
  };
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 3;
    const eulerRotation = new THREE.Euler(0, time, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twisterRef.current.setNextKinematicRotation(quaternionRotation);
    const angle = time * 0.5;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    twisterRef.current.setNextKinematicTranslation({ x, y: -0.6, z });
  });
  const collisionEnter = () => {
    hitSound.currentTime = 0;
    hitSound.volume = Math.random();
    hitSound.play();
  };

  const cubesCount = 300;
  const cubesRef = useRef();
  const instances = useMemo(() => {
    const instances = [];
    for (let i = 0; i < cubesCount; i++) {
      instances.push({
        key: "instance_" + Math.random(),
        position: [
          (Math.random() - 0.5) * 0.8,
          1 + i,
          (Math.random() - 0.5) * 0.8,
        ],
        rotation: [Math.random(), Math.random(), Math.random()],
        scale: 0.3 + Math.random() * 0.8,
      });
    }
    return instances;
  }, []);
  return (
    <>
      <Perf position="top-left" />
      {orbitControls && <OrbitControls makeDefault autoRotate={false} />}
      <ambientLight intensity={1} />
      <directionalLight castShadow position={[1, 2, 3]} />
      <Physics gravity={[0, -9.08, 0]}>
        {/**
         * attr:  colliders
         * value: "cuboid" | "ball" | "trimesh" | "hull" | false
         */}
        {/* 球 */}
        <RigidBody ref={sphereeRef} colliders="ball">
          <mesh
            castShadow
            position={[-0.5, 4, 0]}
            onClick={() => cubeJump(sphereeRef)}
          >
            <sphereGeometry args={[0.7]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
        {/* 方 */}
        <RigidBody
          ref={cubeRef}
          gravityScale={1}
          restitution={0}
          friction={0.7}
          colliders={false}
          position={[2, 2, 0]}
        >
          <mesh castShadow onClick={() => cubeJump(cubeRef)}>
            <boxGeometry />
            <meshStandardMaterial color="pink" />
          </mesh>
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={0.5} />
        </RigidBody>
        {/* 甜甜圈 */}
        <RigidBody
          scale={0.5}
          colliders={false}
          position={[3, 1, -3]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          {/* <CuboidCollider args={[1.5, 1.5, 0.5]} />
          <CuboidCollider
            position={[0, 0,1]}
            rotation={[-Math.PI * 0.35, 0, 0]}
            args={[0.25, 1, 0.25]}
          /> */}

          <BallCollider args={[1.5]} />
          <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
        {/* <RigidBody>
          <mesh castShadow position={[2, 2, 0]}>
            <boxGeometry  args={[1,1,0.1]} />
            <meshStandardMaterial color="pink" />
          </mesh>
          <mesh castShadow position={[2, 3, 3]}>
            <boxGeometry  args={[0.5,0.5,0.1]} />
            <meshStandardMaterial color="pink" />
          </mesh>
        </RigidBody> */}

        {/* type: 'dynamic'(默) | 'fixed'  */}
        <RigidBody type="fixed" restitution={0} friction={0.7}>
          <mesh
            receiveShadow
            // position-y={0}
            position-y={-1.25}
            // rotation-x={-Math.PI * 0.5}
            scale={6}
          >
            {/* <planeGeometry /> */}
            <boxGeometry args={[2, 0.1, 2]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
        {/* 旋转棍子 */}
        <RigidBody
          ref={twisterRef}
          position={[0.8, -0.6, 0]}
          friction={0}
          type="kinematicPosition"
          onCollisionEnter={collisionEnter}
          //   onIntersectionExit={()=>{}}
          onSleep={() => {
            console.log("sleep");
          }}
          onWake={() => {
            console.log("wake");
          }}
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
        {/* 汉堡 */}
        <RigidBody colliders={false} position={[0, 4, 0]}>
          <primitive object={hamburger.scene} scale={0.25} />
          <CylinderCollider args={[0.5, 1.25]} />
        </RigidBody>
        {/* 边 */}
        <RigidBody type="fixed">
          <CuboidCollider args={[6, 2.5, 0.5]} position={[0, 1, 6]} />
          <CuboidCollider args={[6, 2.5, 0.5]} position={[0, 1, -6]} />
          <CuboidCollider args={[0.5, 2.5, 6]} position={[6, 1, 0]} />
          <CuboidCollider args={[0.5, 2.5, 6]} position={[-6, 1, 0]} />
        </RigidBody>

        <InstancedRigidBodies instances={instances}>
          <instancedMesh
            castShadow
            ref={cubesRef}
            args={[null, null, cubesCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
