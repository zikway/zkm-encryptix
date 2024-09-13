import koffi from "koffi";
import { getSourcePath } from "../utils";
import type { ResultType, TestKey, TestKeySwitch, ZkmLibOptions, strObj } from "../types";
import { CmdEnum } from "../enums";

export class Encryptix {
    private lib: koffi.IKoffiLib;
    private structureSet: WeakSet<strObj>;
    protected ops: { inMtu?: number; outMtu?: number };
    constructor() {
        this.lib = koffi.load(getSourcePath("libzkm.dll"));
        this.structureSet = new WeakSet<strObj>()
        this.regBaseStructure();
        this.ops = {
            inMtu: 64,
            outMtu: 64
        };
    }
    setBasicInfo(ops: ZkmLibOptions) {
        this.ops = { ...this.ops, ...ops };
    }
    private regBaseStructure() {
        this.regStructure(
            "Result",
            {
                type: "uint8_t",
                rx_len: "uint16_t",
                rx_buf: "uint8_t [1024]"
            }
        );
        this.regStructure(
            "TestKey",
            {
                type: "uint8_t",
                key: "uint8_t [32]",
                lxy: "int8_t [2]",
                rxy: "int8_t [2]",
                lxxyy: "int16_t [2]",
                rxxyy: "int16_t [2]",
                l2r2: "uint8_t [2]"
            }
        );
    }
    private regStructure(structName: string, struct: strObj, cb?: () => void) {
        if (!this.structureSet.has(struct)) {
            koffi.struct(structName, struct)
            typeof cb === 'function' && cb();
            this.structureSet.add(struct);
        }
    }
    async enableKeyMode() {
        try {
            const handle = this.lib.func("Result get_key_on()");
            return await this.asyncFnc<ResultType>(handle)
        } catch (error: any) {
            throw new Error(error?.message || error);
        }
    }
    async disibleKeyMode() {
        const handle = this.lib.func("Result get_key_off()");
        return await this.asyncFnc<ResultType>(handle)
    }
    async parseKey(data: ArrayBufferLike) {
        const handle = this.lib.func("TestKey parse_test_key(uint8_t* data)");
        return await this.asyncFnc<TestKey>(handle, data);
    }
    async parseKeyStatus(data: Uint8Array) {
        try {
            const handle = this.lib.func("TestKeySwitch parse_test_key_switch(uint8_t* data);");
            return await this.asyncFnc<TestKeySwitch>(handle, data)
        } catch (error: any) {
            throw new Error(error?.message || error);
        }
    }
    async send(cmd: number, pvalue: Uint8Array, len: number) {
        const handle = this.lib.func("Result get_send(uint8_t mtu,uint8_t cmd,uint8_t* pvalue,uint16_t len)");
        return await this.asyncFnc<ResultType>(handle, this.ops.outMtu, cmd, pvalue, len)
    }
    async receive(buffer: Uint8Array) {
        const handle = this.lib.func("Result get_receive(uint8_t* buffer,uint16_t length);");
        const recData = await this.asyncFnc<ResultType>(handle, buffer, buffer.byteLength);
        if (recData.type === CmdEnum.PARSE_KEY) {
            return await this.parseKey(new Uint8Array(recData.rx_buf).buffer);
        }
        return {};
    }
    asyncFnc<T>(handle: koffi.KoffiFunction, ...args: any[]): Promise<T> {
        return new Promise((res, rej) => {
            handle.async(...args || null, (e: any, r: T) => {
                if (e) {
                    rej(e);
                } else {
                    res(r);
                }
            });
        })
    }
}