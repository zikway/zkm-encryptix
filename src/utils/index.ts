import { join } from "path";
import { BaseType, ResultType } from "../types";
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
function isValidator(res: Partial<ResultType>) {
    return res.rx_buf ? false : true
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
export function AfterSend(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        try {
            const result = await <ResultType>originalMethod.apply(this, args);
            if (isValidator(result)) {
                throw new Error('Please update SDK version or contact us!')
            }
            return result.rx_buf.slice(0, result.rx_len + 1);
        } catch (error: any) {
            throw new Error(error?.message || error)
        }
    };
}