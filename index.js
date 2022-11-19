const print = require("./print")
const getCredentials = require("./credentials")
const fetch = require("node-fetch")
const fs = require('fs');
const Order = require("./orderClass")
const credentials = getCredentials()

let orders = []

async function get_new_orders(){
    fetch('https://www.wixapis.com/restaurants/v3/orders?status=NEW',{
        headers: {
            'Content-Type': 'application/json',
            "Authorization": credentials["api-key"],
            "wix-account-id": credentials["wix-account-id"],
            "wix-site-id": credentials["wix-site-id"]
        },
        
    })
    .then((response) => response.json())
    .then((data) => {
        data["orders"].map((order) => {
            orders.push(order)
        })
        
        orders = parseOrders(orders)

        print(orders)
    });
}

function parseOrders(orders){
    let parsedArray = []

    orders.map((order) => {
        if(order.fulfillment.type == "PICKUP"){
            parsedArray.push({
                "id": order.id,
                "customerName": order.customer.firstName + " " + order.customer.lastName,
                "customerNumber": order.customer.phone,
                "fulfillment": order.fulfillment.type,
                "dueDate": order.fulfillment.promisedTime,
                "items": order.lineItems,
                "paymentType": order.payments[0].method,
                "orderComment": order.comment,
                "totals": order.totals
            })
        }else{
            parsedArray.push({
                "id": order.id,
                "customerName": order.customer.firstName + order.customer.lastName,
                "customerNumber": order.customer.phone,
                "fulfillment": order.fulfillment.type,
                "dueDate": order.fulfillment.promisedTime,
                "deliveryAddress": order.fulfillment.deliveryDetails,
                "items": order.lineItems,
                "paymentType": order.payments[0].method,
                "orderComment": order.comment,
                "totalAmount": order.payments[0].amount
            })
        }
    })

    return parsedArray
}



get_new_orders()











// exports.handler = async(event) => {
//     console.log(event)
//     print("if this works we good")
// }
// let count =0

// while(count < 1){
//     print("hello")
//     count += 1
// }
