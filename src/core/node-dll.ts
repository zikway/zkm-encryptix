import koffi from "koffi";
import { getSourcePath, AfterParse, AfterSend } from "../utils";
import type { ResultType, strObj, ZkmLibOptions, TestKeySwitch, TestKeyType, VersionAndMode, BatteryType, MacAddressType, ConnType } from "../types";
import { CmdEnum } from "../enums";

export class Encryptix {
    private lib: koffi.IKoffiLib;
    private structureMap: Map<string, strObj>;
    private cmdMap: WeakMap<koffi.KoffiFunction, ResultType>
    constructor() {
        this.lib = koffi.load(getSourcePath("libzkm.dll"));
        this.structureMap = new Map<string, strObj>();
        this.regBaseStructure();
        this.cmdMap = new WeakMap<koffi.KoffiFunction, ResultType>();
    }
    private reflectParseMap = {
        [CmdEnum.BATTERY]: this.parseBattery,
        [CmdEnum.MAC_ADDRESS]: this.parseMacAddress,
        [CmdEnum.PARSE_KEY]: this.parseKey,
        [CmdEnum.CONN_AND_DB]: this.parseConnectAndRssi,
        [CmdEnum.KEY_MODE_STATUS]: this.parseKeyModeStatus,
        [CmdEnum.VERSION_AND_MODE]: this.parseVersionAndMode,
        [CmdEnum.ERROR]: () => Promise.reject('Parse abort, please check the data you passed in!'),
    }
    async parseTypeEvent(type: CmdEnum, data: ArrayBufferLike) {
        const fnc = this.reflectParseMap[type];
        return await fnc(data);
    }
    // send cmd
    @AfterSend
    async genEnableKeyMode() {
        const handle = this.lib.func("CmdResult get_key_on()");
        return await this.cacheSendCmd(handle)
    }
    @AfterSend
    async genDisableKeyMode() {
        const handle = this.lib.func("CmdResult get_key_off()");
        return await this.cacheSendCmd(handle)
    }
    @AfterSend
    async genConnectStatus() {
        const handle = this.lib.func("CmdResult get_conn()");
        return await this.cacheSendCmd(handle)
    }
    @AfterSend
    async genVersionAndMode() {
        const handle = this.lib.func("CmdResult get_mode()");
        return await this.cacheSendCmd(handle)
    }
    @AfterSend
    async genBattery() {
        const handle = this.lib.func("CmdResult get_elec()");
        return await this.cacheSendCmd(handle)
    }
    @AfterSend
    async genMacAddress() {
        const handle = this.lib.func("CmdResult get_mac_address()");
        return await this.cacheSendCmd(handle)
    }
    // recevie cmd
    @AfterParse
    async parseKeyModeStatus(data: ArrayBufferLike) {
        this.regStructure("TestKeySwitch", {
            type: "uint8_t",
            keyOn: "uint8_t"
        })
        const handle = this.lib.func("TestKeySwitch parse_test_key_switch(uint8_t* data)");
        return await this.asyncFnc<TestKeySwitch>(handle, data)
    }
    @AfterParse
    async parseKey(data: ArrayBufferLike) {
        const handle = this.lib.func("TestKey parse_test_key(uint8_t* data)");
        return await this.asyncFnc<TestKeyType>(handle, data);
    }
    @AfterParse
    async parseConnectAndRssi(data: ArrayBufferLike) {
        this.regStructure("Conn", {
            type: "uint8_t",
            btStatus: "uint8_t",
            usbStatus: "uint8_t",
            btRssi: "uint16_t"
        })
        const handle = this.lib.func("Conn parse_conn(uint8_t* data)");
        return await this.asyncFnc<ConnType>(handle, data);
    }
    @AfterParse
    async parseVersionAndMode(data: ArrayBufferLike) {
        this.regStructure("VersionAndMode", {
            type: "uint8_t",
            btVersion: "uint8_t",
            mcuVersion: "uint8_t",
            mode: "uint8_t [9]"
        })
        const handle = this.lib.func("VersionAndMode parse_mode(uint8_t* data)");
        return await this.asyncFnc<VersionAndMode>(handle, data);
    }
    @AfterParse
    async parseBattery(data: ArrayBufferLike) {
        this.regStructure("Electric", {
            type: "uint8_t",
            lBattery: "uint8_t",
            rBattery: "uint8_t"
        })
        const handle = this.lib.func("Electric parse_elec(uint8_t* data)");
        return await this.asyncFnc<BatteryType>(handle, data);
    }
    @AfterParse
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
                rx_buf: "uint8_t [40]"
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
        if (!this.structureMap.has(structName)) {
            koffi.struct(structName, struct)
            typeof cb === 'function' && cb();
            this.structureMap.set(structName, struct);
        }
    }
    private asyncFnc<T>(handle: koffi.KoffiFunction, ...args: any[]): Promise<T> {
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
    private async cacheSendCmd(handle: koffi.KoffiFunction) {
        if (this.cmdMap.has(handle)) {
            return this.cmdMap.get(handle)!;
        }
        const res = await this.asyncFnc<ResultType>(handle)
        this.cmdMap.set(handle, res);
        return res
    }
}
