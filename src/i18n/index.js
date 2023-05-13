/**
 * @param stringTokens - описание строки которую нужно интернационализировать.
 * @param variables - значение переменных
 * @param translations - объект с переводами
 * @param locale - локаль
 */

export function getI18nText({ stringTokens, variables, translations, locale }) {
	let result = "";
	stringTokens.forEach((token) => {
		if (Array.isArray(token)) {
			if (token[0] == "@date") {
				//
				result += date({ token, locale, variables });
			}
			if (token[0] == "@number") {
				result += number({ token, locale, variables });
			}
			if (token[0] == "@plural") {
				result += plural({
					token,
					locale,
					variables,
					translations,
				});
			}
			if (token[0] == "@list") {
				result += list({ token, locale, variables, translations });
			}
			if (token[0] == "@relativeTime") {
				result += relativeTime({ token, locale, variables });
			}
		} else {
			if (token[0] == "#") {
				result += translations[locale][token.slice(1)];
			} else if (token[0] == "$") {
				result += variables[token.slice(1)];
			} else {
				result += token;
			}
		}
	});
	return result;
}

function date({ token, locale }) {
	let dateToken = token[1];
	if (typeof token[1] == "string") {
		dateToken = Date.parse(token[1]);
	}

	let dateFormatter = new Intl.DateTimeFormat([locale], {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZoneName: "short",
		timeZone: "Europe/Moscow",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
	return dateFormatter.format(dateToken);
}

function number({ token, variables, locale }) {
	let value = 0;
	if (token[1][0] == "$") {
		value = variables[token[1].slice(1)];
	} else {
		value = token[1];
	}
	let numberFormatter = undefined;
	if (token[2]) {
		numberFormatter = new Intl.NumberFormat([locale], {
			style: "currency",
			currency: token[2],
		});
	} else {
		numberFormatter = new Intl.NumberFormat([locale], {});
	}

	return numberFormatter.format(value);
}

function plural({ token, locale, variables, translations }) {
	const pr = new Intl.PluralRules(locale);
	const formatOrdinals = (n) => {
		// отделить целую часть от десятичной и применить правило к целой части
		//целая часть
		let int = n;
		//дестичная часть
		let dec = "";
		string_n = String(n);
		if (!Number.isInteger(n)) {
			int = Math.floor(n);
			dec = string_n.slice(string_n.indexOf(".") + 1, string_n.length);
		}
		if (dec !== "") {
			dec = "," + dec;
		}

		// применяю правило к целой части
		const rule = pr.select(int);
		const pluralForms = translations[locale][token[1].slice(1)];
		const form = pluralForms[rule];
		//десятичная часть добавляется после запятой
		return `${int}${dec}${form}`;
	};
	return formatOrdinals(variables[token[2].slice(1)]);
}

function list({ token, locale, variables, translations }) {
	let arr = [];
	const formatter = new Intl.ListFormat(locale, {
		style: "long",
		type: "conjunction",
	});
	token.slice(1).forEach((arg) => {
		if (arg[0] == "$") {
			arr.push(variables[arg.slice(1)]);
		} else if (arg[0] == "#") {
			arr.push(translations[locale][arg.slice(1)]);
		} else {
			arr.push(arg);
		}
	});
	return formatter.format(arr);
}
function relativeTime({ token, locale }) {
	const formatter = new Intl.RelativeTimeFormat(locale);
	return formatter.format(token[1], token[2]);
}

// console.log(
// 	getI18nText({
// 		stringTokens: [["@date", 1676561884561]],
// 		locale: "ru-RU",
// 	})
// ); // четверг, 16 февраля 2023 г., 15:38:04 UTC);

// console.log(
// 	getI18nText({
// 		stringTokens: [["@number", 56789.01, "USD"]],
// 		locale: "ru-RU",
// 	}) // 56 789,01 $
// );

// console.log(
// 	getI18nText({
// 		stringTokens: [["@plural", "#day", "$tripDays"]],
// 		variables: { tripDays: 434.5 },
// 		translations: {
// 			"ru-RU": {
// 				day: {
// 					zero: " дней",
// 					one: " день",
// 					few: " дня",
// 					many: " дней",
// 					other: " дней",
// 				},
// 			},
// 		},
// 		locale: "ru-RU",
// 	}) // "434,5 дня"
// );

// console.log(
// 	getI18nText({
// 		stringTokens: [["@list", "Motorcycle", "$item", "#bus"]],
// 		variables: { item: "Car" },
// 		translations: {
// 			"en-US": {
// 				bus: "Bus",
// 			},
// 			// ...
// 		},
// 		locale: "en-US",
// 	}) // "Motorcycle, Car, and Bus"
// );

// console.log(
// 	getI18nText({
// 		stringTokens: [["@relativeTime", -5, "hours"]],
// 		locale: "ru-RU",
// 	}) // 5 часов назад
// );
