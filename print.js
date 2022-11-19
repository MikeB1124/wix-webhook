const {EscPos} = require("@tillpos/xml-escpos-helper");
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

const print = async (orders) => {
    // console.log(orders)
    orders.map((order) => {
        if(order.fulfillment == "PICKUP"){
            // const template = fs.readFileSync("pickupOrder.xml", {encoding: "utf8"});
            // const message = EscPos.getBufferFromTemplate(template, order);
            // try{
            //     connectToPrinter(PRINTER.host, PRINTER.port, message);
            // }catch(err){
            //     console.log("Error: ", err);
            // }
        }else{
            const template = fs.readFileSync("deliveryOrder.xml", {encoding: "utf8"});
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
