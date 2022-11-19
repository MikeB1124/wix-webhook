module.exports = class Order {
	constructor(new_order) {
		// this.id = id
        // this.fulfillment = fulfillment
        // this.customer = customer
        // this.lineItems = lineItems
        // this.payments = payments
        // this.totals = totals
        this.order = new_order
	}

	get_line_items(){
        console.log(this.order)
    }
}