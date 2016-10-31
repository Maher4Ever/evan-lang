/// <reference path="./typings.d.ts" />

import {isBoolean, isString} from "lodash";

import {IContext, cloneContext, createEmptyContext} from "../core/context";
import {makeIssue, isIssue} from "../core/issues";
import {makeMapper} from "../core/mapper";
import * as sTypes from "../core/semantics-types_gen";
import {isSemanticsTyped} from "../core/util";


export function functionDefinitionById($id: string, context: IContext) : sTypes.IFunctionDefinition {
	return context.functionDefinitions[$id];
}

export function localValueById($id: string, context: IContext) : sTypes.ILocalValueDefinition {
	return context.localValues[$id];
}

export function evaluate(json: any, context: IContext = createEmptyContext()): any {

	const evaluateInt = makeMapper("evaluate", {
		"binary operation": evaluateBinaryOperation,
		"comments": () => undefined,
		"function application": evaluateFunctionApplication,
		"function definition": evaluateFunctionDefinition,
		"function reference": evaluateFunctionReference,
		"if-then-else": evaluateIfThenElse,
		"issue": () => undefined,
		"local value definition": evaluateLocalValueDefinition,
		"local value reference": evaluateLocalValueReference,
		"value reference": evaluateValueReference
	});

	return evaluateInt(json, context);

	function evaluateBinaryOperation(operation: sTypes.IBinaryOperation, context: IContext): any {
		const leftEval = evaluateInt(operation.left, context);
		const rightEval = evaluateInt(operation.right, context);
		try {
			switch (operation.operator) {
				case "+": return leftEval + rightEval;
				case "<": return leftEval < rightEval;
				default: return makeIssue(`Binary operator "${operation.operator}" not handled.`, operation);
			}
		} catch (e) {
			return makeIssue(`Could not execute binary operation with operator="${operation.operator}"; reason: ${e}.`, operation);
		}
		// TODO  add a lot of checking
	}

	function evaluateFunctionApplication(call: sTypes.IFunctionApplication, context: IContext): any {
		const definition = evaluateInt(call.function, context);
		if (definition === undefined || !isSemanticsTyped(definition) || definition.$sType !== "function definition") {
			return makeIssue(`Function does not resolve to function definition`, definition);
		}
		// TODO  check arguments against parameters
		const newContext = cloneContext(context);
		for (let parameterName in definition.parameters) {
			const argEval = evaluateInt(call.arguments[parameterName], context);
			newContext.letValues[parameterName] = argEval;
		}
		return evaluateInt(definition.body, newContext);
	}

	function evaluateFunctionReference(call: sTypes.IFunctionReference, context: IContext): sTypes.IFunctionDefinition | sTypes.IIssue | void {
		if (!call.$id || !isString(call.$id)) {
			return makeIssue(`Function reference has no $id field.`, call);
		}
		return functionDefinitionById(call.$id, context);
	}

	function evaluateFunctionDefinition(definition: sTypes.IFunctionDefinition, context: IContext): sTypes.IIssue | void {
		const $id = definition.$id;
		if (!$id || !isString($id)) {
			return makeIssue(`Function definition lacks an $id field.`, definition);
		}
		// TODO: validate UUID (maybe using the uuid-validate package once it's in DefinitelyTyped)

		const name = definition.name;
		if (!name || !isString(name)) {
			return makeIssue(`Function definition lacks string-valued name field.`, definition);
		}
		// TODO  check parameters and return type
		context.functionDefinitions[$id] = definition;
		return undefined;
	}

	function evaluateIfThenElse(ifThenElse: sTypes.IIfThenElse, context: IContext): any {
		if (!ifThenElse.condition || !ifThenElse.trueBranch || !ifThenElse.falseBranch) {
			return makeIssue(`If-then-else object not complete.`, ifThenElse);
		}
		const conditionEval = evaluateInt(ifThenElse.condition, context);
		if (isBoolean(conditionEval)) {
			return conditionEval ? evaluateInt(ifThenElse.trueBranch, context) : evaluateInt(ifThenElse.falseBranch, context);
		} else {
			const issue = makeIssue(`Condition of if-then-else does not evaluate to boolean.`, ifThenElse);
			if (isIssue(conditionEval)) {
				issue.causedBy = conditionEval;
			}
			return issue;
		}
	}

	function evaluateLocalValueDefinition(localValueDefinition: sTypes.ILocalValueDefinition, context: IContext): any {
		const $id = localValueDefinition.$id;
		if (!$id || !isString($id)) {
			return makeIssue(`Local value definition lacks an $id field.`, localValueDefinition);
		}

		const name = localValueDefinition.name;
		if (!name || !isString(name)) {
			return makeIssue(`Local value definition lacks a string-valued name field.`, localValueDefinition);
		}

		context.localValues[$id] = localValueDefinition;

		return evaluateInt(localValueDefinition.value, context);
	}

	function evaluateLocalValueReference(localValueReference: sTypes.ILocalValueReference, context: IContext): any {
		const $id = localValueReference.$id;
		if (!$id || !isString($id)) {
			return makeIssue(`Local value reference has no $id field.`, localValueReference);
		}

		if (!($id in context.localValues)) {
			return makeIssue(`The referenced local value with $id '${$id}' is not defiend`, $id)
		}

		return evaluateInt(localValueById($id, context).value, context);
	}

	function evaluateValueReference(valueRef: sTypes.IValueReference, context: IContext): any {
		const name = valueRef.name;
		return name && isString(name) && (name in context.letValues)
			? context.letValues[name]
			: makeIssue(`"${name}" is not a valid name for a value reference.`);
	}

}
