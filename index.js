const print = require("./print")


function get_new_orders(){
    fetch('https://www.wixapis.com/restaurants/v3/orders',{
        headers: {
            "Authorization": "xxx",
            'Content-Type': 'application/json',
            "wix-account-id": "xxx",
            "wix-site-id": "xxx"
        },
        body: JSON.stringify({"status": "NEW"})
    })
    .then((response) => response.json())
    .then((data) => console.log(data));
}


// exports.handler = async(event) => {
//     console.log(event)
//     print("if this works we good")
// }
let count =0

while(count < 1){
    print("hello")
    count += 1
}
