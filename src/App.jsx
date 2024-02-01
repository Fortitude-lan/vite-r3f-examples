import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Leva } from "leva";

import TextureExam from "./examples/textureExam";
import MaterialExam from "./examples/MaterialExam";
import Text3dExam from "./examples/Text3dExam";
import R3fBasicExam from "./examples/R3fBasicExam";
import LoadModelExam from "./examples/loadModelExam";
import ScrollCtrl from "./examples/ScrollCtrl";
import Shadermaterials from "./examples/Shadermaterials";
import KeyboardModel from "./examples/KeyboardModel";
import SphereGame from "./examples/SphereGame";
import PhysicsExam from "./examples/PhysicsExam";

export default function App() {
  const created = ({ gl, scene }) => {
    // 设置颜色背景
    gl.setClearColor("ivory", 1);
    // scene.background = new THREE.Color("red");
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  };
  const allExamples = {
    TextureExam: false,
    MaterialExam: false,
    Text3dExam: false,
    R3fBasicExam: false,
    LoadModelExam: false,
    ScrollCtrl: false,
    Shadermaterials: false,
    SphereGame: false,
    PhysicsExam: false,
  };

  return (
    <>
      <Leva collapsed />

      {/* <KeyboardModel orbitControls={true} /> */}
      <Canvas shadows={true} dpr={[1, 2]} onCreated={created}>
        {allExamples.TextureExam && <TextureExam orbitControls={true} />}
        {allExamples.MaterialExam && <MaterialExam orbitControls={true} />}
        {allExamples.Text3dExam && <Text3dExam orbitControls={true} />}
        {allExamples.R3fBasicExam && <R3fBasicExam orbitControls={true} />}
        {allExamples.LoadModelExam && <LoadModelExam orbitControls={true} />}
        {allExamples.ScrollCtrl && <ScrollCtrl />}
        {allExamples.Shadermaterials && <Shadermaterials />}
        {allExamples.Shadermaterials && <SphereGame orbitControls={true} />}
        {allExamples.PhysicsExam && <PhysicsExam orbitControls={true} />}
      </Canvas>
    </>
  );
}
