const newProducts = [
    {id: 1, title: 'GoPro7 Black', price: 22000},
    {id: 2, title: 'GoPro8 Black', price: 27000},
    {id: 3, title: 'GoPro9 Black', price: 35000},
    {id: 4, title: 'GoPro7 Silver', price: 18000},
    {id: 5, title: 'GoPro8 Silver', price: 20000},
    {id: 6, title: 'GoPro Fusion', price: 20000},
    {id: 7, title: 'GoPro9 White'},
    {id: 8, title: 'GoPro7 White', price: 18000},
    {id: 9, title: 'GoPro9 Silver', price: 30000}
];


class Product{
    constructor(product){
        this.id = product.id;
        this.title = product.title;
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
    constructor(products, container = '.products'){ 
        this.container = container;       
        this.products = products;                
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
    constructor(productsInBasket){          
        this.products = productsInBasket;                
    }

    renderBasket(){
        // для отрисовки корзины
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
        //помимо стандартных свойств добавилось количество данного продукта в корзине, по умолчанию - 1
}


// let list = new Catalog(newProducts);
// list.renderPage();


// let bask = new Basket(newProducts);
// console.log(bask.summaryBasket());

// let el = new ProductInBasket({id: 1, title: 'GoPro7 Black', price: 22000});
// console.log(el)