import React, { useRef, useState, useEffect, useContext } from "react";
import { Context } from "../index";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useCollection,
	useDocument,
} from "react-firebase-hooks/firestore";

import { useLocation, Navigate } from "react-router-dom";
import { Donat3D } from "../components/Donat3D";
import { Page } from "../components/Page";
import { signOut } from "firebase/auth";
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	doc,
	setDoc,
} from "firebase/firestore";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";
import { ColorSlider } from "@react-spectrum/color";

import {
	Divider,
	IllustratedMessage,
	defaultTheme,
	Provider,
	View,
	Grid,
	DialogTrigger,
	AlertDialog,
	StatusLight,
	Flex,
	Heading,
	Header,
	CheckboxGroup,
	TextField,
	ActionButton,
	Content,
	NumberField,
	ContextualHelp,
} from "@adobe/react-spectrum";
import Copy from "@spectrum-icons/workflow/Copy";
import Settings from "@spectrum-icons/workflow/Settings";

import { useStore } from "./../store";
import Edit from "@spectrum-icons/workflow/Edit";
import Image from "@spectrum-icons/workflow/Image";
import Pan from "@spectrum-icons/workflow/Pan";
import Properties from "@spectrum-icons/workflow/Properties";
import Select from "@spectrum-icons/workflow/Select";
import Refresh from "@spectrum-icons/workflow/Refresh";

import GlobeGrid from "@spectrum-icons/workflow/GlobeGrid";
import GlobeOutline from "@spectrum-icons/workflow/GlobeOutline";

import { Donations } from "../components/Donations";

import Add from "@spectrum-icons/workflow/Add";
import ShareAndroid from "@spectrum-icons/workflow/ShareAndroid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Instruments } from "../components/Instruments";
import {
	Button,
	Switch,
	NextUIProvider,
	Checkbox,
	Card,
	Text,
	createTheme,
	Link,
	Container,
	Tooltip,
	Spacer,
} from "@nextui-org/react";
import OpenIn from "@spectrum-icons/workflow/OpenIn";
import Money from "@spectrum-icons/workflow/Money";
import LogOut from "@spectrum-icons/workflow/LogOut";
import { Plugins } from "../components/Plugins";
const darkTheme = createTheme({
	type: "dark",
	theme: {
		colors: {}, // optional
	},
});

function createUserData(db, user, wallet, username) {
	console.log(wallet);
	if (!wallet) {
		setDoc(doc(db, "users", user.uid), {
			id: user.uid,
			username: username,
			wallet: "",
		});
		return;
	}
	if (!username) {
		setDoc(doc(db, "users", user.uid), {
			id: user.uid,
			username: "",
			wallet: wallet,
		});
		return;
	}
	setDoc(doc(db, "users", user.uid), {
		id: user.uid,
		username: username,
		wallet: wallet,
	});
}
function searchTx(v, wallet) {
	if (v.scriptpubkey_address == wallet) {
		console.log(v, wallet);
		return v.value;
	}
}

