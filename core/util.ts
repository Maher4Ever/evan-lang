import {isArray, isObject, isString, extend} from "lodash";
import {isObservableArray} from "mobx";
import {v4} from "node-uuid";


const TYPE_KEY_NAME = "$sType";
const ID_KEY_NAME = "$id";

export function isSemanticsTyped(json: any) {
	if (isObject(json)) {
		const sTypeValue = json[TYPE_KEY_NAME];
		return sTypeValue && isString(sTypeValue);
	}
	return false;
}

export function requiresID(sType: string): boolean {
	return sType.indexOf("definition") !== -1;
}

export function sType(json: Object) {
	return json[TYPE_KEY_NAME];
}

export function createOfSType(sType: string) {
	let instance = {
		[TYPE_KEY_NAME]: sType
	};

	if (requiresID(sType)) {
		instance = extend(instance, {
			[ID_KEY_NAME]: v4()
		});
	}

	return instance;
}


export function isMyArray(json: any) {
	return isArray(json) || isObservableArray(json);
}

export function mapMap<V, R>(map: { [key: string]: V; }, func: (key: string, value: V) => R): R[] {
	return Object.keys(map).map(key => func(key, map[key]));
}

export function forEachProperty(object: Object, action: (name: string, value: any) => void) {
	for (let propertyName in object) {
		if (object.hasOwnProperty(propertyName)) {
			action(propertyName, object[propertyName]);
		}
	}
}


export function prettyJson(json: any) {
	return json === undefined ? "undefined" : JSON.stringify(json, null, 2);
}

