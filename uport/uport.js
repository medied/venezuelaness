// This is from https://developer.uport.me/gettingstarted/

// Old Address: 2oy2JQ3BQupudmT4gvcQAbYqDkaY8H155xX
// Old Public Key: 0x04e38542590d230e344618ea2ddcee0572df263603eefb63df3dd5528cf8623748c4bd2c4ba112f0792d52d21b872c92ea476c84e1223ee601c59d4ca9e8f3fa58
// Old Private/Signing Key: f6cdf5fadadec9d5102c66b6e903ea246ddee9e0491168ecb150fc9e966583f4
const uportConnect = require('uport-connect');
const qrcode = require('qrcode-terminal');

const mnidAddress = '2oyRBWTHTBm2iKEKVxyoYHntx2T7JG4HMEP';
const signingKey = '1f748f1ba9ae331bfe95a8cf0d14ee8ebc9e64576d8dcd37bee003b305ff2bc2';
const appName = 'Cedula Digital Venezolana';

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
                claim: { 'Cedula Digital Venezolana': 'El Democracy Earth Foundation por el presente certificado digital solicita a las autoridades competentes el reconocimiento del ciudadano de la Republica Bolivariana de Venezuela aqui nombrado y en caso de necesidad, prestarle toda la ayuda y proteccion licitas.\n\nEsta identificacion esta respaldada por protocolos trasparentes, auditables y verificables basados en tecnologia blockchain. 🇻🇪' },
                exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
            });
        }
    }
}

module.exports = { New: New };