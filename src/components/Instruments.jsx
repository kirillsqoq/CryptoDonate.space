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
import { Card, Text, Checkbox, Container, Collapse } from "@nextui-org/react";
import { useStore } from "../store";
import Refresh from "@spectrum-icons/workflow/Refresh";

import GlobeOutline from "@spectrum-icons/workflow/GlobeOutline";
import Delete from "@spectrum-icons/workflow/Delete";
import Orbit from "@spectrum-icons/workflow/Orbit";
import Add from "@spectrum-icons/workflow/Add";
import { ColorWheel } from "@react-spectrum/color";

export function Instruments() {
	const [ranges, setRanges] = useState([10, 100, 1000]);
	return (
		<>
			<Flex marginTop={"size-100"} direction={"row"}></Flex>
		</>
	);
}
