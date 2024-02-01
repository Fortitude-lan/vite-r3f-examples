import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect } from "react";
import { useControls } from "leva";

export default function Fox() {
  const fox = useGLTF("/models/Fox/glTF/Fox.gltf");
  const animation = useAnimations(fox.animations, fox.scene);
  const { animationName,position } = useControls('fox',{
    animationName: { options: ["Survey", "Walk", "Run"] },
    position:[0,-0.89,0.5]
  });

  useEffect(() => {
    const action = animation.actions[animationName];
    console.log('fox',action);
    action.reset().fadeIn(0.5).play();

    //     window.setTimeout(() => {
    //       animation.actions.Walk.play();
    //       animation.actions.Walk.crossFadeFrom(action, 1);
    //     }, 2000);
    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive
      object={fox.scene}
      rotation-y={0.3}
      scale={0.005}
      position={position}
    />
  );
}
