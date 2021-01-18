const newProducts = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json'
const newProductsInBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json'
const addToBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/addToBasket.json'
const delFromBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/deleteFromBasket.json'

class Product{
    constructor(product){
        this.id_product = product.id_product;
        this.product_name = product.product_name;
        this.price = product.price;
        // this.img = img;
    }
    
    showInfo(){
        // выводит инфо о продукте
    }
}

class ProductItem extends Product{    
        renderProduct(){     
            return `<div class="productItem" data-id="${this.id_product}">
                        <div><img class="productImage" src=${(this.img == undefined)? "pictures/nophoto.png": this.img} alt="photo"></div>
                        <h3 class="productName">${this.product_name}</h3>
                        <p class="productPrice">${(this.price == undefined)? 777: this.price} руб.</p>
                        <button class="buy-btn"
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-price="${this.price}">Купить</button>
                    </div>`           
        }
        
        
	}

    // container = '.products'

class List{
    constructor(url, container, list = list2){ 
        this.container = container;        
        this.list = list;      
        this.url = url;
        this.products = [];
        this.allProducts = [];
        this._init();
    }
    
    getJson(url){
        return fetch(url ? url : this.url)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
                })
    }

    unPackData(data){
        this.products = [...data];
        this.renderPage();
    }
    

    // _getProducts(){
    //     return fetch(newProducts)
    //         .then(result => result.json())
    //         .catch(error => {
    //             console.log(error);
    //         })
    // }

    renderPage(){
        const block = document.querySelector(this.container);        
        for (let item of this.products){            
            const productObj = new this.list[this.constructor.name](item);
            // console.log(productObj)            
            this.allProducts.push(productObj);
            // console.log(this.allProducts)                        
            block.insertAdjacentHTML('beforeend',productObj.renderProduct())
        }
    } 

    summaryBasket(){               
        let sum = 0;
        for (let item of this.allProducts){            
            sum += item.price*item.quantity
        }
        return sum;
    } 
    
    addProduct(element){
        this.getJson(addToBasket)
            .then(data => {
                if(data.result === 1){
                    // console.log(element)
                    let productId = +element.dataset['id'];                                     
                    let find = this.allProducts.find(product => product.id_product === productId);               
                    if(find){
                        find.quantity++;                        
                        this._updateBasket(find);
                    } else {
                        let product = {                            
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['product_name'],
                            quantity: 1
                        };             
                        
                        this.allProducts.push(product)            

                    }
                    this.renderPage();
                } else {
                    alert('Error');
                }
            })  
    }

    removeProduct(element){
        this.getJson(delFromBasket)
            .then(data => {
                if(data.result === 1){
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);                    
                    if(find.quantity > 1){
                        find.quantity--;
                        this._updateBasket(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        console.log(this.allProducts)
                        document.querySelector(`.productItemInBasket[data-id="${productId}"]`).remove();
                        this._updateBasket(find);
                    }
                    this.renderPage();
                } else {
                    alert('Error');
                }
            })
    }

    _updateBasket(product){        
        try {
            let block = document.querySelector(`.productItemInBasket[data-id="${product.id_product}"]`);                    
            block.querySelector('.productQuantityInBasket').textContent = `${product.quantity} шт.`;
            block.querySelector('.productPriceInBasket').textContent = `${product.quantity*product.price} руб.`;
            
        } catch {        
        }
        try {
            let block2 = document.querySelector(`.basketMiniStringSummary`);               
            block2.textContent = `Итого: ${this.summaryBasket()} руб.`;
        }
        catch {        
        }
    }    
}


class Catalog extends List{
    constructor(bask, container = '.products', url = newProducts){
        super(url, container);
        this.bask = bask;
        this.getJson()
            .then(data => this.unPackData(data));
    }
    _init(){
        try {
            document.querySelector(this.container).addEventListener('click', elem => {
                if(elem.target.classList.contains('buy-btn')){
                    this.bask.addProduct(elem.target);                               
                }
            })
        } catch{

        }
    }
}

class BasketMax extends List{
    constructor(container = '.containerBasket', url = newProductsInBasket){
        super(url, container);       
        this.getJson()
            .then(data => this.unPackData(data.contents));
    }
    
    renderPage(){                
        const block = document.querySelector(this.container);        
        let basketMiniStringMain = document.createElement ("div");
        basketMiniStringMain.className = "basketMiniStringMain";
        block.append(basketMiniStringMain);
        basketMiniStringMain.innerText = "Ваша корзина:";
        for (let item of this.products){
            // console.log(this.allProducts)               
            const productObj = new ProductInBasket(item);
            this.allProducts.push(productObj);                             
            block.insertAdjacentHTML('beforeend',productObj.renderProductInBasket())
        }
        // console.log(this.allProducts)  
        var basketMiniStringSummary = document.createElement ("div");
        basketMiniStringSummary.className = "basketMiniStringSummary";
        block.append(basketMiniStringSummary);
        basketMiniStringSummary.innerText = `Итого: ${this.summaryBasket()} руб.`;
        var basketCompletedBtn = document.createElement ("button");
        basketCompletedBtn.className = "btn-complete";
        block.append(basketCompletedBtn);
        basketCompletedBtn.innerText = `Завершить покупку`;
        let button = document.querySelector('.btn-complete')        
        button.addEventListener('click', () => {
                let order1 = new OrderForm();
                order1.renderForm();
                console.log(order1);            
                document.querySelector('.containerBasket').classList.toggle('invisible');
                document.querySelector('.orderForm').classList.toggle('invisible');
                
            })

        }


