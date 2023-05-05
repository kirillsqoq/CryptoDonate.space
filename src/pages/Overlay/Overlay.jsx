import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";
import { collection, getFirestore, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
	Text,
	Card,
	createTheme,
	NextUIProvider,
	Container,
	Spacer,
	Loading,
} from "@nextui-org/react";
import { Flex } from "@adobe/react-spectrum";

const darkThemeNext = createTheme({
	type: "dark",
	theme: {
		colors: {
			background: "rgba(255, 255, 255, 0)",
		},
	},
});

function ticketFilter(tickets_value) {
	const arr = [];
	const arrConfirm = [];
	tickets_value.docs.map((doc) => arr.push(doc.data()));
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].status == "confirm") {
			arrConfirm.push(arr[i]);
		}
	}

	return arrConfirm;
}
function DonateAlert(props) {
	const { auth, app, db, setValue, setTickets, user_value, tickets_value } =
		useStore((state) => state);

	const [count, setCount] = useState(0);
	const [visibility, setVisibility] = useState("hidden");

	useEffect(() => {
		if (tickets_value) {
			setCount(ticketFilter(tickets_value).length);
		}
	});
	//
	useEffect(() => {
		console.log(tickets_value);
	}, [tickets_value]);
	//
	useEffect(() => {
		// console.log("new donate");
		setVisibility("visible");
	}, [count]);

	useEffect(() => {
		if (visibility == "visible") {
			setTimeout(() => {
				setVisibility("hidden");
			}, 8000);
		}
	}, [visibility]);

	// if (loading) {
	// 	return (
	// 		<>
	// 			<Container>
	// 				<Loading size='lg' />
	// 			</Container>
	// 		</>
	// 	);
	// }

	if (user_value.data() != undefined && tickets_value) {
		const confirmTickets = ticketFilter(tickets_value);

		if (confirmTickets.length == 0) {
			return <TestDonate />;
		}
		return <LastDonate />;
	}

	return <h1>Overlay not found</h1>;
}

export function TestDonate() {
	const { auth, app, db, setValue, setTickets, user_value, tickets_value } =
		useStore((state) => state);

	return (
		<>
			<>
				<Container
					css={{
						visibility: visibility,
					}}>
					<Container>
						<>
							<Container>
								<Card css={{ width: "fit-content" }}>
									{/* <Text color='primary'>{doc.status}</Text> */}

									<Flex direction={"row"}>
										<Text
											h1
											css={{
												marginRight: "$10",
												textGradient:
													"0deg, $black -20%, $white 60%",
											}}
											weight='bold'>
											Username
										</Text>
										<Spacer />
										<Text
											h1
											css={{
												marginTop: "$",
												textGradient:
													"45deg, #7FFF00 -20%, #7FFF00 50%",
											}}
											weight='bold'>
											$0{" "}
										</Text>
									</Flex>

									{user_value.data().showMessage == true && (
										<Text h2>Test donate</Text>
									)}
								</Card>
							</Container>
						</>
					</Container>
				</Container>
			</>
		</>
	);
}

export function LastDonate() {
	const { auth, app, db, setValue, setTickets, user_value, tickets_value } =
		useStore((state) => state);

	const [visibility, setVisibility] = useState("hidden");
	return (
		<>
			{user_value.data().alert == true && (
				<Container css={{ visibility: visibility }}>
					<Container>
						<>
							<Container>
								<Card css={{ width: "fit-content" }}>
									{/* <Text color='primary'>{doc.status}</Text> */}
									<Flex>
										<Text
											h1
											css={{
												marginRight: "$10",
												textGradient:
													"0deg, $black -20%, $white 60%",
											}}
											weight='bold'>
											{
												confirmTickets[
													confirmTickets.length - 1
												].name
											}
										</Text>
										<Spacer />
										<Text
											h1
											css={{
												textGradient:
													"45deg, #7FFF00 -20%, #7FFF00 50%",
											}}
											weight='bold'>
											$
											{
												confirmTickets[
													confirmTickets.length - 1
												].usdAmount
											}{" "}
										</Text>
									</Flex>

									{user_value.data().showMessage == true && (
										<Text h2>
											{
												confirmTickets[
													confirmTickets.length - 1
												].msg
											}
										</Text>
									)}
								</Card>
							</Container>
						</>
					</Container>
				</Container>
			)}
		</>
	);
}

function Overlay() {
	const { id } = useParams();

	return (
		<>
			<Container>
				<NextUIProvider theme={darkThemeNext}></NextUIProvider>
				<DonateAlert id={id ? id : "user_not_found"} />
			</Container>
		</>
	);
}

export default Overlay;
