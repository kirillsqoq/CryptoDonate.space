import React, { useRef, useState, useContext, useEffect } from "react";

import { useLocation, Navigate } from "react-router-dom";
import {
	Button,
	Spacer,
	Text,
	Input,
	Grid,
	Card,
	Container,
	Loading,
	Link,
} from "@nextui-org/react";
import {
	useCreateUserWithEmailAndPassword,
	useSignInWithEmailAndPassword,
	useUpdateProfile,
} from "react-firebase-hooks/auth";
import { ActionButton, Flex } from "@adobe/react-spectrum";
import { useStore } from "../../../store";

import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import ArrowLeft from "@spectrum-icons/workflow/ArrowLeft";
import { Logo } from "../../../shared/Logo";
import { TwitterLink } from "../../../shared/TwitterLink";
// import { ArrowLeftSquare } from "react-iconly";
const SignIn = (props) => {
	const [createUser, setCreateUser] = useState(false);
	const { auth } = useStore((state) => state);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const [updateProfile, updating, errorUpdate] = useUpdateProfile(auth);

	const [createUserWithEmailAndPassword, user, loading, error] =
		useCreateUserWithEmailAndPassword(auth);

	const [signInWithEmailAndPassword, user2, loading2, error2] =
		useSignInWithEmailAndPassword(auth);
	if (error2) {
		return (
			<Flex
				direction='column'
				alignItems={"center"}
				justifyContent={"center"}>
				<p>Error: {error2.message}</p>
				{props.backButton}
			</Flex>
		);
	}
	if (loading2) {
		return <Loading />;
	}

	if (error) {
		return (
			<Flex
				direction='column'
				alignItems={"center"}
				justifyContent={"center"}>
				<p>Error: {error.message}</p>
				{props.backButton}
			</Flex>
		);
	}
	if (loading) {
		return <Loading />;
	}
	if (user) {
		return (
			<div>
				<p>Registered User: {user.email}</p>
			</div>
		);
	}
	if (createUser == false) {
		return (
			<>
				<Card
					css={{
						padding: "$10",
						width: "fit-content",
						backgroundColor: "$accents1",
					}}>
					<Container css={{ width: "max-content" }} justify='center'>
						<Text
							h2
							css={{
								fontWeight: "$bold",
								textGradient:
									"0deg, $pink800 -40%, $pink500 50%",
							}}>
							Sign in with Email
						</Text>
					</Container>
					<Spacer y={3} />

					<Input
						status='default'
						labelPlaceholder='Email'
						bordered
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Spacer y={2.5} />
					<Input.Password
						bordered
						labelPlaceholder='Password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Spacer y={3} />
					<Flex justifyContent={"space-around"} alignItems='center'>
						<Button
							css={{
								fontSize: "$sm",
								fontWeight: "$bold",
							}}
							rounded
							color={"default"}
							onClick={() =>
								signInWithEmailAndPassword(email, password)
							}>
							Sign in
						</Button>
					</Flex>

					<Container css={{ width: "max-content" }} justify='center'>
						<Spacer y={2} />
						<Button
							onClick={() => setCreateUser(true)}
							flat
							css={{
								fontSize: "$md",
								fontWeight: "$bold",
							}}
							color='success'>
							Create account
						</Button>
					</Container>
				</Card>
				<Spacer />
				{props.backButton}
			</>
		);
	} else {
		return (
			<>
				<Card
					css={{
						padding: "$10",
						width: "fit-content",
						backgroundColor: "$accents1",
					}}>
					<Container css={{ width: "max-content" }} justify='center'>
						<Text
							h2
							css={{
								fontWeight: "$bold",
								textGradient:
									"0deg, $green800 -40%, $green500 50%",
							}}>
							Create account
						</Text>
					</Container>
					<Spacer y={1} />

					<Input
						status='default'
						label='Email'
						bordered
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Spacer y={1} />
					<Input.Password
						bordered
						label='Password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Spacer y={1} />

					<Flex
						direction={"column"}
						justifyContent={"space-around"}
						alignItems='center'>
						<Spacer y={2} />

						<Button
							onClick={() => {
								createUserWithEmailAndPassword(email, password);
							}}
							rounded
							css={{
								fontSize: "$md",
								fontWeight: "$bold",
							}}>
							Create
						</Button>
					</Flex>

					<Container
						css={{ width: "max-content" }}
						justify='center'></Container>
				</Card>
				<Spacer />
				<Link block onClick={() => setCreateUser(false)}>
					← Sign in with Email
				</Link>
			</>
		);
	}
};
export function Page() {
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);

	const login = async () => {
		// console.log("нажата кнопка Sign in with Google");
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth, provider);
		if (user) {
			// console.log(user);
			// console.log(
			// 	"Пользователь  авторизован, переадрессация на WorkSpace"
			// );
		}
		// console.log("получение пользователя");
		//после входа получаем юзера и выводим в консоль
		// console.log(user);
	};
	const [signUpWithEmail, setSignUpWithEmail] = useState(false);

	if (signUpWithEmail == false) {
		// console.log(false);
		return (
			<>
				<div id='container2'>
					<Flex
						direction={"column"}
						justifyContent='center'
						alignItems={"center"}>
						<Logo fontSize={50} pageLink={false} />
						<Spacer y={1} />

						{/* <App3D /> */}
						<Text h4 css={{ color: "$accents7" }}>
							Receive donations in cryptocurrency with messages
							from patrons.
						</Text>
						<Text h4 css={{ color: "$accents7" }}>
							Donations alerts during live broadcast with OBS
							Studio.
						</Text>
					</Flex>
				</div>
				<div id='page'>
					<Button shadow rounded onClick={login} id='go'>
						{/* <Link to='/signin'>Sign in with Google</Link> */}
						Sign in with Google
					</Button>
					<Spacer />
					<Spacer />

					<Button
						shadow
						rounded
						color={"secondary"}
						onClick={() => setSignUpWithEmail(true)}
						id='go'>
						Sign in with Email
					</Button>
					<Spacer y={6} />
					<TwitterLink />
					<div id='footerlogin'></div>
				</div>
			</>
		);
	} else {
		return (
			<>
				<div id='pageEmail'>
					<SignIn
						backButton={
							<Link
								block
								color={"primary"}
								onClick={() => setSignUpWithEmail(false)}>
								← Сhoose a login method
							</Link>
						}
					/>
				</div>
			</>
		);
	}
}
