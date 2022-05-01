import React, { useRef, useState, useEffect, useContext } from "react";

import {
	useCollectionData,
	useCollection,
	useDocument,
} from "react-firebase-hooks/firestore";

import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	doc,
	setDoc,
	deleteDoc,
} from "firebase/firestore";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";

import {
	Divider,
	TabList,
	Tabs,
	TabPanels,
	IllustratedMessage,
	Item,
	ActionGroup,
	Button,
	defaultTheme,
	Provider,
	View,
	Grid,
	DialogTrigger,
	AlertDialog,
	StatusLight,
	Flex,
	ActionButton,
	Heading,
	Header,
	Switch,
	CheckboxGroup,
	TextField,
	Content,
	NumberField,
} from "@adobe/react-spectrum";
import { Card, Text, Checkbox, Container } from "@nextui-org/react";
import { useStore } from "../store";
import Refresh from "@spectrum-icons/workflow/Refresh";

import GlobeOutline from "@spectrum-icons/workflow/GlobeOutline";
import Delete from "@spectrum-icons/workflow/Delete";
import Orbit from "@spectrum-icons/workflow/Orbit";

function getLastInputs(adress, value, wallet) {
	if (adress == wallet) {
		return value;
	}
}

function getConfirmationTickets(ticket, lastInputs, db) {
	if (ticket.amount == (lastInputs / 100000000).toString()) {
		console.log(ticket, lastInputs / 100000000);

		setDoc(
			doc(db, "users", ticket.recipientID, "tickets/" + ticket.time),

			{
				status: "confirm",
				statusColor: "positive",
			},
			{ merge: true }
		);
	}
}

function comparer(lastInputs, tickets, db) {
	tickets &&
		tickets.docs.map((doc) =>
			getConfirmationTickets(doc.data(), lastInputs, db)
		);
}

function changeStatus(value, tickets, db) {
	console.log("смена статуса");

	value &&
		value.data().myAddressTxsMempool.map((v) => {
			v.vout.map((vout) =>
				comparer(
					getLastInputs(
						vout.scriptpubkey_address,
						vout.value,
						value.data().wallet
					),
					tickets,
					db
				)
			);
		});

	return null;
}

async function delDoc(doc) {
	await deleteDoc(doc.ref);
}

export function Donations(props) {
	const data = useStore((state) => state.data);
	const balance = useStore((state) => state.balance);
	const setBalance = useStore((state) => state.setBalance);
	const [status, setStatus] = "notify";
	const [helpCount, setHelpCount] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setHelpCount(helpCount + 1);
		}, 25000);
		return () => clearInterval(interval);
	}, [helpCount]);

	useEffect(() => {
		console.log(helpCount);
		setBalance(props.value, props.user);
		changeStatus(props.value, props.tickets, props.db);
	}, [helpCount]);

	return (
		<>
			<View
				// borderWidth='thin'
				// borderColor='dark'
				borderRadius='large'
				gridArea='toc'>
				<Container css={{ backgroundColor: "rgba(0,0,0,0)" }}>
					{/* <Controls /> */}
					{/* <BearCounter /> */}
					{/* <Container>kek</Container> */}

					{/* <Container direction='row'>
						<ActionButton
							isQuiet
							marginX={"size-100"}
							onPress={() => setBalance(props.value, props.user)}>
							<Refresh />
						</ActionButton>

						<ActionButton
							isQuiet
							marginX={"size-100"}
							onPress={() =>
								changeStatus(
									props.value,
									props.tickets,
									props.db
								)
							}>
							<Orbit />
						</ActionButton>
					</Container> */}

					{props.tickets && (
						<div id='donations'>
							<Flex direction={"column-reverse"}>
								{props.tickets.docs.map((doc) => (
									<React.Fragment key={doc.id}>
										<Container
											css={{
												padding: "$6",
												width: "92%",
												borderRadius: "$lg",
												backgroundColor: "$accents1",
												margin: "$5",
											}}>
											<Flex
												alignItems={"center"}
												justifyContent={"space-around"}>
												<Flex direction='row'>
													<StatusLight
														marginTop={"size-125"}
														variant={
															doc.data()
																.statusColor
														}></StatusLight>

													<Text
														color='success'
														h5
														weight='bold'
														css={{
															marginTop: 8,
														}}>
														{doc.data().amount} BTC
													</Text>
												</Flex>
												<Text h4 weight={"bold"}>
													{doc.data().name}
												</Text>

												<ActionButton
													onPress={() => delDoc(doc)}
													isQuiet>
													<Delete />
												</ActionButton>
											</Flex>
											<Container padding={"size-160"}>
												<Text>{doc.data().msg}</Text>
											</Container>
										</Container>
									</React.Fragment>
								))}
							</Flex>
						</div>
					)}

					<View
						// margin={"size-200"}
						// borderColor='dark'
						borderRadius='large'
						gridArea='nav'>
						<Heading>
							{/* {props.value && props.value.data().balance} */}
						</Heading>
						<Heading>
							{props.value && props.value.data().myAdressTxs}
						</Heading>
						{props.tickets &&
							props.tickets.docs.map((doc) => (
								<Text key={doc.id}>{doc.data().staus}</Text>
							))}
					</View>
				</Container>

				{/* <IllustratedMessage>
					<NoSearchResults />
					<Heading level={2}>Donations not found</Heading>
					<Content>Don't forget to share the donation link</Content>
					<View>
						<Button marginX={"size-115"} marginY={"size-175"}>
							Copy link
						</Button>

						<ActionButton
							onPress={() =>
								window.open(
									"http://localhost:8080/" + props.user.uid
								)
							}
							isQuiet
							marginY={"size-175"}
							aria-label='Icon only'>
							<GlobeOutline />
						</ActionButton>
					</View>
				</IllustratedMessage> */}
			</View>
			{/* <View
				// borderWidth='thin'
				// borderColor='dark'
				borderRadius='large'
				backgroundColor='gray-200'
				gridArea='footer'
				height='size-1600'
			/> */}
		</>
	);
}
