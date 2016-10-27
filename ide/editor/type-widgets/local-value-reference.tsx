import {observer} from "mobx-react";
import * as React from "react";

import {dispatch} from "../dispatcher";
import {editorState} from "../state";
import {ILocalValueReference} from "../../../core/semantics-types_gen";


@observer
export class LocalValueReference<T> extends React.Component<{ localValueReference: ILocalValueReference; }, {}> {

	render() {
		const {localValueReference} = this.props;
		return (
			<span onClick={editorState.actionSelectItem(this)} className={editorState.cssClassForSelection(this)}>
				<em>{localValueReference.name}</em>
			</span>
		);
	}

}
