import {cloneDeep} from "lodash";

import * as sTypes from "../core/semantics-types_gen";


export interface IContext {
	functionDefinitions: { [name: string]: sTypes.IFunctionDefinition };
	letValues: { [name: string]: any };
	localValues: { [name: string]: sTypes.ILocalValueDefinition }
}

export function cloneContext(context: IContext): IContext {
	return cloneDeep(context);
}

export const emptyContext: IContext = {
	functionDefinitions: {},
	letValues: {},
	localValues: {}
};

// TODO  make into a class and be able to nest and such (scoping!)
