let urlSpot = 'https://testnet.binance.vision';
let urlFut = 'https://testnet.binancefuture.com'
let tickerSpot = '';
let tickerFut = '';
function getCoinSpotQuote(ticker) {
    let spotQuoteReq = fetch(urlSpot+'/api/v3/ticker/price'+ticker);
    spotQuoteReq
        .then(response => response.json())
        .then(datos => {datos.forEach(data => {
            console.log(data.price);
            });
        })
        .catch(error => console.error(error))
};
function getCoinFutQuote(ticker) {
    let futQuoteReq = fetch(urlFut+'/dapi/v1/ticker/price?symbol='+ticker);
    futQuoteReq
        .then(response => response.json())
        .then(datos => {datos.forEach(data => {
            console.log(data.price)
            });
            return datos;
        })
        .catch(error => console.error(error))
};
