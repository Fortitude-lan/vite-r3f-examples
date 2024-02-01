// 3.

import { useFrame, extend } from "@react-three/fiber";
import { useControls } from "leva";
import React, { Suspense, useState, useMemo, useRef } from "react";
import { OrbitControls,useMatcapTexture, Center, Text3D, Stage } from "@react-three/drei";
extend({ Text3D });

export default function Text3dExam({ orbitControls }) {
  const [material, setMaterial] = useState();
  const [torusGeometry, settorusGeometry] = useState();
  const [matcapTexture, url] = useMatcapTexture(179, 256);
  const materialProps = useControls("BasicText", {
    color: "aqua", //meshNormalMaterial没有  meshStandardMaterial可
    roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });
  const { BasicTextShow } = useControls({ BasicTextShow: false });
  const donutsGroup = useRef();
  const donutsGroup1 = useRef([]);
  const textOptions = useControls({
    text: "Hello",
    size: { value: 0.5, min: 0, max: 2, step: 0.01 },
    height: { value: 0.2, min: 0, max: 1, step: 0.01 },
    letterSpacing: { value: 0.5, min: 0, max: 1, step: 0.01 },
    curveSegments: 3,
    bevelEnabled: true, //是否开启斜角，
    bevelThickness: 0.02, //文本上斜角的深度
    bevelSize: 0.02, //斜角与原始文本轮廓之间的延伸距离
    bevelSegments: 5, //斜角的分段数
  });
  const BasicTExt3d = () => (
    <Center center>
      <Text3D
        {...textOptions}
        color={materialProps.color}
        font="/typefaces/Rubik Bubbles_Regular.json"
      >
        {textOptions.text}
        <meshStandardMaterial {...materialProps} />
      </Text3D>
    </Center>
  );

  useFrame((state, delta) => {
    // for (let i of donutsGroup.current.children) {
    //   i.rotation.y += delta * 0.1;
    // }
    // console.log(donutsGroup1.current.length);
    for (let i of donutsGroup1.current) {
      i.rotation.y += delta * 0.1;
    }
  });
  return (
    <>
      {orbitControls ? <OrbitControls makeDefault autoRotate={false} /> : null}
      {/* <ambientLight intensity={materialProps.ambIntensity} /> */}
      {/* <pointLight position={[10, 10, 10]} color="#Fff" /> */}
      {/* <Suspense fallback={null}> */}

      {/* </Suspense> */}

      {BasicTextShow ? (
        <Stage preset="soft" environment={null}>
          <BasicTExt3d />
        </Stage>
      ) : null}

      <Center center>
        <Text3D
          {...textOptions}
          material={material}
          font="/typefaces/Rubik Bubbles_Regular.json"
        >
          {textOptions.text}
          {/* <meshStandardMaterial {...materialProps} /> */}
          {/* <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} /> */}
        </Text3D>
      </Center>
      <torusGeometry ref={settorusGeometry} args={[1, 0.6, 16, 32]} />
      <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} />
      {/* <group ref={donutsGroup}> */}
      {[...Array(100)].map((v, idx) => (
        <mesh
          ref={(e) => {
            donutsGroup1.current[idx] = e;
          }}
          key={idx}
          geometry={torusGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
      {/* </group> */}
    </>
  );
}
