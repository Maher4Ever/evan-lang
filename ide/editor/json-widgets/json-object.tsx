/// <reference path="../../../typings/tsd.d.ts" />

import {observer} from "mobx-react";
import * as React from "react";

import {forEachProperty} from "../../../shared/util";
import {JsonProperty} from "./json-property";


@observer
export class JsonObject<T> extends React.Component<{ object: Object; }, {}> {

	render() {
		const {object} = this.props;
		const propertyNames = [];
		forEachProperty(object, (name, value) => { propertyNames.push(name); });
		return (
			<div className="indent">
				<span>{"{"}</span>
					{propertyNames.map(name => <JsonProperty name={name} value={object[name]} />)}
				<span>{"}"}</span>
			</div>
		);
	}

}