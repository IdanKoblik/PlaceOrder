import crypto from 'crypto';
import config from "../../config.json";

const key = Buffer.from(config.secret, 'utf-8').slice(0, 32); 
export const encryptToken = (token: string): string => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(token, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    const ivHex = iv.toString('hex');
    return ivHex + encrypted;
};

export const decryptToken = (encryptedToken: string): string => {
    if (!encryptedToken) 
        throw new Error('Encrypted token is required');

    if (encryptedToken.length < 32) 
        throw new Error('Encrypted token is too short');

    const ivHex = encryptedToken.slice(0, 32);  
    const encrypted = encryptedToken.slice(32); 

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
};
