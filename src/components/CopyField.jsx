import React, { useRef, useState, useContext, useEffect } from "react";

import {
	TextField,
	ActionButton,
	DialogTrigger,
	AlertDialog,
	View,
	Form,
	Heading,
} from "@adobe/react-spectrum";
import Copy from "@spectrum-icons/workflow/Copy";

export function CopyField(props) {
	let [isValid, setValid] = useState(false);
	useEffect(() => {
		if (isValid) {
			setTimeout(() => {
				setValid(false);
			}, 3000);
		}
	}, [isValid]);

	return (
		<>
			<DialogTrigger>
				<ActionButton marginX={10}>Open My Links</ActionButton>
				<AlertDialog
					variant='confirmation'
					title='My links'
					primaryActionLabel='Confirm'>
					<Heading>Donation Link</Heading>

					<View>
						<TextField
							width='350px'
							onCopy={() => setValid(!isValid)}
							inputMode='url'
							defaultValue={`cryptodonat.com/${props.user.uid}`}
							isReadOnly
							labelPosition='side'
							labelAlign='end'
							// validationState={isValid ? "valid" : ""}
						/>
						<ActionButton onPress={() => setValid(!isValid)}>
							<Copy aria-label='Icon only' />
							{/* <Text>Copy</Text> */}
						</ActionButton>
					</View>
					<Heading>OBS Sourse</Heading>
					<View>
						<TextField
							width='350px'
							onCopy={() => setValid(!isValid)}
							inputMode='url'
							isDisabled
							height={"size-2400"}
							defaultValue={`cryptodonat.com/${props.user.uid}`}
							maxWidth='100%'
							isReadOnly
							labelPosition='side'
							labelAlign='end'
							// validationState={isValid ? "valid" : ""}
						/>
						<ActionButton onPress={() => setValid(!isValid)}>
							<Copy aria-label='Icon only' />
							{/* <Text>Copy</Text> */}
						</ActionButton>
					</View>
				</AlertDialog>
			</DialogTrigger>
		</>
	);
}
