const Alexa = require('ask-sdk-core');
const helpFunction = require('./extraFunction.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
            const speakOutput = `Bienvenido a la aplicacion BNB, quieres continuar?.`
            const image = helpFunction.getImage("bnb.png")

        var APL_image = require('./documents/APL_image.json');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
              'Alexa.Presentation.APL'
            ]
        ) {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: APL_image,
                datasources: {
                    myData: {
                        imageURL: image
                    },
                },
            });
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const launchBnbApplication = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
      );
    },

    handle(handlerInput) {
        const speakOutput = `<speak>Para continuar que datos quieres saber?.Opcion 1: Datos sobre el Saldo de Stock. Opcion 2: Datos sobre la Varianza. Opcion 3: Datos sobre la Mora. Opcion 4: Datos sobre Productividad Persona. Opcion 5: Datos sobre Productividad de Micro Crédito.
                             <break time="2s"/> Si quieres volver a escuchar la lista de opciones puedes decir: "di me la lista.". o "repite la lista.".</speak>`;
        var APL_list = require('./documents/APL_list.json');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            handlerInput.responseBuilder.addDirective(APL_list);
    }
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

};

const ListIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListIntentHandler');
    },
        handle(handlerInput) {
        const optionPhrase = handlerInput.requestEnvelope.request.intent.slots.optionPhrase.value;
        let phrase = helpFunction.repeatListOption(optionPhrase);
        const speakOutput = `<speak>Estas son las opciones: ${phrase}<break time="1.5s"/> Que Opcion quiere selecionar?</speak>`;
        var APL_list = require('./documents/APL_list.json');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            handlerInput.responseBuilder.addDirective(APL_list);
        }
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
};

const BalanceIntentHandler = {
        canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StockBalanceIntentHandler');
    },
        handle(handlerInput) {
        const balanceName = handlerInput.requestEnvelope.request.intent.slots.optionNumber.value;
        const month = handlerInput.requestEnvelope.request.intent.slots.month.value;
        let findInfo = helpFunction.searchData(balanceName, month);
        const image = helpFunction.getImage(findInfo.image);
        let titleImage = helpFunction.findTitleImage(balanceName, findInfo, month);
        let speakOutput = helpFunction.buildResponse(balanceName, findInfo, month);
        /*let speakOutput = `<speak>La opcion ${balanceName} del mes ${month}.</speak>`*/
        var APL_simple = require('./documents/APL_complex.json');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
              'Alexa.Presentation.APL'
            ]
        ) {
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: APL_simple,
                datasources: {
                    myData: {
                        Title: titleImage,
                        imageURL: image  
                    },
                },
            });
        }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
}

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const speakOutput = `<speak>Gracias por usar la aplicación.<break time="1s"/> 
        Para confirmar que quieres cerrar el servicio, intenta decir "Salir.".</speak>`;
         var APL_text = require('./documents/APL_text.json');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            handlerInput.responseBuilder.addDirective(APL_text);
        }
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no tengo informacion sobre ese tema. Por favor intenta de nuevo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento, Tuve problemas para entenderte con lo solicitado. Por favor podrias repetirlo.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        launchBnbApplication,
        ListIntentHandler,
        BalanceIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();