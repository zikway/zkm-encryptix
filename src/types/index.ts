import { CmdEnum } from "../enums";

export type ZkmLibOptions = { inMtu?: number; outMtu?: number }
export type strObj = {
  [key: string]: string;
}

export type BaseType = {
  type: CmdEnum;
};
export type ResultType = BaseType & {
  rx_len: number;
  rx_buf: Uint8Array;
};
export type TestKeySwitch = BaseType & {
  keyOn: 0 | 1;
};
export type TestKeyType = BaseType & {
  key: Uint8Array;
  lxy: Int8Array;
  rxy: Int8Array;
  lxxyy: Int16Array;
  rxxyy: Int16Array;
  l2r2: Uint8Array;
};
export type VersionAndMode = BaseType & {
  btVersion: string;
  mcuVersion: string;
  mode: string;
};
export type BatteryType = BaseType & {
  lBattery: Uint8Array;
  rBattery: Uint8Array;
};
export type MacAddressType = BaseType & {
  mac: string;
};
export type ConnType = BaseType & {
  btStatus: number;
  usbStatus: number;
  btRssi: number;
};
export type AfterEncryptix = {
  genEnableKeyMode(): Promise<Uint8Array>;
  genDisableKeyMode(): Promise<Uint8Array>;
  genConnectStatus(): Promise<Uint8Array>;
  genVersionAndMode(): Promise<Uint8Array>;
  genBattery(): Promise<Uint8Array>;
  genMacAddress(): Promise<Uint8Array>;
}
export type OverrideProperties<T, U> = Omit<T, keyof U> & U;
