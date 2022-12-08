const {EscPos} = require("@tillpos/xml-escpos-helper");
const builder = require('xmlbuilder');
const connectToPrinter = require("./connectToPrinter");
const fs = require('fs');
const logger = require('./logger')

const PRINTER = {
    device_name: "EPSON_Printer",
    host: "47.137.17.228",
    port: 9100,
};

const generateBuffer = (template, data) => {

};


const sendMessageToPrinter = async (host, port, message) => {

};

const print = async (orders) => {
    orders.map((order) => {
        logger.info(order)
        console.log(order)
        if(order.fulfillment == "PICKUP"){
            const template = fs.readFileSync(`./wix-orders-check/wix-webhook/pickupTemplates/template${order.items.length}.xml`, {encoding: "utf8"});
            const message = EscPos.getBufferFromTemplate(template, order);
            try{
                connectToPrinter(PRINTER.host, PRINTER.port, message);
            }catch(err){
                console.log("Error: ", err);
            }
        }else{
            const template = fs.readFileSync(`./wix-orders-check/wix-webhook/deliveryTemplates/template${order.items.length}.xml`, {encoding: "utf8"});
            const message = EscPos.getBufferFromTemplate(template, order);
            try{
                connectToPrinter(PRINTER.host, PRINTER.port, message);
            }catch(err){
                console.log("Error: ", err);
            }
        }
    })    
};
module.exports= print;
