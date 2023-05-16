const AWS = require('aws-sdk');
const Util = require('./util.js');
const s3 = new AWS.S3();
const infoData = require('./documents/infoData.json');
const months = {
  1: "enero",
  2: "febrero",
  3: "marzo",
  4: "abril",
  5: "mayo",
  6: "junio",
  7: "julio",
  8: "agosto",
  9: "septiembre",
  10: "octubre",
  11: "noviembre",
  12: "diciembre"
};
const secondMonths = new Map([
  ["enero", 1],
  ["febrero", 2],
  ["marzo", 3],
  ["abril", 4],
  ["mayo", 5],
  ["junio", 6],
  ["julio", 7],
  ["agosto", 8],
  ["septiembre", 9],
  ["octubre", 10],
  ["noviembre", 11],
  ["diciembre", 12]
]);

const getImage = function (fileName) {
  return Util.getS3PreSignedUrl(`Media/images/${fileName}`);};
  
const repeatListOption = function (optionPhrase){
    let phrase = optionPhrase.toLowerCase();
    if(phrase === "lista" || phrase === "repite la lista" || phrase === "di me la lista"){
        return "Opcion 1: Datos sobre el Saldo de Stock. Opcion 2: Datos sobre la Varianza. Opcion 3: Datos sobre la Mora. Opcion 4: Datos sobre Productividad Persona. Opcion 5: Datos sobre Productividad de Micro Crédito."
    }
}

const searchData = function(dataName, monthName){
    if(dataName.toLowerCase() === "1" || dataName.toLowerCase() === "uno"){
        let name = "SaldoStock";
        return findDataByMonth(monthName, name)
    }
    if(dataName.toLowerCase() === "3" || dataName.toLowerCase() === "tres"){
        let name = "moraStock";
        return findDataByMonth(monthName, name)
    }
    if(dataName.toLowerCase() === "2" || dataName.toLowerCase() === "dos"){
        let name = "varianzStock";
        return findDataByMonth(monthName, name)
    }
    if(dataName.toLowerCase() === "4" || dataName.toLowerCase() === "cuatro"){
        let name = "productividadPersona";
        return findDataByMonth(monthName, name)
    }
    else if(dataName.toLowerCase() === "5" || dataName.toLowerCase() === "cinco"){
        let name = "productividadMicrocredito";
        return findDataByMonth(monthName, name)
    }
}

  function findDataByMonth (monthName, dataName){
    if( monthName.toLowerCase() === "ultimo"){
        let result = infoData[dataName][infoData[dataName].length - 1];
        return result;
    }
    let invertMonth = secondMonths.get(monthName.toLowerCase());
    let result = selectedByMonth(invertMonth,dataName)
    return result[0]
  }
  
function selectedByMonth(numberMonth, dataName){
    let data = infoData[dataName];
    return data.filter((info) => info.month === numberMonth)
}

const numberToMonth = function(number){
    return months[number];
}

const findTitleImage = function(numberData, objectData, findMonth){
    let year = objectData.year.toString();
    let day = objectData.day.toString();
    let monthText = numberToMonth(objectData.month);
    let exactNumber = defineNumber(numberData);
    let primaryText = findTitle(exactNumber);
    let nameObject = findNameObject(exactNumber);
    if(exactNumber === "1" || exactNumber === "2"){
        return `${primaryText} es de ${objectData[nameObject]} dolares`;
    }
    return `${primaryText} es de ${objectData[nameObject]}`;
}

const buildResponse = function(numberData,objectData,findMonth){
    let year = objectData.year.toString();
    let day = objectData.day.toString();
    let monthText = numberToMonth(objectData.month);
    let exactNumber = defineNumber(numberData);
    let primaryText = findTitle(exactNumber);
    let nameObject = findNameObject(exactNumber);
    let secondaryText = `Si quieres volver a escuchar la lista de opciones puedes decir: "di me la lista.". o "repite la lista.".`
    if(exactNumber === "1" || exactNumber === "2"){
        let newNumber = reduceNumber(exactNumber,objectData[nameObject]);
        if(findMonth.toLowerCase() === "ultimo"){
            let text = `<speak>Los datos de ${primaryText} es de ${newNumber} millones de dolares.<break time="1s"/>
                        Estos son los datos del ultimo dia registrado, que es del ${day} de ${monthText} del ${year}.<break time="1.5s"/>
                        ${secondaryText}</speak>`;
            return text;
        }
        let text = `<speak>Los datos de ${primaryText} es de ${newNumber} millones de dolares.<break time="1s"/>
                            Estos son los datos del ${day} de ${monthText} del ${year}.<break time="1.5s"/>
                            ${secondaryText}</speak>`;
        return text;
        }
    if(findMonth.toLowerCase() === "ultimo"){
        let text = `<speak>Los datos de ${primaryText} es de ${objectData[nameObject]}<break time="1s"/>
                        Estos son los datos del ultimo dia registrado, que es del ${day} de ${monthText} del ${year}.<break time="1.5s"/>
                        ${secondaryText}</speak>`;
        return text;
    }
    let text = `<speak>Los datos de ${primaryText} es de ${objectData[nameObject]}.<break time="1s"/>
                            Estos son los datos del ${day} de ${monthText} del ${year}.<break time="1.5s"/>
                            ${secondaryText}</speak>`;
    return text;
}

function findNameObject(numberData){
    if(numberData === "1"){
        return "balance"
    }
    if(numberData === "3"){
        return "mora"
    }
    if(numberData === "2"){
        return "varianza"
    }
    if(numberData === "4"){
        return "prodPersona"
    }
    if(numberData === "5"){
        return "prodMicro"
    }
}

function reduceNumber(exactNumber, data){
    let newNumber;
    if( exactNumber === "2"){
        return data.slice(0,3);
    }
    return data.slice(0,4);
}

function defineNumber(numberData){
    if(numberData.toLowerCase() === "1" || numberData.toLowerCase() === "uno"){
        return "1"
    }
    if(numberData.toLowerCase() === "3" || numberData.toLowerCase() === "tres"){
        return "3"
    }
    if(numberData.toLowerCase() === "2" || numberData.toLowerCase() === "dos"){
        return "2"
    }
    if(numberData.toLowerCase() === "4" || numberData.toLowerCase() === "cuatro"){
        return "4"
    }
    if(numberData.toLowerCase() === "5" || numberData.toLowerCase() === "cinco"){
        return "5"
    }
    
}

function findTitle(numberData){
    if(numberData.toLowerCase() === "1"){
        return "el Saldo en Stock";
    }
    else if(numberData.toLowerCase() === "3"){
        return "la Mora";
    }
    else if(numberData.toLowerCase() === "2"){
        return "la Varianza";
    }
    else if(numberData.toLowerCase() === "4"){
        return "Productividad Persona";
    }
    else if(numberData.toLowerCase() === "5"){
    return "Productividad de Micro Credito"
    }
}

module.exports = {
  getImage,
  repeatListOption,
  searchData,
  numberToMonth,
  findTitleImage,
  buildResponse
};