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
import { useAuthState } from "react-firebase-hooks/auth";

import { Flex } from "@adobe/react-spectrum";
import { ticketFilter } from "../../utils/stats";
const darkThemeNext = createTheme({
	type: "dark",
	theme: {
		colors: {
			background: "rgba(255, 255, 255, 0)",
		},
	},
});

function DonateAlert(props) {
	console.log(props.id);
	const { auth, app, db, user_value, tickets_value } = useStore(
		(state) => state
	);

	const [value, loading, error] = useDocument(
		doc(getFirestore(app), "users", props.id),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [valueTickets, loadingTickets, errorTickets] = useCollection(
		collection(getFirestore(app), "users", props.id, "tickets/"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [count, setCount] = useState(0);
	const [visibility, setVisibility] = useState("hidden");

	useEffect(() => {
		if (valueTickets) {
			setCount(ticketFilter(valueTickets).length);
		}
	});
	//
	useEffect(() => {
		console.log(valueTickets);
	}, [valueTickets]);
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

	if (loading) {
		return (
			<>
				<Container>
					<Loading size='lg' />
				</Container>
			</>
		);
	}

	if (value.data() != undefined && valueTickets) {
		const confirmTickets = ticketFilter(valueTickets);

		if (confirmTickets.length == 0) {
			return (
				<TestDonate
					visibility={visibility}
					value={value}
					valueTickets={valueTickets}
					confirmTickets={confirmTickets}
				/>
			);
		}
		return (
			<LastDonate
				visibility={visibility}
				value={value}
				valueTickets={valueTickets}
				confirmTickets={confirmTickets}
			/>
		);
	}

	return <h1>Overlay not found</h1>;
}

export function TestDonate(props) {
	return (
		<>
			<>
				<Container
					css={{
						visibility: props.visibility,
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

									{props.value.data().showMessage == true && (
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

export function LastDonate(props) {
	const [visibility, setVisibility] = useState("hidden");
	return (
		<>
			{props.value.data().alert == true && (
				<Container css={{ visibility: props.visibility }}>
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
												props.confirmTickets[
													props.confirmTickets
														.length - 1
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
												props.confirmTickets[
													props.confirmTickets
														.length - 1
												].usdAmount
											}{" "}
										</Text>
									</Flex>

									{props.value.data().showMessage == true && (
										<Text h2>
											{
												props.confirmTickets[
													props.confirmTickets
														.length - 1
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
