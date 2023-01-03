/*

product choser v0.1


required products fields:
-name
-price


/*
    this.states example:

    {
        mobileNo:"0173123",
        state:1,
        itemResults:[
            {
                id:23234,
                name:"Flens 0,5l",
                price:1200,
                amount:0.5,
                unit:"l",
                chatboxIndex: 2,
                chatboxLetter: a,
            },
            {
                id:23234,
                name:"Pfungstädter 0,5l",
                price:901,
                amount:0.5,
                unit:"l",
                chatboxIndex: 2,
                chatboxLetter: a,
            }
        ],
        cart:[{
                item:{
                    id:23234,
                    name:"Flens 0,5l",
                    price:1200,
                    amount:0.5,
                    unit:"l",
                    chatboxIndex: 2,
                    chatboxLetter: a,
                },
                quantity: 2
            },
            {
                item:{
                    id:23234,
                    name:"Flens 0,5l",
                    price:1200,
                    amount:0.5,
                    unit:"l"
                },
                quantity: 3
            }
        
        ]
    }

*/

class Chatbot {

    constructor(settings) {
        this.settings = settings;
    }

    states = []
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    settings = {}

    async processText(text, mobileNo) {

        let splitText = text.split(" ");
        let responseString = "";

        let currentState = this.states.find(x => x.mobileNo == mobileNo);
        if (currentState === undefined) {
            let newClient = {
                mobileNo: mobileNo,
                state: 1,
                cart: []
            }
            let len = this.states.push(newClient);
            currentState = this.states[len - 1];
        }

        if (splitText.includes("cart")) {
            currentState.state = 3;
        }
        if (splitText.includes("checkout")) {
            currentState.state = 5;
        }

        switch (currentState.state) {

            case 1: { // await category or product keyword

                let itemResults = await this.settings.getProducts(splitText); // todo: work with Promises so that it does not block !

                if (itemResults.length > 0) {

                    itemResults = itemResults.slice(0, 27);

                    responseString+="🍯 Yeay! We have these products available 👇: \n";

                    itemResults.forEach((item, i) => {
                        responseString+=this.alphabet.charAt(i)+") "+item.name+", "+(item.price / 100)+"€ \n";
                        item.chatbotIndex = i;
                        item.chatbotLetter = this.alphabet.charAt(i);
                    });

                    responseString+="\nSelect a product and the quantity by writing something like '3 a' ☝️. If you're not happy, re-try :)";

                    currentState.itemResults = itemResults;
                    currentState.state = 2;
                    return responseString;
                } else {
                    responseString+="🍯 Sorry, we cannot find anything like this in our inventory 🙄. Try something else!";
                    return responseString;
                }
                break;
            }
            case 2: { // await product selection

                let allNumbersArr = text.match(/^\d+|\d+\b|\d+(?=\w)/g);
                let resultQuantity = 0;
                if (allNumbersArr != null) {
                    resultQuantity = parseInt(allNumbersArr[0]);
                }

                let removedNums = text.replace(/[0-9]/g, '');
                let removedNumsSplit = removedNums.split(" ");

                let selectedItems = {};

                for (let item of removedNumsSplit) {
                    selectedItems = currentState.itemResults.filter((e) => { return e.chatbotLetter == item });
                    if (selectedItems.length == 1) {
                        break;
                    }
                }

                let resultItem = selectedItems[0];

                if (resultQuantity > 0 && resultItem != undefined) {

                    let tempCartItem = {
                        item: resultItem,
                        quantity: resultQuantity
                    }
                    currentState.cart.push(tempCartItem);

                    currentState.state = 1;

                    responseString+="Alright 👍. Added " + resultQuantity + " of " + resultItem.name + " to the 🛒";
                    return responseString;

                } else {
                    currentState.state = 1;
                    return this.processText(text, mobileNo);
                }

                break;
            }
            case 3: { // get cart and allow user to remove items

                //let itemResults = currentState.itemResults.slice(0, 27);

                if (currentState.cart.length > 0) {
                    responseString+="This is your cart 🛒 👇 \n";
                    currentState.cart.forEach((item, i) => {
                        responseString+=this.alphabet.charAt(i)+") "+item.item.name+", "+(item.item.price / 100)+"€ (" + item.quantity + "x) \n";
                        item.chatbotIndex = i;
                        item.chatbotLetter = this.alphabet.charAt(i);
                    });
                    responseString+="\n You can remove items by sending the corresponding letter.";
                    currentState.state = 4;
                } else {
                    responseString+="You don't have items in the cart 🛒. Type anything to find items 🛍️";
                    currentState.state = 1;
                }

                return responseString;

                break;
            }
            case 4: { // awaiting letter to remove from cart

                let selectedItems = {};
                let foundItem = false;

                for (let item of splitText) {
                    selectedItems = currentState.cart.filter((e) => {
                        return e.chatbotLetter == item;
                    });
                    if (selectedItems.length == 1) {
                        foundItem = true;
                        break;
                    }
                }

                if (foundItem) {

                    //remove specific object

                    let removedItemsNum = 0;
                    currentState.cart.forEach((item, i) => {
                        if (item.chatbotLetter == selectedItems[0].chatbotLetter) {
                            currentState.cart.splice(i, 1);
                            removedItemsNum++;
                        }
                    });
                    responseString+="deleted " + removedItemsNum + " item(s).";
                    currentState.state = 1;
                    return responseString;

                } else {
                    currentState.state = 1;
                    return this.processText(text, mobileNo);
                }

                break;
            }
            case 5: { // say that we need the shipping address

                responseString+="Yeah, lets this.settings.checkout 🎉! Let us know your shipping address and details 📫.";
                currentState.state = 6;
                return responseString;
                break;
            }
            case 6: { // awaiting shipping address

                currentState.shippingAddress = text;

                delete currentState.itemResults;
                delete currentState.state;

                let paymentUrl = this.settings.checkout(currentState) || "";

                
                //delete the state
                this.states.forEach((item, i) => {
                    if (item.mobileNo == currentState.mobileNo) {
                        this.states.splice(i, 1);
                    }
                });
                currentState.state = 1;
                
                responseString+="Alright, thanks🙌🙌! You can pay with link below 💳. Once done, we initiate shipping.\n" + paymentUrl;
                return responseString;
                break;
            }
            default:
                currentState.state = 1;
                return this.processText(text, mobileNo);
        }

    }

}

module.exports = Chatbot;