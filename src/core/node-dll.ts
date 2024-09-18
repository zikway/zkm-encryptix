import koffi from "koffi";
import { getSourcePath } from "../utils";
import type { ResultType, strObj, ZkmLibOptions, TestKeySwitch, TestKeyType, VersionAndMode, BatteryType, MacAddressType, ConnType } from "../types";

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
    // send cmd
    async enableKeyMode() {
        try {
            const handle = this.lib.func("CmdResult get_key_on()");
            return await this.asyncFnc<ResultType>(handle)
        } catch (error: any) {
            throw new Error(error?.message || error);
        }
    }
    async disibleKeyMode() {
        const handle = this.lib.func("CmdResult get_key_off()");
        return await this.asyncFnc<ResultType>(handle)
    }
    async getConnectStatus() {
        const handle = this.lib.func("CmdResult get_conn()");
        return this.asyncFnc<ResultType>(handle)
    }
    async getVersionAndMode() {
        const handle = this.lib.func("CmdResult get_mode()");
        return this.asyncFnc<ResultType>(handle)
    }
    async getElectric() {
        const handle = this.lib.func("CmdResult get_elec()");
        return this.asyncFnc<ResultType>(handle)
    }
    async getMacAddress() {
        const handle = this.lib.func("CmdResult get_mac_address()");
        return this.asyncFnc<ResultType>(handle)
    }
    // recevie cmd
    async parseKeyModeStatus(data: Uint8Array) {
        try {
            this.regStructure("TestKeySwitch", {
                type: "uint8_t",
                keyOn: "uint8_t"
            })
            const handle = this.lib.func("TestKeySwitch parse_test_key_switch(uint8_t* data);");
            return await this.asyncFnc<TestKeySwitch>(handle, data)
        } catch (error: any) {
            throw new Error(error?.message || error);
        }
    }
    async parseKey(data: ArrayBufferLike) {
        const handle = this.lib.func("TestKey parse_test_key(uint8_t* data)");
        return await this.asyncFnc<TestKeyType>(handle, data);
    }
    async parseConnectStatus(data: ArrayBufferLike) {
        this.regStructure("Conn", {
            type: "uint8_t",
            btStatus: "uint8_t",
            usbStatus: "uint8_t",
            btRssi: "uint16_t"
        })
        const handle = this.lib.func("Conn parse_conn(uint8_t* data)");
        return await this.asyncFnc<ConnType>(handle, data);
    }
    async parseVersionAndMode(data: ArrayBufferLike) {
        this.regStructure("VersionAndMode", {
            type: "uint8_t",
            btVersion: "uint8_t",
            mcuVersion: "uint8_t",
            mode: "uint8_t"
        })
        const handle = this.lib.func("VersionAndMode parse_mode(uint8_t* data)");
        return await this.asyncFnc<VersionAndMode>(handle, data);
    }
    async parseBettery(data: ArrayBufferLike) {
        this.regStructure("Electric", {
            type: "uint8_t",
            lBattery: "uint8_t",
            rBattery: "uint8_t"
        })
        const handle = this.lib.func("Electric parse_elec(uint8_t* data)");
        return await this.asyncFnc<BatteryType>(handle, data);
    }
    async parseMacAddress(data: ArrayBufferLike) {
        this.regStructure("MacAddress", {
            type: "uint8_t",
            mac: "uint8_t [6]"
        })
        const handle = this.lib.func("MacAddress parse_mac_address(uint8_t* data)");
        return await this.asyncFnc<MacAddressType>(handle, data);
    }
    private regBaseStructure() {
        this.regStructure(
            "CmdResult",
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