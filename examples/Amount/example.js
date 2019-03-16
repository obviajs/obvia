var myAmount = new Amount({
    id: 'amount',
    currencyList: [{ "id": "1", "text": "EUR" }, { "id": "2", "text": "ALL" }, { "id": "3", "text": "GBP" }],
    value: {
        "amount": "132323",
        "currency": "2"
    }
});

$('#root').append(myAmount.render());
