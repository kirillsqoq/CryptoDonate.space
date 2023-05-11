import React, { useRef, useState, useEffect, useContext } from "react";

import { Flex } from "@adobe/react-spectrum";
import { Card, Text } from "@nextui-org/react";
import { LineChart, Line, Tooltip } from "recharts";
import { format } from "fecha";
import { useStore } from "../../../../../store";
import {
	getLastMounthDonates,
	sum,
	countDonate,
	ticketFilter,
	lineRef,
} from "../../../../../utils/utils";

function CustomTooltip({ payload, label, active }) {
	if (active) {
		if (payload != null) {
			return (
				<Card css={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
					<Text color='success' h3>{`$${payload[0].value}`}</Text>
					<Text h5>{`${payload[0].payload.name} `}</Text>
				</Card>
			);
		}
	}

	return null;
}
export function StatsTab() {
	return (
		<>
			<Flex justifyContent={"left"} alignItems='center'>
				<Card
					css={{
						width: "min-content",
						margin: "$10",
						backgroundColor: "$accents2",
					}}>
					<Flex justifyContent={"space-around"}>
						<DonationsCount />
						<AmountLabel />
					</Flex>
					<EarningLineChart />
					<MonthLabel />
				</Card>
			</Flex>
		</>
	);
}

export function MonthLabel() {
	return (
		<>
			<Text
				h2
				css={{
					fontWeight: "bold",
					padding: "20px",
					textGradient: "45deg, $blue500 -20%, $pink500 50%",
				}}>
				{format(new Date(), "MMMM YYYY")}
			</Text>
		</>
	);
}

export function AmountLabel() {
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);
	const confirmTickets = ticketFilter(tickets_value);
	const [mounth, setMounth] = useState(format(new Date(), "MMMM"));
	return (
		<>
			<Text
				h1
				size={80}
				css={{
					padding: "20px",
					textGradient: "45deg, $blue500 -20%, $green500 50%",
				}}
				weight='bold'>
				${sum(confirmTickets, mounth)}
			</Text>
		</>
	);
}

export function DonationsCount() {
	const { auth, app, db, user, user_value, tickets_value } = useStore(
		(state) => state
	);

	const confirmTickets = ticketFilter(tickets_value);
	const [mounth, setMounth] = useState(format(new Date(), "MMMM"));

	return (
		<>
			<Flex alignItems='center' justifyContent='space-between'>
				<Text
					h1
					// size={100}
					css={{
						marginBottom: "$0",
						textGradient: "45deg, $blue500 -20%, $blue400 50%",
					}}
					weight='bold'>
					{countDonate(confirmTickets, mounth)}
				</Text>
				<Text
					h2
					weight={"bold"}
					css={{
						marginTop: "$4",

						marginLeft: "$8",
						textGradient: "45deg, $blue500 -20%, $blue400 50%",
					}}>
					donations
				</Text>
			</Flex>
		</>
	);
}

export function EarningLineChart() {
	const { tickets_value } = useStore((state) => state);
	const confirmTickets = ticketFilter(tickets_value);
	const [mounth, setMounth] = useState(format(new Date(), "MMMM"));
	return (
		<>
			{countDonate(confirmTickets, mounth) == 0 && (
				<LineChart width={500} height={150} data={lineRef}>
					<Tooltip
						dataKey='name'
						content={<CustomTooltip />}
						cursor={false}
					/>
					<Line
						type='monotone'
						dataKey='pv'
						stroke='#8884d8'
						strokeWidth={5}
					/>
				</LineChart>
			)}
			{getLastMounthDonates(confirmTickets, mounth) &&
				getLastMounthDonates(confirmTickets, mounth).length == 1 && (
					<LineChart
						width={500}
						height={150}
						data={[
							{
								name: "Yesterday",
								pv: 0,
							},
						].concat(getLastMounthDonates(confirmTickets, mounth))}>
						<Tooltip
							dataKey='name'
							content={<CustomTooltip />}
							cursor={false}
							// contentStyle={{
							// 	border: "0px",
							// 	backgroundColor:
							// 		"rgba(0,0,0,0)",
							// }}
						/>
						<Line
							type='monotone'
							dataKey='pv'
							stroke='#8884d8'
							strokeWidth={5}
						/>
					</LineChart>
				)}

			{getLastMounthDonates(confirmTickets, mounth) &&
				getLastMounthDonates(confirmTickets, mounth).length > 1 && (
					<LineChart
						width={500}
						height={150}
						data={getLastMounthDonates(confirmTickets, mounth)}>
						<Tooltip
							dataKey='name'
							content={<CustomTooltip />}
							cursor={false}
							// contentStyle={{
							// 	border: "0px",
							// 	backgroundColor:
							// 		"rgba(0,0,0,0)",
							// }}
						/>
						<Line
							type='monotone'
							dataKey='pv'
							stroke='#8884d8'
							strokeWidth={5}
						/>
					</LineChart>
				)}
		</>
	);
}
