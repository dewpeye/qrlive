// countryList must be loaded from countrie.js before this file

// -- COIN BOUNCE (Your Original Code) --
const currencies = ["₹", "$", "€", "£", "¥", "₩", "₽"];
let idx = 0;
const coin = document.getElementById('bouncingCoin');
setInterval(() => {
    idx = (idx + 1) % currencies.length;
    coin.innerHTML = currencies[idx];
}, 1700);

// -- POPULATE DROPDOWNS WITH FLAG AND CURRENCY CODES --
let selects = document.querySelectorAll(".list");
for (let select of selects) {
    select.innerHTML = ""; // Clear any old values
    for (let code in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = code;
        newoption.value = code;
        select.append(newoption);
    }
}
// Set default selections
document.querySelector('.from-list').value = 'INR';
document.querySelector('.to-list').value   = 'USD';

// -- FLAG HELPER FUNCTIONS --
// ISO Currency => country code (for flag API)
function getCountryCode(currency) {
    return countryList[currency] || 'US'; // default fallback to US
}
// CurrencyCode => Flag URL
function getFlagUrl(currency) {
    let country = getCountryCode(currency);
    return `https://flagsapi.com/${country}/flat/64.png`;
}

// -- UPDATE FLAG IMAGES --
function updateFlags() {
    const fromSelect = document.querySelector('.from-list');
    const toSelect = document.querySelector('.to-list');
    document.querySelectorAll('.flagimg')[0].src = getFlagUrl(fromSelect.value);
    document.querySelectorAll('.flagimg')[1].src = getFlagUrl(toSelect.value);
}
// Attach to dropdown listener
document.querySelector('.from-list').addEventListener('change', updateFlags);
document.querySelector('.to-list').addEventListener('change', updateFlags);
updateFlags(); // Set initial flag images

// -- SWAP BUTTON LOGIC --
document.querySelector('.fa-arrow-right-arrow-left').onclick = function() {
    let fromSelect = document.querySelector('.from-list');
    let toSelect = document.querySelector('.to-list');
    let tmp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tmp;
    updateFlags();
}

// -- CURRENCY CONVERTER (Frankfurter API) --
async function convertCurrency() {
    const amount = parseFloat(document.querySelector('input[type="text"]').value);
    const from = document.querySelector('.from-list').value;
    const to = document.querySelector('.to-list').value;
    const outputDiv = document.querySelector('.val');
    if (isNaN(amount) || amount <= 0) {
        outputDiv.innerHTML = "<b>Enter a valid amount</b>";
        return;
    }
    if (from === to) {
        outputDiv.innerHTML = `<b>${amount} ${from} = ${amount} ${to}</b>`;
        return;
    }
    try {
        const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const result = data.rates[to];
        outputDiv.innerHTML = `<b>${amount} ${from} = ${result} ${to}</b>`;
    } catch (e) {
        outputDiv.innerHTML = "<b>Currency conversion failed.</b>";
    }
}

// -- SUBMIT HANDLER --
document.querySelector('form').onsubmit = function(e) {
    e.preventDefault();
    convertCurrency();
}

// -- ENTER KEY IN INPUT TRIGGERS CONVERSION --
document.querySelector('input[type="text"]').addEventListener('keyup', function(event) {
    if (event.key === 'Enter'){
        convertCurrency();
    }
});
