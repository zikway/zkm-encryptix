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
}

export type VersionAndMode = BaseType & {
  btVersion: Uint8Array,
  mcuVersion: Uint8Array,
  mode: Uint8Array,
}
export type BatteryType = BaseType & {
  lBattery: Uint8Array,
  rBattery: Uint8Array,
}
export type MacAddressType = BaseType & {
  macAddress: Uint8Array,
}
export type ConnType = BaseType & {
  btStatus: Uint8Array,
  usbStatus: Uint8Array,
  btRssi: Uint16Array,
}