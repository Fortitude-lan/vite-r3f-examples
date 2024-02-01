import React, { useRef } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Html,
  Text,
  Float,
  MeshReflectorMaterial,
  Text3D,
  useHelper,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky,
  Environment,
  Lightformer,
  Stage,
  useGLTF,
  meshBounds,
  useBVH,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { folder, button, useControls } from "leva";
import { Perf } from "r3f-perf";
import {
  Noise,
  Glitch,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing"; //增强渲染结果、添加视觉效果或修饰整个场景。
import { BlendFunction, GlitchMode } from "postprocessing";

export default function R3fBasicExam({ orbitControls }) {
  const sphere = useRef();
  const cube = useRef();
  const directionalLight = useRef();
  const transformControlsRef = useRef();
  // useHelper(directionalLight, THREE.DirectionalLightHelper, 0.5);

  const hamburger = useGLTF("/models/hamburger.glb");

  const { perfVisible } = useControls({ perfVisible: false });
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });
  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("env map", {
      envMapIntensity: { value: 3.5, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });
  //显示物体
  const { textGeo, sphereGeo, cubeGeo, plantGeo, env } = useControls("Models", {
    textGeo: false,
    sphereGeo: true,
    cubeGeo: true,
    plantGeo: true,
    env: false,
  });
  const { B, S, A, C } = useControls("Shadows", {
    B: false,
    S: false,
    A: false,
    C: false,
  });
  const { colorShadow, opacity, blur } = useControls("Contract Shadows", {
    colorShadow: "#4b2809",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  const { position, color, changeAxisMode, sphereAxis } = useControls(
    "sphere",
    {
      position: { value: { x: 2, y: 0 }, step: 0.01, joystick: "invertY" },
      color: "#ff0000",
      //color 其他写法
      // 'rgb(255，0，0)'
      // 'orange'
      // 'hsl(100deg，100%，50%)'
      // 'hsla(100deg，100%，50%，.5)'
      // '( r: 200, g: 106, b: 125, a: .4 )'
      sphereAxis: false,
      changeAxisMode: {
        value: "translate", // 默认模式
        options: ["translate", "rotate", "scale"],
        label: "AxisMode",
      },
      myInterval: {
        min: 0,
        max: 10,
        value: [4, 5],
      },
      clickMe: button(() => {
        console.log("ok");
      }),
    }
  );
  const { cubeScale, cubeAxis } = useControls("cube", {
    cubeScale: {
      value: 1.5,
      step: 0.01,
      min: 0,
      max: 5,
    },
    cubeAxis: false,
  });

  // 8. 运动
  useFrame((state, delta) => {
    if (cube.current) {
      const time = state.clock.elapsedTime;
      // cube.current.position.x = -2 + Math.sin(time);
      cube.current.rotation.y += delta * 0.2;
    }
  });
  //点击切换颜色
  const eventHandle = (e) => {
    sphere.current.material.color.set(`hsl(${Math.random() * 360},100%,75%)`);
  };
  return (
    <>
      {orbitControls ? <OrbitControls makeDefault autoRotate={false} /> : null}

      {/* 1.light */}
      <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={2}
        // 9.10.
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={0.5} />

      {/* 13.Sky */}
      {/* <Sky sunPosition={sunPosition}/> */}

      {/* 2. sphere Html*/}
      {/* TransformControls(不会随着滚轮变化scale)->mode: translate|rotate|scale */}
      {sphereAxis ? (
        <TransformControls
          ref={transformControlsRef}
          object={sphere}
          mode={changeAxisMode}
        />
      ) : null}
      <mesh
        castShadow
        ref={sphere}
        position={[position.x, position.y, 0]}
        visible={sphereGeo}
        position-y={1}
        // onContextMenu={eventHandle} //右键|ctrl+左键
        onClick={eventHandle}
        // onDoubleClick={eventHandle}
        // onPointerUp={eventHandle} //鼠标按下抬起的时候
        // onPointerDown={eventHandle} //鼠标按下的时候

        // onPointerOver={eventHandle} //鼠标移入的时候
        // onPointerOut={eventHandle} //鼠标移出的时候
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }} //鼠标移入的时候
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }} //鼠标移出的时候
        // onPointerMove={eventHandle} //鼠标在区域内移动的时候
        // onPointerMissed={eventHandle} //鼠标在canvas内点击的时候 一般写到<Canvas />标签内
      >
        <sphereGeometry />
        <meshStandardMaterial color={color} envMapIntensity={envMapIntensity} />
        <Html
          position={[1, 1, 0]}
          wrapperClass="label"
          center
          distanceFactor={6}
          occlude={[sphere, cube]}
        >
          That's sphere 👍
        </Html>
      </mesh>
      {/* 3. box */}
      {/* PivotControls(会随着滚轮变化scale, 可以用fixed+scale(max-num)使其固定不变) -> depthTest是否外显坐标 */}
      {cubeGeo ? (
        <Cube
          envMapIntensity={envMapIntensity}
          cube={cube}
          scale={cubeScale}
          cubeAxis={cubeAxis}
          // onClick={(e) => e.stopPropagation()}
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }} //鼠标移入的时候
          onPointerLeave={() => {
            document.body.style.cursor = "default";
          }} //鼠标移出的时候
        />
      ) : null}

      {/* 4. plant */}
      {plantGeo && (
        <mesh
          receiveShadow
          position-y={0}
          rotation-x={-Math.PI * 0.5}
          scale={10}
        >
          <planeGeometry />
          <meshStandardMaterial
            color="greenyellow"
            envMapIntensity={envMapIntensity}
          />

          {/* 反射材质地板 */}
          {/* <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.75}
          color="greenyellow"
        /> */}
        </mesh>
      ) }

      {/* 5.text float */}

      {textGeo ? <TextRender /> : null}

      {/* 6.性能 */}
      {perfVisible ? <Perf position="top-left" /> : null}

      {/* 7.背景颜色 */}
      {/* <color args={["ivory"]} attach="background" /> */}

      {/* 9.shadow(静态) 首先canvas{shadows} 其次mesh{castShadow} ,directionalLight{castShadow}最后plant{receiveShadow}
       * 10.Bakeshadow 动态
       * 11.AccumulativeShadows
       * 12.ContactShadows
       *
       * BakeShadows(烘焙阴影): 烘焙阴影是一种在渲染场景之前预先计算并储存阴影的技术。它通常用于静态场景，其中光照和物体位置不经常变化。使用场景： 静态场景、移动较少的场景。
       * SoftShadows(软阴影): 软阴影是通过模拟光源的大小和光的衰减来实现的，以产生柔和的阴影边缘。使用场景： 适用于需要更自然、更柔和的阴影，如室内场景或场景中有多个光源的情况。
       * AccumulativeShadows(累积阴影): 累积阴影是在多个渲染帧之间累积的阴影效果，以产生更真实的动态阴影效果。使用场景： 适用于需要在运行时累积阴影效果，例如逐帧的动画场景。
       * ContactShadows(接触阴影): 接触阴影是通过在物体接触表面处增加阴影效果来模拟光线与物体表面的接触。使用场景： 适用于增加场景的真实感，特别是在室外场景中，其中物体的光照效果受到地面的影响。
       *
       * */}
      {B ? <BakeShadows /> : null}
      {S ? <SoftShadows size={0.05} samples={17} rings={11} /> : null}
      {A ? (
        <AccumulativeShadows
          position={[0, -0.99, 0]}
          scale={10}
          color="#216d39"
          opacity={0.8}
          frames={Infinity} //丝滑阴影 Infinity
          temporal
          blender={100}
        >
          <RandomizedLight
            amount={8}
            radius={1}
            ambient={0.5}
            intensity={1}
            position={[1, 2, 3]}
            bias={0.001}
          />
        </AccumulativeShadows>
      ) : null}
      {C ? (
        <ContactShadows
          position={[0, 0, 0]}
          scale={10}
          resplution={512}
          far={5}
          color={colorShadow}
          opacity={opacity}
          blur={blur}
          frames={1} //模糊阴影的帧数,指定了渲染多少次以完成模糊效果。
        />
      ) : null}

      {/* 14.环境 */}
      {env ? (
        <Environment
          background
          // files={'/environmentMaps/studio_garden_1k.hdr'}
          // files={[
          //   "/environmentMaps/2/px.jpg",
          //   "/environmentMaps/2/nx.jpg",
          //   "/environmentMaps/2/py.jpg",
          //   "/environmentMaps/2/ny.jpg",
          //   "/environmentMaps/2/pz.jpg",
          //   "/environmentMaps/2/nz.jpg",
          // ]}
          preset="sunset"
          // resolution={32} //渲染环境贴图的分辨率
          ground={{
            height: envMapHeight,
            radius: envMapRadius,
            scale: envMapScale,
          }}
        >
          {/* <color args={["black"]} attach="background" /> */}
          {/*  <Lightformer/>  = 下面的<mesh/> 效果*/}
          {/* <Lightformer position-z={-5} scale={10} color="red" intensity={10} /> */}

          {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh> */}
        </Environment>
      ) : null}
      {/* 15.  stage 场景的设置和渲染 简化了设置灯光、阴影和雾的步骤*/}
      {/* <Stage
        shadows={{
          type: "contact",
          // color: "skyblue",
          // colorBlend: 0,  //颜色混合
          opacity: 0.5,
          blur: 3,
        }}
        intensity={2}
        environment="sunset"
        // environment={null}
      >
        <mesh castShadow position-y={5} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial
            color="orange"
            envMapIntensity={envMapIntensity}
          />
        </mesh>
        <mesh castShadow position-y={5} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial
            color="green"
            envMapIntensity={envMapIntensity}
          />
        </mesh>
      </Stage> */}

      {/* 16. 事件 */}
      <primitive
        object={hamburger.scene}
        scale={0.2}
        position-y={2}
        onClick={(e) => {
          console.log(e.object.name);
          e.stopPropagation();
        }}
      ></primitive>

      {/* 17. postprocessing 处理 */}
      <EffectComposer>
        {/* 边光圈 */}
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        /> */}
        {/* 失灵脉冲 */}
        {/* <Glitch
          mode={GlitchMode.CONSTANT_MILD}
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.02, 0.4]}
        /> */}
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
      </EffectComposer>
    </>
  );
}
export const Cube = ({
  envMapIntensity,
  cube,
  scale = 1,
  visible = true,
  cubeAxis,
  ...rest
}) => {
  return cubeAxis ? (
    <PivotControls
      anchor={[0, 1, 0]}
      depthTest={false}
      lineWidth={4}
      axisColors={["#ccc", "red", "pink"]}
      scale={2}
      fixed={false}
      visible={cubeAxis}
    >
      <mesh
        castShadow
        ref={cube}
        raycast={meshBounds}
        position-x={-2}
        position-y={1}
        scale={scale}
        visible={visible}
        {...rest}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="mediumpurple"
          envMapIntensity={envMapIntensity}
        />
      </mesh>
    </PivotControls>
  ) : (
    <mesh
      castShadow
      raycast={meshBounds}
      ref={cube}
      position-y={1}
      position-x={-2}
      scale={scale}
      visible={visible}
      {...rest}
    >
      <boxGeometry />
      <meshStandardMaterial
        color="mediumpurple"
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
};
export const TextRender = () => {
  return (
    <Float speed={5} floatIntensity={10}>
      <Text
        fontSize={1}
        color="salmon"
        font="/typefaces/rubik-bubbles-v3-latin-regular.woff"
        position-y={3}
        maxWidth={2}
        textAlign="center"
      >
        LOVE R3F
      </Text>
      <Text3D
        size={0.5}
        height={0.5}
        position={[-1, 1, 3]}
        letterSpacing={0.1}
        font="/typefaces/optimer_bold.typeface.json"
      >
        Text 3D
        <meshStandardMaterial color="aqua" />
      </Text3D>
    </Float>
  );
};
// drei 内置 preset 直接可用 <Environment preset="apartment|city|...."/>
//   apartment: "lebombo_1k.hdr",
//   city: "potsdamer_platz_1k.hdr",
//   dawn: "kiara_1_dawn_1k.hdr",
//   forest: "forest_slope_1k.hdr",
//   lobby: "st_fagans_interior_1k.hdr",
//   night: "dikhololo_night_1k.hdr",
//   park: "rooitou_park_1k.hdr",
//   studio: "studio_small_03_1k.hdr",
//   sunset: "venice_sunset_1k.hdr",
//   warehouse: "empty_warehouse_01_1k.hdr",
