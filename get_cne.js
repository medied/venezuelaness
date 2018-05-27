const http = require('http');
const jsdom = require("jsdom/lib/old-api");
const jquery = require('jquery');


/*
@arg cedula: assuming valid formatting as an int or string
@return json fields:
    - error
    - fallecido
    - no_inscrito
    - vota_presidenciales
    - vota_legislativo
    - cedula
    - nombre
    - estado
    - municipio
    - parroquia
    - centro
    - direccion

*/
// @arg cedula: assuming valid formatting as an int or string
// @arg callback(CNEDetailsJSON)
function GetCNEDetails(cedula, callback) {
    const json = { updatedAt: new Date() };
    getCNEData(cedula, (err, htmlStr) => {
        if (err) {
            json.error = err
            callback(json);
            return;
        }

        if (htmlStr.includes('FALLECIDO')) {
            json.fallecido = true;
            callback(json);
            return;
        }
        if (htmlStr.includes('Esta cédula de identidad no se encuentra inscrita en el Registro Electoral')) {
            json.no_inscrito = true;
            callback(json);
            return;
        }

        jsdom.env(htmlStr, function(err, window) {
            if (err) {
                json.error = err
                callback(json);
                return;
            }       
            const $ = jquery(window);
            const elementTagHierarchy = [
                'body', 'table', 'tbody', 'tr', 'td', 
                'table', 'tbody', 'tr:eq(4)', 'td', 
                'table', 'tbody', 'tr:eq(1)', 'td', 
                'table', 'tbody', 'tr'].join(' > ')

            $(elementTagHierarchy).each(function (i) {
                const text = $(this).text().replace(/\n|\t/g, '')
                console.log(`SELECTED ELEMENT #${i}: ${text}`)
                if (jsonExtractor[i]) {
                    try {
                        jsonExtractor[i](text, json);
                    } catch (err) {
                        // We don't return here to extract whatever
                        // other fields we can
                        json.error = err;
                    }
                    
                }
            });
            callback(json, htmlStr)
        });
    })
}

// Indices here refer to 
const jsonExtractor = {
    0: (text, json) => { // cedula
        json.cedula = text.split(':')[1];
    },
    1: (text, json) => { // nombre
        json.nombre = text.split(':')[1];
    },
    2: (text, json) => { // estado
        json.estado = text.split(':')[1];
    },
    3: (text, json) => { // municipip
        json.municipio = text.split(':')[1];
    },
    4: (text, json) => { // parroquia
        json.parroquia = text.split(':')[1];
    },
    5: (text, json) => { // centro
        json.centro = text.split(':')[1];
    },
    6: (text, json) => { // direccion
        json.direccion = text.split(':')[1];
    },
    11: extractEligibility, // eligibilidad (aparece en el 11 cuando no puedes votar en las legislativas)
    13: extractEligibility // eligibilidad
}

function extractEligibility(text, json) {
    if (text.includes('Legislativo') && text.includes('Presidente')) {
        const presidencial = 'Usted vota para elegir el cargo de Presidenta o Presidente de la República Bolivariana de Venezuela';
        const legislativa = 'Usted vota para elegir los cargos de Legisladoras y Legisladores del Consejo Legislativo Estadal';
        json.eligibilidad = {
            presidenciales: text.includes(presidencial),
            legislativa: text.includes(legislativa)
        };
    }
}

// @arg cedula: assuming valid formatting as an int or string
// @arg callback(err, raw_html)
function getCNEData(cedula, callback) {
    // const url = `http://cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=${cedula}`
    const url = `http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=${cedula}`
    http.get(url, (resp) => {
        let htmlStr = '';
        resp.on('data', (chunk) => {
            htmlStr += chunk;
        });
        resp.on('end', () => {
          callback(null, htmlStr);
        });
      }).on("error", (err) => {
        callback(err);
      });
}

// const cedula_valida = 24311800;
// const cedula_fallecido = 4258228;
// const cedula_inexistente = 100000000;

// GetCNEDetails(cedula_inexistente, (json) => {
//     console.log('RESULT', json.err, JSON.stringify(json, null, 2))
// })

module.exports = {
    GetCNEDetails: GetCNEDetails
}