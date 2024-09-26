import { Encryptix } from './core';
import { AfterEncryptix, OverrideProperties } from './types';

export const zkmEncryptix = new Encryptix() as unknown as OverrideProperties<Encryptix, AfterEncryptix>;