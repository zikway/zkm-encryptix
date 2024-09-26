import { zkmEncryptix } from "../src/index"
import { CMD_G_BATTERY, CMD_G_CONN_STATUS, CMD_G_ENABLE_KEY_MODE, CMD_G_MAC_ADDRESS, CMD_G_VER_AND_MODE } from "./template";
describe('zkmEncryptix Entry', () => {
    it('zkmEncryptix exist', () => {
        expect(zkmEncryptix).not.toBeUndefined();
    });
});
describe('zkmEncryptix cmd generate', () => {
    it("genEnableKeyMode", async () => {
        const cmd = await zkmEncryptix.genEnableKeyMode()
        expect(cmd).toEqual(CMD_G_ENABLE_KEY_MODE)
    })
    it("genConnectStatus", async () => {
        const cmd = await zkmEncryptix.genConnectStatus()
        expect(cmd).toEqual(CMD_G_CONN_STATUS)
    })
    it("genVersionAndMode", async () => {
        const cmd = await zkmEncryptix.genVersionAndMode()
        expect(cmd).toEqual(CMD_G_VER_AND_MODE)
    })
    it("genBattery", async () => {
        const cmd = await zkmEncryptix.genBattery()
        expect(cmd).toEqual(CMD_G_BATTERY)
    })
    it("genMacAddress", async () => {
        const cmd = await zkmEncryptix.genMacAddress()
        expect(cmd).toEqual(CMD_G_MAC_ADDRESS)
    })
});