export default function WorkSpace() {
	const bears = useStore((state) => state.bears);
	const data = useStore((state) => state.data);
	const setData = useStore((state) => state.setData);
	const balance = useStore((state) => state.balance);
	const setBalance = useStore((state) => state.setBalance);

	let [BTCWallet, setBTCWallet] = useState();
	const { auth, app, db } = useContext(Context);

	const [user] = useAuthState(auth);

	//база даннных, коллекция  users

	const [value, loading, error] = useDocument(
		doc(getFirestore(app), "users", user.uid),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);
	const [valueTickets, loadingTickets, errorTickets] = useCollection(
		collection(getFirestore(app), "users", user.uid, "tickets/"),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	let [link, setLink] = useState("http://localhost:8080/" + user.uid);
	let [username, setUsername] = useState();
	let [lastTx, setLastTx] = useState();
	let [copied, setCopied] = useState(false);
	let [copied2, setCopied2] = useState(false);

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	}, [copied]);
	useEffect(() => {
		if (copied2) {
			setTimeout(() => {
				setCopied2(false);
			}, 2000);
		}
	}, [copied2]);

	let [isValid, setValid] = useState(false);
	useEffect(() => {
		if (BTCWallet == "") {
			setValid(true);
		}
	}, []);

	if (user) {
		if (valueTickets) {
			// valueTickets.docs.map((doc) => console.log(doc.data()));
		}

		return (
			<>
				<Provider theme={defaultTheme}>
					<Grid
						areas={[
							"header header  header",
							"content    content toc",
						]}
						columns={["1fr", "1fr", "1fr"]}
						rows={["0.1fr", "auto"]}>
						<View
							gridArea='header'
							// borderWidth='thin'

							// height='size-900'
							margin={"size-100"}>
							<Container
								css={{
									width: "98%",
									backgroundColor: "$accents1",
									borderRadius: "$lg",
									padding: "$2",
								}}
								color={"default"}>
								<Flex
									direction={"row-reverse"}
									alignItems='center'
									justifyContent={"space-between"}
									marginY={"size-100"}
									marginStart='size-200'
									marginEnd='size-200'>
									<View>
										{/* <ActionButton
										marginX={"size-100"}
										onPress={() => setData(value)}>
										refresh data
									</ActionButton> */}
										<Flex>
											{/* <Wallet
										value={value}
										user={user}
										tickets={valueTickets}
									/> */}

											<CopyToClipboard
												text={
													"http://localhost:8080/" +
													user.uid
												}
												onCopy={() => setCopied2(true)}>
												{copied2 ? (
													<Button
														css={{
															marginRight: "$9",
														}}
														color='success'
														flat
														auto
														size='sm'>
														<Copy
															marginEnd={
																"size-100"
															}
														/>
														Copied!
													</Button>
												) : (
													<Tooltip
														color='invert'
														placement='bottom'
														content={
															"Don't forget to share this link"
														}>
														<Button
															css={{
																marginRight:
																	"$9",
															}}
															color={"secondary"}
															auto
															size='sm'>
															<Copy
																marginEnd={
																	"size-100"
																}
															/>
															Copy Donat Page link
														</Button>
													</Tooltip>
												)}
											</CopyToClipboard>
											<CopyToClipboard
												text={
													"http://localhost:8080/overlay/" +
													user.uid
												}
												onCopy={() => setCopied(true)}>
												{copied ? (
													<Button
														css={
															{
																// marginRight: "$9",
															}
														}
														flat
														color='success'
														auto
														size='sm'>
														<Copy
															marginEnd={
																"size-100"
															}
														/>
														Copied!
													</Button>
												) : (
													<Tooltip
														color='invert'
														placement='bottom'
														content={
															"Use this link as source in OBS Studio"
														}>
														<Button
															css={{}}
															color='secondary'
															auto
															size='sm'>
															<Copy
																marginX={
																	"size-100"
																}
															/>
															Copy Overlay link
														</Button>
													</Tooltip>
												)}
											</CopyToClipboard>

											<Button
												css={{
													marginLeft: "$10",
													// marginRight: "$10",
												}}
												flat
												color='error'
												auto
												size={"sm"}
												variant='cta'
												onPress={() => [
													signOut(auth),
													setTimeout(() => {
														window.location.reload();
													}, 16),
												]}>
												{/* <LogOut
													marginEnd={"size-100"}
												/> */}
												Sign Out
											</Button>
										</Flex>
									</View>
									<Flex
										direction={"row"}
										justifyContent='center'>
										<Link
											color={"error"}
											block
											css={{
												fontSize: 30,
												fontWeight: "$bold",
											}}>
											Cryptodonat [beta]
										</Link>
										<DialogTrigger>
											<ActionButton isQuiet>
												<Settings />
											</ActionButton>

											<AlertDialog
												onPrimaryAction={() => {
													createUserData(
														db,
														user,
														BTCWallet,
														username
													);
												}}
												variant='confirmation'
												title='Settings '
												primaryActionLabel='Confirm'>
												<Heading level={2}>
													Name
												</Heading>
												<View>
													<TextField
														onChange={setUsername}
														width='224px'
														label=''
														inputMode='url'
														defaultValue={
															value &&
															value.data()
																.username
														}
														// maxWidth='140%'

														labelPosition='side'
														labelAlign='end'
														validationState={
															"valid"
														}
													/>
												</View>
											</AlertDialog>
										</DialogTrigger>
										<DialogTrigger>
											<ActionButton isQuiet>
												<Money />
											</ActionButton>

											<AlertDialog
												onPrimaryAction={() => {
													createUserData(
														db,
														user,
														BTCWallet,
														username
													);
												}}
												variant='confirmation'
												title='Settings '
												primaryActionLabel='Confirm'>
												<Heading level={2}>
													Bitcoin address
												</Heading>
												<View>
													<TextField
														onChange={setBTCWallet}
														width='324px'
														label=''
														inputMode='url'
														defaultValue={
															value &&
															value.data().wallet
														}
														labelPosition='side'
														labelAlign='end'
														validationState={
															isValid
																? "invalid"
																: "valid"
														}
													/>
												</View>
											</AlertDialog>
										</DialogTrigger>
										<ActionButton
											isQuiet
											// css={{
											// 	marginRight: "20px",
											// }}

											onPress={() =>
												window.open(
													"http://localhost:8080/" +
														user.uid
												)
											}>
											<GlobeOutline />
										</ActionButton>
									</Flex>
								</Flex>
							</Container>
						</View>

						<View
							// borderWidth='thin'
							// borderColor='dark'
							height={"88vh"}
							margin={"size-100"}
							borderRadius='large'
							gridArea='content'>
							<Container
								css={{
									borderRadius: "$lg",
									backgroundColor: "$accents1",
									marginLeft: "$10",
									height: "99%",
									width: "100%",
								}}>
								<Flex direction={"column"}>
									<Plugins
										value={value}
										user={user}
										tickets={valueTickets}
										db={db}
									/>
									{/* <Flex
									alignItems={"center"}
									justifyContent={"left"}>
									<ActionButton
										marginX={"size-100"}
										onPress={() => setBalance(value, user)}>
										<Refresh />
										</ActionButton>
										<Heading>
										{value && value.data().balance}
										</Heading>
								</Flex> */}
									{/* <Heading>
									{value &&
										value.data().myAddressTxs[0].vout[1]
										.value / 100000000}
									</Heading> */}

									{/* <Switch size={"sm"} checked={true}></Switch>

<Divider size='M' />
<CheckboxGroup label='Options'>
<Checkbox size='sm' value='message'>
											Message
										</Checkbox>
										<Checkbox size='sm' value='username'>
										Username
										</Checkbox>
										<Checkbox size='sm' value='amount'>
											Amount
											</Checkbox>
											<Checkbox size='sm' value='voice'>
											Voice
											</Checkbox>
										<Checkbox size='sm' value='convert'>
										Convert to USD
										</Checkbox>
										<Checkbox size='sm' value='qr'>
											QR Code
										</Checkbox>
										<Checkbox size='sm' value='donat'>
											Donut
										</Checkbox>
										<Checkbox
										size='sm'
										isDisabled
											value='baketball'>
											Running line
										</Checkbox>
									</CheckboxGroup>

									<NumberField
										label='Minimum donation'
										minValue={1}
										defaultValue={45}
										formatOptions={{
											style: "currency",
											currency: "USD",
											currencyDisplay: "code",
											currencySign: "accounting",
										}}
									/>
									<NumberField
										minValue={3}
										label='Display time'
										defaultValue={10}
									/> */}
								</Flex>
							</Container>
							{/* <Container
								css={{
									marginTop: "$10",
									borderRadius: "$lg",
									backgroundColor: "$accents1",
									height: "35%",
									width: "95%",
								}}>
								<Instruments />
							</Container> */}
						</View>

						<Donations
							value={value}
							user={user}
							tickets={valueTickets}
							db={db}
						/>
						<NextUIProvider theme={darkTheme}></NextUIProvider>
					</Grid>
				</Provider>
			</>
		);
	} else {
		return <Navigate to={"/"} state={location} />;
	}
}
