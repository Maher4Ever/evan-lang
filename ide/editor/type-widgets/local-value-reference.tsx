import {observer} from "mobx-react";
import * as React from "react";

import {createEmptyContext} from "../../../core/context";
import {localValueById} from "../../../core/evaluator";
import {isIssue} from "../../../core/issues";
import {editorState} from "../state";
import {evaluateReference} from "../utils/references-utils";
import {ILocalValueReference} from "../../../core/semantics-types_gen";

import {Issue} from "./issue";


@observer
export class LocalValueReference<T> extends React.Component<{ localValueReference: ILocalValueReference; }, {}> {

	render() {
		const {localValueReference} = this.props;
		const context = createEmptyContext();
		const evaluation = evaluateReference(localValueReference, context);

		if (isIssue(evaluation)) {
			return <Issue issue={evaluation} />
		}

		const definition = localValueById(localValueReference.$id, context);

		return (
			<span onClick={editorState.actionSelectItem(this)} className={editorState.cssClassForSelection(this)}>
				<em>{definition.name}</em>
			</span>
		);
	}

}
