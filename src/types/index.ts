import { CmdEnum } from "../enums";

export type ResultType = {
  type: CmdEnum;
  rx_len: number;
  rx_buf: Uint8Array;
};
export type TestKeySwitch = {
  type: CmdEnum;
  keyOn: 0 | 1;
};
export type ZkmLibOptions = { inMtu?: number; outMtu?: number }
export type TestKey = {
  type: Uint8Array;
  key: Uint8Array;
  lxy: Int8Array;
  rxy: Int8Array;
  lxxyy: Int16Array;
  rxxyy: Int16Array;
  l2r2: Uint8Array;
}
export type strObj = {
  [key: string]: string;
}