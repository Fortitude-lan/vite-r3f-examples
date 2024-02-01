import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect } from "react";
import { useControls } from "leva";

export default function Racoon() {
  const r = useGLTF("/models/raccoon_gltf/racoon_animation.gltf");
  const animation = useAnimations(r.animations, r.scene);
  console.log(animation);
  const { animationName, position } = useControls('racoon',{
    animationName: { options: ["跑", "搓手"] },
    position: [0, -0.89, 0.5],
  });

  useEffect(() => {
    const action = animation.actions[animationName];
    console.log("racoon", action);
    action.reset().fadeIn(0.5).play();

    // window.setTimeout(() => {
    //   animation.actions['跑'].play();
    //   animation.actions['跑'].crossFadeFrom(action, 1);
    // }, 2000);
    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive
      object={r.scene}
      rotation-y={0.3}
      scale={0.5}
      position={[0, -0.95, 1]}
    />
  );
}
