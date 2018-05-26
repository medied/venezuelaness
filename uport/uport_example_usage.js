const qrcode = require('qrcode-terminal');

const uriCallback = (uri) => {
    // Here we are console.logging but this is the uri
    // that you put on the button/href. Its generated only
    // when you call RequestCredentials, so you
    console.log('RECEIVED URI: ', uri);
    qrcode.generate(uri, {small: true})

    /*  uri looks like this
        https://id.uport.me/me?requestToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3kySlEzQlF1cHVkbVQ0Z3ZjUUFiWXFEa2FZOEgxNTV4WCIsImlhdCI6MTUyNzM1Njg2OSwicmVxdWVzdGVkIjpbIm5hbWUiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vY2hhc3F1aS51cG9ydC5tZS9hcGkvdjEvdG9waWMvMnVFNndVd1Y3QWJLRzhqZCIsIm5ldCI6IjB4NCIsImV4cCI6MTUyNzM1NzQ2OSwidHlwZSI6InNoYXJlUmVxIn0.V4fU3R--jwMThV_XPr9H9fcJs496Hp1k7-2kZYmXvD8144KvAN1VF_TotEMlsctkM3NWf9zPwnI58UUj54wVlA
    */
}

const uport = require('./uport').New(uriCallback)

uport.RequestCredentials((credentials) => {
    console.log('RECEIVED CREDENTIALS: ', JSON.stringify(credentials, null, 2))
    /*       EXAMPLE CREDENTIALS
        {
            "@context": "http://schema.org",
            "@type": "Person",
            "publicKey": "0x0463612d2ffd60f78e9b0a633d2d133574ba6be73c72617af01bb2e6e3cc8e9acb99693d17b6f82cef16e81bd9a9b48f6e49cdb6f173f0dd56fcc1b6c474364999",
            "publicEncKey": "uySJTpT0Lkm1po7haNBMPFmhFGLORxNrRqqrofqSbyg=",
            "name": "Sebastian Delgado",
            "pushToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3VYQ0M5cjFNUHh1VWFXVUpXQkt2RHdHdE5GcWV6S1RqbyIsImlhdCI6MTUyNzM1Njk0MywiYXVkIjoiMm95MkpRM0JRdXB1ZG1UNGd2Y1FBYllxRGthWThIMTU1eFgiLCJ0eXBlIjoibm90aWZpY2F0aW9ucyIsInZhbHVlIjoiYXJuOmF3czpzbnM6dXMtd2VzdC0yOjExMzE5NjIxNjU1ODplbmRwb2ludC9BUE5TL3VQb3J0LzJiMDg3Mzk0LTc4NjAtMzlhOS1iOTZiLWZhMmQ5ZGRmYTI3YSIsImV4cCI6MTUyODY1Mjk0M30.ScD0i0POy1MDmWPeIM97W1LQoxnrbKAhy8uNaQO15q9yzFFf4tWswNDgImRuggIEA0K_OmMP_t6-PSfl0WPH5g",
            "address": "2ouXCC9r1MPxuUaWUJWBKvDwGtNFqezKTjo",
            "networkAddress": "2ouXCC9r1MPxuUaWUJWBKvDwGtNFqezKTjo"
        }
    */
   uport.AttestCredentials(credentials.address)
});
