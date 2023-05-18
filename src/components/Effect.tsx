import { useControls } from 'leva';
import React, { useEffect, useRef, VFC } from 'react';
import { EffectComposer, RenderPass, ShaderPass } from 'three-stdlib';
import { extend, useFrame, useThree, useLoader } from '@react-three/fiber';
import { DistortionPass } from './postprocessing/DistortionPass';
import { RipplePass } from './postprocessing/RipplePass';
import { LUTCubeLoader } from 'postprocessing'

extend({ EffectComposer, RenderPass, ShaderPass })

export const Effect: VFC = () => {
	const textureCube = useLoader(LUTCubeLoader, '/F-6800-STD.cube')
	const dist_datas = useControls('Distortion', {
		enabled: true,
		progress: { value: 0, min: 0, max: 1, step: 0.01 },
		scale: { value: 1, min: 0, max: 5, step: 0.01 }
	})

	const ripple_datas = useControls('Ripple', {
		enabled: true
	})

	const composerRef = useRef<EffectComposer>(null)
	const { gl, scene, camera, size } = useThree()

	useEffect(() => {
		composerRef.current!.setSize(size.width, size.height)
	}, [size])

	useFrame(() => {
		composerRef.current!.render()
	}, 1)

	return (
		<effectComposer
			ref={composerRef} args={[gl]}
		>
			<SSR {...props} />
			<Bloom luminanceThreshold={0.5} mipmapBlur luminanceSmoothing={0} intensity={1.5} />
			<LUT lut={textureCube} />
			<Vignette eskil={false} offset={0.1} darkness={1.1} />
			<renderPass attachArray="passes" args={[scene, camera]} />
			<DistortionPass {...dist_datas} />
			<RipplePass {...ripple_datas} />
		</effectComposer>
	)
}
