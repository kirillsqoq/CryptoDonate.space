import create from "zustand";

import { app, db } from "./index";
import { getFirestore, doc, Timestamp, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config";

const firebase_app = initializeApp(firebaseConfig);
const firebase_auth = getAuth(firebase_app);
const firebase_db = getFirestore(firebase_app);

export const useStore = create((set) => ({
	app: firebase_app,
	auth: firebase_auth,
	db: firebase_db,
	user: undefined,
	user_value: undefined,
	tickets_value: undefined,
	data: "",
	balance: "",
	message_checkbox: "",
	alert_switch: "",
	// setApp: (app) => set((state) => ({ appRef: setAppFunc(app) })),
	// setData: (value) => set((state) => ({ data: setDataFunc(value) })),
	setBalance: (value, user) =>
		set((state) => ({ balance: setBalanceFunc(value, user) })),
	setUser: (user) => set((state) => ({ user: user })),
	setValue: (value) => set((state) => ({ user_value: value })),
	setTickets: (tickets) => set((state) => ({ tickets_value: tickets })),
}));
export const useDonationPageStore = create((set) => ({
	valueFirestore: undefined,
	valueTickets: undefined,
	ts: Timestamp.fromDate(new Date()).seconds.toString(),
	status: false,
	ticketId: uuidv4(),
	currentTicket: undefined,
	name: "no name",
	msg: "no message",
	amount: 0,
	btcAmount: 0,
	usdAmount: 0,
	setValueFirestore: (value) => set((state) => ({ valueFirestore: value })),
	setValueTickets: (value) => set((state) => ({ valueTickets: value })),
	setStatus: (value) => set((state) => ({ status: value })),
	setTicketId: (value) => set((state) => ({ ticketId: value })),
	setCurrentTicket: () =>
		set((state) => ({
			currentTicket: ticketFilter(
				state.valueTickets,
				state.ts,
				state.ticketId
			),
		})),
	setAmount: (value) => set((state) => ({ amount: value })),
	setUsdAmount: (value) => set((state) => ({ usdAmount: value })),
	setBtcAmount: (value) => set((state) => ({ btcAmount: value })),
	setName: (value) => set((state) => ({ name: value })),
	setMsg: (value) => set((state) => ({ msg: value })),
	reset: () =>
		set((state) => ({
			status: false,
			name: "no name",
			msg: "no message",
			ticketId: uuidv4(),
			amount: 0,
			btcAmount: 0,
		})),
}));

export function setDataFunc(value) {
	console.log(value && value.data());
	if (value) {
		console.log("value");
		console.log(value.data().wallet);

		const init = async () => {
			console.log(value.data().wallet);

			const {
				bitcoin: { addresses, transactions },
			} = mempoolJS({
				hostname: "mempool.space",
			});

			const address = value.data().wallet;
			const myAddressTxs = await addresses.getAddressTxs({ address });

			const addressTxsMempool = await addresses.getAddressTxsMempool({
				address,
			});
			console.log(addressTxsMempool);
			const txid = myAddressTxs[0].txid;
			const tx = await transactions.getTx({ txid });
		};

		init();
	}
	return "";
}

export function setBalanceFunc(value, user) {
	if (value) {
		console.log("value");
		console.log(value.data().wallet);
		console.log(user);

		const init = async () => {
			console.log(value.data().wallet);

			const {
				bitcoin: { addresses, transactions },
			} = mempoolJS({
				hostname: "mempool.space",
			});

			const address = value.data().wallet;
			const myAddress = await addresses.getAddress({ address });
			const myAddressTxs = await addresses.getAddressTxs({ address });

			const addressTxsMempool = await addresses.getAddressTxsMempool({
				address,
			});
			console.log(addressTxsMempool);
			console.log(myAddressTxs);

			const txid = myAddressTxs[0].txid;
			const tx = await transactions.getTx({ txid });

			const balance =
				myAddress.chain_stats.funded_txo_sum -
				myAddress.chain_stats.spent_txo_sum;
			console.log(balance);

			createUserData(db, user, balance, myAddressTxs, addressTxsMempool);
		};

		init();
	}
	return "";
}

function createUserData(db, user, balance, myAddressTxs, addressTxsMempool) {
	console.log(myAddressTxs, addressTxsMempool);

	setDoc(
		doc(db, "users", user.uid),
		{
			balance: balance / 100000000,
			myAddressTxs: myAddressTxs,
			myAddressTxsMempool: addressTxsMempool,
		},
		{ merge: true }
	);
}

function ticketFilter(valueTickets, ts, ticketId) {
	console.log(valueTickets, ts, ticketId);
	const arr = [];
	if (valueTickets) {
		valueTickets.docs.map((doc) => arr.push(doc.data()));
	}
	console.log(arr);
	console.log(ticketId);

	for (let i = 0; i < arr.length; i++) {
		if (arr[i].id == ticketId) {
			console.log(arr[i]);
			return arr[i];
		}
	}
	return null;
}
