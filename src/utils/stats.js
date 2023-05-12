import { format } from "fecha";
export function ticketFilter(valueTickets) {
	if (valueTickets) {
		const arr = [];
		const arrConfirm = [];
		valueTickets.docs.map((doc) => arr.push(doc.data()));
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].status == "confirm") {
				arrConfirm.push(arr[i]);
			}
		}

		return arrConfirm;
	}
	return null;
}

export function sum(confirmTickets, month) {
	if (confirmTickets && month) {
		const lastMounth = getLastMounthDonates(confirmTickets, month);
		// console.log(lastMounth);
		if (lastMounth.length == 0) {
			return 0;
		}
		let sum = 0;
		if (lastMounth.length > 0) {
			// console.log(lastMounth);
			for (let i = 0; i < lastMounth.length; i++) {
				sum += Number(lastMounth[i].pv);
			}
		}

		return sum;
	}
	return 0;
}
export function countDonate(confirmTickets, month) {
	if (confirmTickets && month) {
		return confirmTickets.length;
	}
	return 0;
}

export function getLastMounthDonates(confirmTickets, month) {
	if (confirmTickets) {
		// console.log(confirmTickets, month);
		const arr = [];
		for (let i = 0; i < confirmTickets.length; i++) {
			const date = format(
				new Date(Number(confirmTickets[i].time) * 1000),
				"MMMM"
			);
			// console.log(date, month);
			if (date == month) {
				// console.log(date, month);

				arr.push(confirmTickets[i]);
			}
		}

		const stonksDays = [];

		for (let i = 0; i < arr.length; i++) {
			stonksDays.push(format(new Date(arr[i].time * 1000), "DD"));
		}
		const uniqueStonksDays = stonksDays.filter(function (item, pos) {
			return stonksDays.indexOf(item) == pos;
		});
		// console.log(uniqueStonksDays);
		function sumDay(day) {
			let sum = 0;
			for (let i = 0; i < arr.length; i++) {
				if (
					format(new Date(arr[i].time * 1000), "DD") ==
					uniqueStonksDays[day]
				) {
					sum = sum + Number(arr[i].usdAmount);
				}
			}
			return { pv: sum, name: month + " " + uniqueStonksDays[day] };
		}
		const chartData = [];

		for (let i = 0; i < uniqueStonksDays.length; i++) {
			chartData.push(sumDay(i));
		}
		console.log(chartData);
		//далее необходимо заполнить график данными для каждого дня месяца

		let initData = [];
		for (let i = 1; i <= format(new Date(), "DD"); i++) {
			initData.push({
				name: `May ${i}`,
				pv: 0,
			});
		}
		chartData.forEach((v) => {
			initData.forEach((val, index) => {
				if (v.name == val.name) {
					initData[index] = v;
				}
			});
		});
		return initData;
	}
}
