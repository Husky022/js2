const newProducts = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json'
const newProductsInBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json'


class Product{
    constructor(product){
        this.id = product.id_product;
        this.title = product.product_name;
        this.price = product.price;
    }
    
    showInfo(){
        // выводит инфо о продукте
    }
}

class ProductItem extends Product{    
        renderProduct(){     
            return `<div class="productItem">
                <div><img class="productImage" src=${(this.img == undefined)? "pictures/nophoto.png": this.img} alt="photo"></div>
                <h3 class="productName">${this.title}</h3>
                <p class="productPrice">${(this.price == undefined)? 777: this.price} руб.</p>
                <button class="buy-btn">Купить</button>
            </div>`           
        }        
	}

class Catalog{
    constructor(container = '.products'){ 
        this.container = container;       
        this.products = [];
        this._getProducts()
            .then(data => {
                this.products = [...data];
                this.renderPage()
            });

    }

    _getProducts(){
        return fetch(newProducts)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    renderPage(){
        const block = document.querySelector(this.container);        
            for (let item of this.products){            
            const productObj = new ProductItem(item);            
            block.insertAdjacentHTML('beforeend',productObj.renderProduct())
        }
    } 
}

class Basket{
    constructor(container = '.containerBasket'){  
        this.container = container;        
        this.products = [];
        this._getProducts()
            .then(data => {
                this.products = data.contents;
                this.renderBasket()
            });

    }

    _getProducts(){
        return fetch(newProductsInBasket)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }      
    
    renderBasket(){
        const block = document.querySelector(this.container);
        let basketStringMain = document.createElement ("div");
        basketStringMain.className = "basketStringMain";
        block.append(basketStringMain);
        basketStringMain.innerText = "Ваша корзина:";       
            for (let item of this.products){            
                const productObj = new ProductInBasket(item);            
                block.insertAdjacentHTML('beforeend',productObj.renderProductInBasket())
            }
        var basketStringSummary = document.createElement ("div");
        basketStringSummary.className = "basketStringSummary";
        block.append(basketStringSummary);
        basketStringSummary.innerText = `Итого: ${this.summaryBasket()} руб.`;
    }

    removeProduct(){
        // удаляет элемент из корзины
    }

    summaryBasket(){               
        let sum = 0;
        for (let item of this.products){            
            sum += item.price
        }
        return sum;
    }   
}

class ProductInBasket extends Product{
    constructor(product, quantity=1){
        super(product);
        this.quantity = quantity;        
    }

    renderProductInBasket(){     
        return `<div class="productItemInBasket">            
            <h3 class="productNameInBasket">${this.title}</h3>
            <p class="productPriceInBasket">${this.quantity} шт.</p>
            <p class="productPriceInBasket">${(this.price == undefined)? 777: this.price} руб.</p>
            
        </div>`           
    }        
}    


let list = new Catalog();
let bask = new Basket();



// let bask = new Basket(newProducts);
// console.log(bask.summaryBasket());

// let el = new ProductInBasket({id: 1, title: 'GoPro7 Black', price: 22000});
// console.log(el)