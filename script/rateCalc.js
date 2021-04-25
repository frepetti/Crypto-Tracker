let urlSpot = 'https://api.binance.com';
let urlFut = 'https://dapi.binance.com';
let tickerSpot = '';
let tickerFut = '';
let today = new Date();


//Crear contenedores HTML
function createQuoteContainer(futSymbol, spotSymbol, priceSpot, priceFut, period, directRate, apyCalc) {
    let newCoin = document.createElement('div')
    let newCoinHeader = document.createElement('div');
    let newCoinDetail = document.createElement('div');
    let newSymbol = document.createElement('span');
    let newDirectRate = document.createElement('span');
    let newApy = document.createElement('span');

    newDirectRate.id = 'rate__'+futSymbol;
    newApy.id = 'apy__'+futSymbol;
    newCoin.className = 'coinContainer';
    newCoin.id = 'coinCont__'+futSymbol+'__'+spotSymbol;
    newCoinHeader.className = 'coinHeader';
    newCoinHeader.id = 'coinHead__'+futSymbol+'__'+spotSymbol;
    newCoinDetail.className = 'coinDetail';
    newCoinDetail.id = 'coinDetail__'+futSymbol+'__'+spotSymbol;
    newSymbol.className = 'symbol';
    newSymbol.id = futSymbol+'__'+spotSymbol;
    newSymbol.innerHTML = futSymbol+'/'+spotSymbol;
    newDirectRate.innerHTML = directRate+'%';
    newApy.innerHTML = apyCalc+'%';
    newCoin.appendChild(newCoinHeader);
    newCoin.appendChild(newCoinDetail);
    newCoinHeader.appendChild(newSymbol);
    newCoinHeader.appendChild(newDirectRate);
    newCoinHeader.appendChild(newApy);
    document.getElementById('futRateCont').appendChild(newCoin);
}

//Actualizar Cotizaciones
function updateQuote(futSymbol, spotSymbol, priceSpot, priceFut, period, directRate, apyCalc) {
    document.getElementById('apy__'+futSymbol).innerHTML = apyCalc+'%';
    document.getElementById('rate__'+futSymbol).innerHTML = directRate+'%';
}


//Calcular fecha de contrato
function getContractDate(symbol) {
    let symbolDate = symbol.substr(symbol.indexOf('_')+1,symbol.length-symbol.indexOf('_'));
    if (!symbolDate.includes('PERP')) {
        let contractDate = new Date('20'+symbolDate.slice(0,2),symbolDate.slice(2,4)-1, symbolDate.slice(4,6));
        return contractDate;
    };
};


//Calcular Periodo
function calculatePeriod(symbol) {
    let contractDate = getContractDate(symbol)
    let period = Math.round((contractDate - today)/(3600*1000*24));
    return period;
};


//Calcular Tasa del Periodo
function calculateDirectRate(priceFut, priceSpot, period, futSymbol, spotSymbol){
    let directRate = ((((priceFut/priceSpot)-1)/period)*100);
    let directRateRound = Math.round((directRate + Number.EPSILON)*100)/100;
    let apyCalc = calculateAPY(directRate);
    if (!document.getElementById('coinCont__'+futSymbol+'__'+spotSymbol)) {
        createQuoteContainer(futSymbol, spotSymbol, priceSpot, priceFut, period, directRateRound, apyCalc)
    } else{
        updateQuote(futSymbol, spotSymbol, priceSpot, priceFut, period, directRateRound, apyCalc)
    }
    
};


//Calcular Tasa
function calculateAPY(directRate) {
    let apy = directRate*365;
    let apyRound = Math.round((apy + Number.EPSILON)*100)/100;
    return apyRound
};


//Obtener Ticker Spot
function getSpotTicker(tradingPair){
    let spotTicker = []
    spotTicker.push(tradingPair+'T');
    ticker = tradingPair.slice(tradingPair.length*-1,-3)+'BUSD';
    spotTicker.push(ticker);
    return spotTicker;
};


//Obetener valor de futuros
function getCoinFutQuote(ticker) {
    setInterval(function (ticker) {
        let futQuoteReq = fetch(urlFut+'/dapi/v1/ticker/price?symbol='+ticker);
        futQuoteReq
            .then(response => response.json())
            .then(datos => {datos.forEach(data => {
                let futSymbol = data.symbol;
                let symbolEx = futSymbol.substr(futSymbol.indexOf('_')+1,futSymbol.length-futSymbol.indexOf('_'));
                if(!symbolEx.includes('PERP')){
                    let tickerPair = data.ps;
                    let futPrice = data.price;
                    let period = calculatePeriod(futSymbol);
                    tickerSpot = getSpotTicker(tickerPair);
                    for (let i = 0; i < tickerSpot.length; i++) {
                        getCoinSpotQuote(tickerSpot[i], futPrice, period, futSymbol);
                    };
                };
                });
            })
            .catch(error => console.error(error));
    }, 5000, [ticker])
};


//Obtener valor de Spot
function getCoinSpotQuote(ticker, futPrice, period, symbol) {
    let spotQuoteReq = fetch(urlSpot+'/api/v3/ticker/price?symbol='+ticker);
    spotQuoteReq
        .then(response => response.json())
        .then(datos => {
            let spotPrice = datos.price;
            calculateDirectRate(futPrice, spotPrice, period, symbol, ticker);
        })
        .catch(error => console.error(error));
};

getCoinFutQuote(tickerFut);

/*
function updateFutQuote(ticker) {
    let futQuoteReq = fetch(urlFut+'/dapi/v1/ticker/price?symbol='+ticker);
    futQuoteReq
        .then(response => response.json())
        .then(datos => {datos.forEach(data => {
            let futSymbol = data.symbol;
            let symbolEx = futSymbol.substr(futSymbol.indexOf('_')+1,futSymbol.length-futSymbol.indexOf('_'));
            if(!symbolEx.includes('PERP')){
                let tickerPair = data.ps;
                let futPrice = data.price;
                let period = calculatePeriod(futSymbol);
                tickerSpot = getSpotTicker(tickerPair);
                for (let i = 0; i < tickerSpot.length; i++) {
                    updateSpotQuote(tickerSpot[i], futPrice, period, futSymbol);
                };
            };
            });
        })
        .catch(error => console.error(error));
}

function updateSpotQuote(ticker, futPrice, period, symbol){
    let spotQuoteReq = fetch(urlSpot+'/api/v3/ticker/price?symbol='+ticker);
    spotQuoteReq
        .then(response => response.json())
        .then(datos => {
            let spotPrice = datos.price;
            calculateDirectRate(futPrice, spotPrice, period, symbol, ticker);
        })
        .catch(error => console.error(error));
}

function updateCoinQuotes(ticker) {
    
}
*/