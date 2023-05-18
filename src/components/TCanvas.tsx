import React, { useState, Suspense, VFC } from 'react';
import { OrbitControls, useGLTF, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import ImageGenerationForm from './ImageGen'
import { Effect } from './Effect';
import { ImagePlane } from './ImagePlane';

export const TCanvas: VFC = () => {
	const [imageUrl, setImageUrl] = useState('/pexels-photo-2832432.jpg')

	const getItBack = async (url: any) => {
    // console.log('getItBack: ')
    const imageUrlBlob = url
    // console.log('imageUrl')
    // console.log(imageUrl)

    // effects.current.updateEffects()
    // effects.updateEffects()
    // console.log(effects)

    // console.log('image')
    // console.log(image)
    setImageUrl(String(imageUrlBlob))
    // setOutput([{ position: [0, 0, 0], rotation: [0, 0, 0], url: String(imageUrlBlob) }])
  }

	return (
		<>
			<ImageGenerationForm sendItBack={getItBack} />

			<Canvas
				camera={{
					position: [0, 0, 2],
					fov: 50,
					aspect: window.innerWidth / window.innerHeight,
					near: 0.1,
					far: 2000
				}}
				dpr={window.devicePixelRatio}
			>
				{/* canvas color */}
				<color attach="background" args={['#000']} />
				{/* camera controller */}
				<OrbitControls attach="orbitControls" />
				{/* helper */}
				<Stats />

				{/* spaceship */}
				<Suspense fallback={null}>
					<Hall position={[0, 0.7, 2]} rotation={[0, Math.PI / 2, 0]} />
				</Suspense>

				{/* object */}
				<Suspense fallback={null}>
					<ImagePlane />
				</Suspense>
				{/* effect */}
				<Effect />
			</Canvas>
		</>
	)
}

const Hall = ({ ...props }) => {
	const { scene } = useGLTF('/hall-transformed.glb') // spaceship, darth vader
	// const { scene } = useGLTF('/abandoned_warehouse_-_interior_scene.glb') // abandoned warehouse
	// const { scene } = useGLTF('/loop_animation_led_gallery.glb') // led_gallery
	return <primitive object={scene} {...props} />
}