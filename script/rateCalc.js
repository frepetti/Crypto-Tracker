let urlSpot = 'https://api.binance.com';
let urlFut = 'https://dapi.binance.com';
let tickerSpot = '';
let tickerFut = 'btcusd_210625';
let today = new Date();

//Calcular fecha de contrato
function getContractDate(symbol) {
    let symbolDate = symbol.substr(symbol.indexOf('_')+1,symbol.length-symbol.indexOf('_'));
    if (!symbolDate.includes('PERP')) {
        let contractDate = new Date('20'+symbolDate.slice(0,2),symbolDate.slice(2,4)-1, symbolDate.slice(4,6));
        return contractDate
    }
}

//Calcular Periodo
function calculatePeriod(symbol) {
    let contractDate = getContractDate(symbol)
    let period = Math.round((contractDate - today)/(3600*1000*24));
    console.log(period)
    return period;
}

//Calcular Tasa del Periodo
function calculateDirectRate(priceFut, priceSpot, period){
    let directRate = ((((priceFut/priceSpot)-1)/period)*100);
    let directRateRound = Math.round((directRate + Number.EPSILON)*100)/100;
    calculateAPY(directRate);
    console.log('directRate ' + directRateRound);
}


//Calcular Tasa
function calculateAPY(directRate) {
    let apy = directRate*365;
    let apyRound = Math.round((apy + Number.EPSILON)*100)/100;
    console.log('apy ' + apyRound);
};


//Obetener valor de futuros
function getCoinFutQuote(ticker) {
    let futQuoteReq = fetch(urlFut+'/dapi/v1/ticker/price?symbol='+ticker);
    futQuoteReq
        .then(response => response.json())
        .then(datos => {datos.forEach(data => {
            let tickerPair = data.ps;
            let futPrice = data.price;
            let spotPrice;
            let symbol = data.symbol;
            let period = calculatePeriod(symbol);
            tickerSpot = getSpotTicker(tickerPair);
            for (let i = 0; i < tickerSpot.length; i++) {
                spotPrice = getCoinSpotQuote(tickerSpot[i], futPrice, period);
            }
            console.log(data.symbol);
            });
        })
        .catch(error => console.error(error))
};

//Obtener valor de Spot
function getCoinSpotQuote(ticker, futPrice, period) {
    let spotQuoteReq = fetch(urlSpot+'/api/v3/ticker/price?symbol='+ticker);
    spotQuoteReq
        .then(response => response.json())
        .then(datos => {
            let spotPrice = datos.price;
            calculateDirectRate(futPrice, spotPrice, period);
            console.log(spotPrice);
            console.log(datos.symbol);
            console.log(futPrice);
        })
        .catch(error => console.error(error))
};

//Obtener Ticker Spot
function getSpotTicker(tradingPair){
    let spotTicker = []
    spotTicker.push(tradingPair+'T');
    ticker = tradingPair.slice(tradingPair.length*-1,-3)+'BUSD';
    spotTicker.push(ticker);
    return spotTicker;
}



