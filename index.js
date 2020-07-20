const express = require("express");
var bodyParser = require('body-parser');
var paypal = require('paypal-rest-sdk');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYmxz0Ofabf6JYI5GvHw1D50EAh0fDwXMS9EpDQaGJzT9KqyJNkILLBfjlT_gNrApy7jNKiHKIwTTn5z',
  'client_secret': 'EFFqUYbQBRxOUJuWbqkqjQ7rDiBm2BfTIFwDQ9eFMBkprOBsfK9fxp-zzt6Snv7uWkW7sjK4G5lZLN5p'
});

app.get('/', (req, res) => {
    res.status(200).send({message: "Api Nodejs PaypalSDK"});
});

app.post('/pay', (req, res)=> {
    console.log(req.body);
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
 
 
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++ ){
                if(payment.links[i].rel == 'approval_url'){
                    res.redirect(payment.links[i].href);
                    console.log(payment.links[i].href);
                }
            }
        }
    });

});
app.listen(process.env.PORT || 3000);
