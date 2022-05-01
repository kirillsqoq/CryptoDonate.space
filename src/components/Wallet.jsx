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
} from "firebase/firestore";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";

import {
	Divider,
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
	Text,
	Heading,
	Header,
	Checkbox,
	Switch,
	CheckboxGroup,
	TextField,
	Content,
	NumberField,
} from "@adobe/react-spectrum";
import { useStore } from "../store";
import Refresh from "@spectrum-icons/workflow/Refresh";

import GlobeOutline from "@spectrum-icons/workflow/GlobeOutline";
import Delete from "@spectrum-icons/workflow/Delete";

export function Wallet(props) {
	const data = useStore((state) => state.data);
	const balance = useStore((state) => state.balance);
	const setBalance = useStore((state) => state.setBalance);
	// console.log(props.value && props.value.data());
	// props.tickets && props.tickets.docs.map((doc) => console.log(doc.data()));

	return (
		<>
			<DialogTrigger>
				<ActionButton marginX={"size-100"}>Wallet</ActionButton>

				<AlertDialog
					title='Settings '
					primaryActionLabel='Confirm'
					variant='confirmation'>
					<View
						// borderWidth='thin'
						borderColor='dark'
						// borderRadius='large'
						backgroundColor='gray-200'
						padding='size-200'
						gridArea='toc'
						minHeight='size-1000'
						isHidden={{ base: true, L: false }}>
						{/* <Controls /> */}
						{/* <BearCounter /> */}
						<View
							// margin={"size-200"}
							borderColor='dark'
							borderRadius='large'
							gridArea='nav'>
							<Heading>
								{props.value && props.value.data().balance}
							</Heading>
							<Heading>
								{props.value && props.value.data().myAdressTxs}
							</Heading>

							<ActionButton
								marginX={"size-100"}
								onPress={() =>
									setBalance(props.value, props.user)
								}>
								<Refresh />
							</ActionButton>
						</View>
						{props.tickets && (
							<Flex direction={"column-reverse"}>
								{props.tickets.docs.map((doc) => (
									<React.Fragment key={doc.id}>
										<View
											margin={"size-200"}
											borderColor='dark'
											borderRadius='large'
											backgroundColor='gray-400'
											gridArea='nav'>
											<Flex
												alignItems={"center"}
												justifyContent={"space-around"}>
												<Heading>
													{doc.data().name}
												</Heading>
												<Heading level={4}>
													{doc.data().amount} BTC
												</Heading>
												<StatusLight variant='notice'>
													{doc.data().status}
												</StatusLight>
												<ActionButton isQuiet>
													<Delete />
												</ActionButton>
											</Flex>
										</View>
									</React.Fragment>
								))}
							</Flex>
						)}
					</View>
				</AlertDialog>
			</DialogTrigger>
		</>
	);
}
