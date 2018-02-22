var myAmount = new Amount({
    id: 'amount',
    colspan: '6',
    label: 'Pagesa',
    blockProcessAttr: false,
    required: true,
    currency: [{ "id": "1", "text": "EUR" }, { "id": "2", "text": "ALL" }, { "id": "3", "text": "GBP" }],
    value: {
        "amount": "132323",
        "currency": "2"
    }
});

$('#root').append(myAmount.render());
