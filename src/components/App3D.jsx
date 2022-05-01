import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	ContactShadows,
	Environment,
	useGLTF,
	OrbitControls,
	Torus,
	Text,
} from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import { proxy, useSnapshot } from "valtio";

export function Donat(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef();
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.z += 0.008));
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<Torus ref={ref} args={[5, 2, 16, 40]}>
			<meshNormalMaterial attach='material' wireframe />
		</Torus>
	);
}

export function App3D() {
	console.log("Render App 3D");

	return (
		<>
			<div id='app3d'>
				<Canvas
					shadows
					dpr={[1, 2]}
					camera={{ position: [0, 0, 70], fov: 50 }}>
					<color attach='background' args={["#17171b"]} />
					<ambientLight intensity={1} />

					<spotLight
						intensity={0.5}
						angle={0.1}
						penumbra={1}
						position={[10, 15, 10]}
					/>
					<Suspense fallback={null}>
						<group position={[10, 15, 0]}>
							<Text
								position={[-17, 0, 0]}
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								fontSize={10}
								fillOpacity={0}
								strokeWidth={"2.5%"}
								strokeColor='#ffffff'
								anchorX='right' // default
								anchorY='middle' // default
								color='#f297be'>
								CRYPTO
							</Text>
							<Text
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								position={[-10, 0, 0]}
								scale={100}
								anchorX='right' // default
								anchorY='middle' // default
								color='white'>
								D
							</Text>
							<Text
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								position={[10, 0, 0]}
								scale={100}
								anchorX='left' // default
								anchorY='middle' // default
							>
								NAT
							</Text>
							<Text
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								position={[-13, -12, 0]}
								scale={32}>
								Receive crypto donations while streaming with
								OBS Studio
							</Text>
							<Donat />
							{/* <Environment preset='city' /> */}
							{/* <ContactShadows
						rotation-x={Math.PI / 2}
						position={[0, -0.8, 0]}
						opacity={0.25}
						width={10}
						height={10}
						blur={1.5}
						far={0.8}
					/> */}
						</group>
					</Suspense>
				</Canvas>
			</div>
		</>
	);
}
