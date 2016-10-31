import {observer} from "mobx-react";
import * as React from "react";

import {createEmptyContext} from "../../../core/context";
import {functionDefinitionById} from "../../../core/evaluator";
import {isIssue} from "../../../core/issues";
import {editorState} from "../state";
import {evaluateReference} from "../utils/references-utils";
import {IFunctionReference} from "../../../core/semantics-types_gen";

import {Issue} from "./issue";


@observer
export class FunctionReference<T> extends React.Component<{ functionReference: IFunctionReference; }, {}> {

	render() {
		const {functionReference} = this.props;
		const context = createEmptyContext();
		const evaluation = evaluateReference(functionReference, context);

		if (isIssue(evaluation)) {
			return <Issue issue={evaluation} />
		}

		const definition = functionDefinitionById(functionReference.$id, context);

		return (
			<span onClick={editorState.actionSelectItem(this)} className={editorState.cssClassForSelection(this)}>
				<em>{definition.name}</em>
			</span>
		);
	}

}
