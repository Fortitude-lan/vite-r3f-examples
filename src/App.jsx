import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Leva, useControls } from "leva";

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
  const {
    boo_TextureExam,
    boo_MaterialExam,
    // boo_Text3dExam,
    boo_R3fBasicExam,
    boo_LoadModelExam,
    boo_ScrollCtrl,
    boo_Shadermaterials,
    boo_PhysicsExam,
    // boo_Shader,
  } = useControls('All', {
    boo_TextureExam: true,
    boo_MaterialExam: false,
    // boo_Text3dExam: true,
    boo_R3fBasicExam: false,
    boo_LoadModelExam: false,
    boo_ScrollCtrl: false,
    boo_Shadermaterials: false,
    // boo_Shader: false,
    boo_PhysicsExam:false
  });
  return (
    <>
      <Leva collapsed />

      {/* <KeyboardModel orbitControls={true} /> */}
      <Canvas shadows={true} dpr={[1, 2]} onCreated={created}>

        {boo_TextureExam && <TextureExam orbitControls={true} />}
        {boo_MaterialExam && <MaterialExam orbitControls={true} />}
        {/* {boo_Text3dExam && <Text3dExam orbitControls={true} />} */}
        {boo_R3fBasicExam && <R3fBasicExam orbitControls={true} />}
        {boo_LoadModelExam && <LoadModelExam orbitControls={true} />}
        {boo_ScrollCtrl && <ScrollCtrl />}
        {boo_Shadermaterials && <Shadermaterials />}
        {/* {boo_Shader && <SphereGame orbitControls={true} />} */}
        {boo_PhysicsExam && <PhysicsExam orbitControls={true} />}
      </Canvas>
    </>
  );
}
