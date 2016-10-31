import {IReference} from "../../../core/base-semantics-types";
import {evaluate} from "../../../core/evaluator";
import {IContext} from "../../../core/context";
import {editorState} from "../state";

export function evaluateReference(reference: IReference, context: IContext) : any {
	const {jsonData} = editorState;

	// Populate the context by evaluting the entire program
	evaluate(jsonData, context);

	return evaluate(reference, context);
}