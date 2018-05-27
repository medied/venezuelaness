const connect = require('./connect.js');
const db = require('./db.js');


connect(() => {
    db.CreateUser({address: 'FAKE_ADDRESS', name: 'sebastian delgado'}, (err) => {
        console.log(`write new user with error: ${err}`);
        db.AddVerificationPhotoPath('FAKE_ADDRESS', '/some/path', (err) => {
            console.log(`wrote path with error: ${err}`);
            const cneData = {
                cneHTMLStr: '<html>todo el contenido de la pagina</html>',
                cneHTMLHash: '0ij423f98uhwpefih3298fh23idjqw8',
                cneHTMLParsedJSON: {
                    nombre: 'Juan Delgado',
                    cedula: 'V-123456',
                    eligibilidad: {
                        presidencial: true,
                        legislativa: false
                    }
                }
            };
            db.AddCNEData('FAKE_ADDRESS', cneData, (err) => {
                 console.log(`wrote CNE data with err: ${err}`);
            });
        });
    });
});