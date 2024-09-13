import { join } from "path";
export function getRootPath() {
    return join(__dirname)
}
export function getSourcePath(...args: string[]) {
    return join(getRootPath(), "source", ...args)
}