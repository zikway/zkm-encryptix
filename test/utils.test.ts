import { getSourcePath } from "../src/utils";
import path from 'node:path'
describe('Utils Test', () => {
    it('getSourcePath', () => {
        expect(getSourcePath('libzkm.dll')).toBe(path.join(__dirname, "..", "source", "libzkm.dll"));
    });
});