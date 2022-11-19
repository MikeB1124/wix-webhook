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

const print = async (test) => {
    const template = fs.readFileSync("sample.xml", {encoding: "utf8"});
    console.log(test)
    const sampleInputData = {
        title: "Hello World",
        date: "07-08-2021",  
    };

    const message = EscPos.getBufferFromTemplate(template, sampleInputData);

    try{
        connectToPrinter(PRINTER.host, PRINTER.port, message);
    }catch(err){
        console.log("some error", err);
    }
};
module.exports= print;
