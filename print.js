const {EscPos} = require("@tillpos/xml-escpos-helper");
const builder = require('xmlbuilder');
const connectToPrinter = require("./connectToPrinter");
const fs = require('fs');

const PRINTER = {
    devince_name: "EPSON_Printer",
    host: "23.243.244.219",
    port: 9100,
};

const generateBuffer = (template, data) => {

};


const sendMessageToPrinter = async (host, port, message) => {

};
let count = 0
const print = async (orders) => {
    orders.map((order) => {
        if(order.fulfillment == "PICKUP" && count == 0){
            const template = fs.readFileSync("pickupOrder.xml", {encoding: "utf8"});
            const message = EscPos.getBufferFromTemplate(template, order);
            try{
                connectToPrinter(PRINTER.host, PRINTER.port, message);
                count++
            }catch(err){
                console.log("Error: ", err);
            }
        }else if(order.fulfillment == "DELIVERY" && count == 0){
            const template = fs.readFileSync("deliveryOrder.xml", {encoding: "utf8"});
            const message = EscPos.getBufferFromTemplate(template, order);
            try{
                connectToPrinter(PRINTER.host, PRINTER.port, message);
                count++
            }catch(err){
                console.log("Error: ", err);
            }
        }
    })    
};
module.exports= print;
