import {observer} from "mobx-react";
import * as React from "react";

import {makePropertyAccessor} from "../utils/accessor";
import {dispatch} from "../dispatcher";
import {editorState} from "../state";
import {ILocalValueDefinition} from "../../../core/semantics-types_gen";


@observer
export class LocalValueDefinition<T> extends React.Component<{ localValueDefinition: ILocalValueDefinition; }, {}> {

	render() {
		const {localValueDefinition} = this.props;
		return (
			<div onClick={editorState.actionSelectItem(this)} className={editorState.cssClassForSelection(this)}>
				let <b>{localValueDefinition.name}</b>{localValueDefinition.type ? <span>: <em>{localValueDefinition.type}</em></span> : null} = {dispatch(makePropertyAccessor(localValueDefinition, "value"))}
			</div>
		);
	}

}
