import create from "zustand";
import { app, db } from "./index";
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	doc,
	setDoc,
} from "firebase/firestore";
export const useStore = create((set) => ({
	appRef: undefined,
	bears: 0,
	data: "",
	balance: "",
	setApp: (app) => set((state) => ({ appRef: setAppFunc(app) })),

	setData: (value) => set((state) => ({ data: setDataFunc(value) })),

	setBalance: (value, user) =>
		set((state) => ({ balance: setBalanceFunc(value, user) })),
	removeAllBears: () => set({ bears: 0 }),
}));

function setAppFunc(app) {
	return app;
}
function setDataFunc(value) {
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
			const myAddress = await addresses.getAddress({ address });
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

function setBalanceFunc(value, user) {
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
	setDoc(
		doc(db, "users", "5OYCcy92SaMrGeh2DAZQo5FaUdU2"),
		{
			balance: balance / 100000000,
			myAddressTxs: myAddressTxs,
			myAddressTxsMempool: addressTxsMempool,
		},
		{ merge: true }
	);
}
