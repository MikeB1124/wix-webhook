const {EscPos} = require("@tillpos/xml-escpos-helper");
const builder = require('xmlbuilder');
const connectToPrinter = require("./connectToPrinter");
const fs = require('fs');
const logger = require('./logger')

const PRINTER = {
    devince_name: "EPSON_Printer",
    host: "23.243.244.219",
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
            const template = fs.readFileSync(`./pickupTemplates/template${order.items.length}.xml`, {encoding: "utf8"});
            const message = EscPos.getBufferFromTemplate(template, order);
            try{
                connectToPrinter(PRINTER.host, PRINTER.port, message);
            }catch(err){
                console.log("Error: ", err);
            }
        }else{
            console.log(orders.length)
            const template = fs.readFileSync(`./deliveryTemplates/template${order.items.length}.xml`, {encoding: "utf8"});
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
