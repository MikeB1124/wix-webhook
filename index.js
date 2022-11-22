const print = require("./printJob")
const getCredentials = require("./credentials")
const fetch = require("node-fetch")
const fs = require('fs');
const logger = require("./logger");
const credentials = getCredentials()

let orders = []
let orderIDs = []

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

        if(orderIDs.length > 0){
            logger.info("New orders to accept")
            logger.info("")
            accept_orders(orderIDs)
        }else{
            logger.info("No orders to accept")
        }
    });
}

function parseOrders(orders){
    let parsedArray = []

    orders.map((order) => {
        orderIDs.push(order.id)
        if(order.fulfillment.type == "PICKUP"){
            let orderSchema = {
                "id": order.id,
                "customerName": order.customer.firstName + " " + order.customer.lastName,
                "customerNumber": formatPhoneNumber(order.customer.phone.slice(2)),
                "fulfillment": order.fulfillment.type,
                "dueDate": order.fulfillment.promisedTime,
                "items": order.lineItems,
                "paymentType": order.payments[0].method == "offline" ? "CASH" : "CARD",
                "orderComment": order.comment,
                "tax": order.totals.tax,
                "tip": order.totals.tip ? order.totals.tip : "0.00",
                "subTotal": order.totals.subtotal,
                "total": order.totals.total,
            }

            if(order.comment){
                orderSchema["orderComment"] = order.comment
            }

            orderSchema.items.map((item, i) => {
                orderSchema[`item${i}`] = `${item.quantity} X ${item.catalogReference.catalogItemName}............$${item.price}`
                item.dishOptions.map((option, j) => {
                    if(option.selectedChoices.length > 0){
                        if(option.name == "Add-Ons"){
                            let addOnsString = ""
                            option.selectedChoices.map((selected) => {
                                addOnsString = addOnsString + `${selected.catalogReference.catalogItemName} ($${selected.price}), `
                            })
                            orderSchema[`item${i}Option${j}`] = `${option.name}: ${addOnsString}`
                        }else{
                            orderSchema[`item${i}Option${j}`] = `${option.name}: ${option.selectedChoices[0].catalogReference.catalogItemName}  +$${option.selectedChoices[0].price}`
                        }
                    }
                })
                if(item.comment){
                    orderSchema[`item${i}Comment`] = item.comment
                }
            })


            parsedArray.push(orderSchema)
        }else{
            let orderSchema = {
                "id": order.id,
                "customerName": order.customer.firstName + " " + order.customer.lastName,
                "customerNumber": formatPhoneNumber(order.customer.phone.slice(2)),
                "fulfillment": order.fulfillment.type,
                "dueDate": order.fulfillment.promisedTime,
                "deliveryAddress": order.fulfillment.deliveryDetails.address.formatted,
                "items": order.lineItems,
                "paymentType": order.payments[0].method == "offline" ? "CASH" : "CARD",
                "orderComment": order.comment,
                "tax": order.totals.tax,
                "tip": order.totals.tip ? order.totals.tip : "0.00",
                "subTotal": order.totals.subtotal,
                "total": order.totals.total,
            }

            if(order.comment){
                orderSchema["orderComment"] = `Order Notes: ${order.comment}`
            }

            orderSchema.items.map((item, i) => {
                orderSchema[`item${i}`] = `${item.quantity} X ${item.catalogReference.catalogItemName}............$${item.price}`

                item.dishOptions.map((option, j) => {
                    if(option.selectedChoices.length > 0){
                        if(option.name == "Add-Ons"){
                            let addOnsString = ""
                            option.selectedChoices.map((selected) => {
                                addOnsString = addOnsString + `${selected.catalogReference.catalogItemName} ($${selected.price}), `
                            })
                            orderSchema[`item${i}Option${j}`] = `${option.name}: ${addOnsString}`
                        }else{
                            orderSchema[`item${i}Option${j}`] = `${option.name}: ${option.selectedChoices[0].catalogReference.catalogItemName}  +$${option.selectedChoices[0].price}`
                        }
                    }
                })
                if(item.comment){
                    orderSchema[`item${i}Comment`] = `Comment: ${item.comment}`
                }
            })

            parsedArray.push(orderSchema)
        }
    })

    return parsedArray
}


function accept_orders(orders){
    orders.map((order) => {
        logger.info(`Accepting order number: ${order}`)
        fetch(`https://www.wixapis.com/restaurants/v3/orders/${order}/accept`,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization": credentials["api-key"],
                "wix-account-id": credentials["wix-account-id"],
                "wix-site-id": credentials["wix-site-id"]
            },
            method: "POST",
        })
        .then((response) => response.json())
        .catch((error) => {
            logger.info(error)
        })
    })
}

function formatPhoneNumber(phoneNumber){
    let cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    };
  
    return ""
  };

get_new_orders()