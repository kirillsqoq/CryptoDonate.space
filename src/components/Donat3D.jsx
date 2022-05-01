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

import { Donat } from "./App3D";
export function Donat3D() {
	return (
		<>
			<div id='donat3d'>
				<Canvas
					shadows
					dpr={[1, 2]}
					camera={{ position: [0, 0, 70], fov: 50 }}>
					<color attach='background' args={["#202124"]} />
					<ambientLight intensity={1} />

					<spotLight
						intensity={0.5}
						angle={0.1}
						penumbra={1}
						position={[10, 15, 10]}
					/>
					<Suspense fallback={null}>
						<group position={[25, 20, 0]}>
							<group scale={0.8} position={[-55, 0, 0]}>
								<Donat />
							</group>
							<Text
								position={[-17, 0, 0]}
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								fontSize={5}
								// fillOpacity={10}

								anchorX='right' // default
								anchorY='middle' // default
								// color='#ffffff'
							>
								Username:
							</Text>
							<Text
								position={[8, 0, 0]}
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								fontSize={5}
								// fillOpacity={10}
								color='green'
								anchorX='right' // default
								anchorY='middle' // default
								// color='#ffffff'
							>
								0.005 btc
							</Text>
							<Text
								maxWidth={50}
								position={[7, -10, 0]}
								font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
								fontSize={2}
								// fillOpacity={10}
								color='white'
								anchorX='right' // default
								anchorY='middle' // default
								// color='#ffffff'
							>
								Build powerful apps. Spin up your backend
								without managing servers. Effortlessly scale to
								support millions of users with Firebase
								databases, machine learning infrastructure,
								hosting and storage solutions, and Cloud
								Functions.
							</Text>
						</group>
					</Suspense>
				</Canvas>
			</div>
		</>
	);
}
