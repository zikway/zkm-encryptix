import { join } from "path";
import { BaseType } from "../types";
import { CmdEnum } from "../enums";
export function getRootPath() {
    return join(__dirname)
}
export function getSourcePath(...args: string[]) {
    return join(getRootPath(), "source", ...args)
}
function isError(type: CmdEnum): boolean {
    return type === CmdEnum.ERROR
}
export function AfterParse(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        try {
            const result = await <BaseType>originalMethod.apply(this, args);
            if (isError(result.type)) {
                throw new Error('Parse abort, please check the data you passed in!')
            }
            return result;
        } catch (error: any) {
            throw new Error(error?.message || error)
        }
    };
}