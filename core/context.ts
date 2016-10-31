import {cloneDeep} from "lodash";

import * as sTypes from "../core/semantics-types_gen";


export interface IContext {
	functionDefinitions: { [$id: string]: sTypes.IFunctionDefinition };
	letValues: { [name: string]: any };
	localValues: { [$id: string]: sTypes.ILocalValueDefinition }
}

export function cloneContext(context: IContext): IContext {
	return cloneDeep(context);
}

export function createEmptyContext(): IContext {
	return {
		functionDefinitions: {},
		letValues: {},
		localValues: {}
	}
};

// TODO  make into a class and be able to nest and such (scoping!)
