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
import Add from "@spectrum-icons/workflow/Add";

import { Instruments } from "./Instruments";
import Copy from "@spectrum-icons/workflow/Copy";

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

export function Plugins(props) {
	const data = useStore((state) => state.data);
	const balance = useStore((state) => state.balance);
	const setBalance = useStore((state) => state.setBalance);
	const [status, setStatus] = "notify";
	const [ranges, setRanges] = useState([10, 100, 1000]);
	return (
		<>
			<Flex marginTop={"size-100"} direction={"row"}>
				<Tabs
					aria-label='Chat log orientation example'
					orientation='horizontal'>
					<TabList>
						<Item key='item1'>
							<Heading level={4}>Stats</Heading>
						</Item>
						<Item key='item2'>
							{" "}
							<Heading level={4}>Customize notify</Heading>
						</Item>
					</TabList>
					<TabPanels>
						<Item key='item1'>
							There is no prior chat history with John Doe.
						</Item>
						<Item key='item2'>
							There is no prior chat history with Jane Doe.
						</Item>
					</TabPanels>
				</Tabs>
			</Flex>
			<Instruments />
		</>
	);
}
