import React, { VFC, useState } from 'react';
import * as THREE from 'three';
import { Plane, useTexture } from '@react-three/drei';

type ImageProps = {
	imagePath: string
}

export const ImagePlane: VFC<ImageProps> = ({ imagePath }) => {
	const texture = useTexture(imagePath);
	const [hovered, hover] = useState(false);

	const material = (texture: THREE.Texture) =>
		new THREE.ShaderMaterial({
			uniforms: {
				u_texture: { value: texture }
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		})

	return (
		<>
			<mesh
				onPointerOver={(e) => (e.stopPropagation(), hover(true))}
				onPointerOut={() => hover(false)}
				scale={[2, 2, 0.05]}
				position={[0, 0, 0]}
			>
				<Plane args={[1, 1]} material={material(texture)} position={[0, 0, 0.7]} />
			</mesh>
		</>
	)
}

// --------------------------------------------------------
const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_texture, v_uv);
  gl_FragColor = color;
}
`