    removeProduct(element){
        this.getJson(delFromBasket)
            .then(data => {
                if(data.result === 1){
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);                    
                    if(find.quantity > 1){
                        find.quantity--;
                        this._updateBasket(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        // console.log(this.allProducts)
                        document.querySelector(`.productItemInBasket[data-id="${productId}"]`).remove();
                        this._updateBasket(find);                        
                    }                    
                } else {
                    alert('Error');
                }
            })
    }
    
    _init(){
        try {
            document.querySelector(this.container).addEventListener('click', e => {
                if(e.target.classList.contains('del-btn')){
                    this.removeProduct(e.target);
                }
            })
        } catch {

        }
        
        // let button = document.querySelector('btn-complete')
        // console.log(button)
        // button.addEventListener('click', () => {            
        //     document.querySelector('orderForm').classList.toggle('invisible');
        // })               
    }    
}


class BasketMini extends List{
    constructor(container = '.basketMini', url = newProductsInBasket){
        super(url, container);       
        this.getJson()
            .then(data => this.unPackData(data.contents));
    }  
    
    renderPage(){
        try {
            document.querySelector(this.container).innerHTML = '';
            const block = document.querySelector(this.container);        
            if (this.allProducts.length == 0){
                let basketMiniStringMain = document.createElement ("div");
                basketMiniStringMain.className = "basketMiniStringMain";
                block.append(basketMiniStringMain);
                basketMiniStringMain.innerText = "Ваша корзина пуста";
                basketMiniStringMain.style.color = "red";
            } else {
                let basketMiniStringMain = document.createElement ("div");
                basketMiniStringMain.className = "basketMiniStringMain";
                block.append(basketMiniStringMain);
                basketMiniStringMain.innerText = "Ваша корзина:"; 
                console.log(this.allProducts)            
                for (let item of this.allProducts){            
                    const productObj = new ProductInBasket(item);                                                          
                    block.insertAdjacentHTML('beforeend',productObj.renderProductInBasket())
                }
                console.log(this.allProducts)  
                var basketMiniStringSummary = document.createElement ("div");
                basketMiniStringSummary.className = "basketMiniStringSummary";
                block.append(basketMiniStringSummary);
                basketMiniStringSummary.innerText = `Итого: ${this.summaryBasket()} руб.`;
                var basketForwardBtn = document.createElement ("button");
                basketForwardBtn.className = "basketForwardBtn";
                block.append(basketForwardBtn);
                basketForwardBtn.innerText = `Перейти к оформлению`;
                basketForwardBtn.setAttribute('onclick', "document.location='basket.html'");
            }
        } catch {

        }
    }

    _init(){
        try{
            document.querySelector('.btnBasketText').addEventListener('click', () => {            
                document.querySelector(this.container).classList.toggle('invisible');
            })
        }  catch {        
        }
        try{
            document.querySelector(this.container).addEventListener('click', e => {
                if(e.target.classList.contains('del-btn')){
                    this.removeProduct(e.target);
                }
            })
        } catch {        
        }
    }

}

class ProductInBasket extends Product{
    constructor(product){
        super(product);
        this.quantity = product.quantity;        
    }

    renderProductInBasket(){     
        return `<div class="productItemInBasket" data-id="${this.id_product}">            
            <h3 class="productNameInBasket">${this.product_name}</h3>
            <p class="productQuantityInBasket">${this.quantity} шт.</p>
            <p class="productPriceInBasket">${(this.price == undefined)? 777: this.price*this.quantity} руб.</p>
            <button class="del-btn" data-id="${this.id_product}">x</button>
            
        </div>`           
    }        
}

class OrderForm{
    constructor(container = '.orderForm'){ 
        this.container = container;
    }
    
    renderForm(){
        const block = document.querySelector(this.container);        
        let basketMiniStringMain = document.createElement ("div");
        basketMiniStringMain.className = "basketMiniStringMain";
        block.append(basketMiniStringMain);
        basketMiniStringMain.innerText = "Контактные данные";
        
        let confirmButton = document.createElement ("button");
        confirmButton.className = "confirm-btn";
        block.append(confirmButton);
        confirmButton.innerText = `Отправить`;
        let backButton = document.createElement ("button");
        backButton.className = "backToBasket-btn";
        block.append(backButton);
        backButton.innerText = `Вернуться в корзину`;
        backButton.addEventListener('click', () => {     
            document.querySelector('.containerBasket').classList.toggle('invisible');
            document.querySelector('.orderForm').innerHTML = '';
            document.querySelector('.orderForm').classList.toggle('invisible');
            
        })
    } 
    _init(){

    }
}



const list2 = {
    Catalog: ProductItem,
    Basket: ProductInBasket
};


let bask2 = new BasketMax();
let bask1 = new BasketMini();

let list1 = new Catalog(bask1);



// let bask = new Basket(newProducts);
// console.log(bask.summaryBasket());

// let el = new ProductInBasket({id: 1, product_name: 'GoPro7 Black', price: 22000});
// console.log(el)