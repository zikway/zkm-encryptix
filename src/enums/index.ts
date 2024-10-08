export enum CmdEnum {
    KEY_MODE_STATUS = 0xd2,
    // KEY_OFF = 0xd3,
    PARSE_KEY = 0x02,
    /**
     * @description  connected status and signal intensity
    */
    CONN_AND_DB = 0xfa,
    VERSION_AND_MODE = 0xe2,
    BATTERY = 0x04,
    MAC_ADDRESS = 0x19,
    ERROR = 0x00
}