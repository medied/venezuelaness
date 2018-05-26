// This is from https://developer.uport.me/gettingstarted/

// Address: 2oy2JQ3BQupudmT4gvcQAbYqDkaY8H155xX
// Public Key: 0x04e38542590d230e344618ea2ddcee0572df263603eefb63df3dd5528cf8623748c4bd2c4ba112f0792d52d21b872c92ea476c84e1223ee601c59d4ca9e8f3fa58
// Private/Signing Key: f6cdf5fadadec9d5102c66b6e903ea246ddee9e0491168ecb150fc9e966583f4
const uportConnect = require('uport-connect');
const qrcode = require('qrcode-terminal');

const mnidAddress = '2oy2JQ3BQupudmT4gvcQAbYqDkaY8H155xX';
const signingKey = 'f6cdf5fadadec9d5102c66b6e903ea246ddee9e0491168ecb150fc9e966583f4';
const appName = 'Identidad Venezuela';

function New(uriCallback) {
    const uportInstance = new uportConnect.Connect(appName, {
        uriHandler: uriCallback,
        clientId: mnidAddress,
        network: 'rinkeby',
        signer: uportConnect.SimpleSigner(signingKey)
    });
    return {
        RequestCredentials: (credentialsCallback) => {
            uportInstance.requestCredentials({
                requested: ['name'],
                notifications: true
            }).then((credentials) => {
                credentialsCallback(credentials)
            });
        },
        AttestCredentials: (uportAddress) => {
            uportInstance.attestCredentials({
                sub: uportAddress,
                claim: { venezuelan: 'Este es un ciudadano Venezolano' },
                exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
            });
        }
    }
}

module.exports = { New: New };