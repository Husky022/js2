const newProducts = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json'
const newProductsInBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json'
const addToBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/addToBasket.json'
const delFromBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/deleteFromBasket.json'

class Product {
    constructor(product) {
        this.id_product = product.id_product;
        this.product_name = product.product_name;
        this.price = product.price;
        // this.img = img;
    }

    showInfo() {
        // выводит инфо о продукте
    }
}

class ProductItem extends Product {
    renderProduct() {
        return `<div class="productItem" data-id="${this.id_product}">
                        <div><img class="productImage" src=${(this.img == undefined) ? "pictures/nophoto.png" : this.img} alt="photo"></div>
                        <h3 class="productName">${this.product_name}</h3>
                        <p class="productPrice">${(this.price == undefined) ? 777 : this.price} руб.</p>
                        <button class="buy-btn"
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-price="${this.price}">Купить</button>
                    </div>`
    }


}

// container = '.products'

class List {
    constructor(url, container, list = list2) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.products = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }

    getJson(url) {
        return fetch(url ? url : this.url)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    unPackData(data) {
        this.products = [...data];
        this.renderPage();
    }


    filter(value) {
        const regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
        this.allProducts.forEach(el => {
            const block = document.querySelector(`.productItem[data-id="${el.id_product}"]`);
            if (!this.filtered.includes(el)) {
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }

    renderPage() {
        const block = document.querySelector(this.container);
        for (let item of this.products) {
            const productObj = new this.list[this.constructor.name](item);
            // console.log(productObj)            
            this.allProducts.push(productObj);
            // console.log(this.allProducts)                        
            block.insertAdjacentHTML('beforeend', productObj.renderProduct())
        }
    }

    summaryBasket() {
        let sum = 0;
        for (let item of this.allProducts) {
            sum += item.price * item.quantity
        }
        return sum;
    }

    addProduct(element) {
        this.getJson(addToBasket)
            .then(data => {
                if (data.result === 1) {
                    // console.log(element)
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find) {
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

    removeProduct(element) {
        this.getJson(delFromBasket)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) {
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

    _updateBasket(product) {
        try {
            let block = document.querySelector(`.productItemInBasket[data-id="${product.id_product}"]`);
            block.querySelector('.productQuantityInBasket').textContent = `${product.quantity} шт.`;
            block.querySelector('.productPriceInBasket').textContent = `${product.quantity * product.price} руб.`;

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


class Catalog extends List {
    constructor(bask, container = '.products', url = newProducts) {
        super(url, container);
        this.bask = bask;
        this.getJson()
            .then(data => this.unPackData(data));
    }
    _init() {
        try {
            document.querySelector(this.container).addEventListener('click', elem => {
                if (elem.target.classList.contains('buy-btn')) {
                    this.bask.addProduct(elem.target);
                }
            })
        } catch {

        }
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            this.filter(document.querySelector('.textSearch').value)
        })

    }


}

class BasketMax extends List {
    constructor(container = '.containerBasket', url = newProductsInBasket) {
        super(url, container);
        this.getJson()
            .then(data => this.unPackData(data.contents));
    }

    renderPage() {
        const block = document.querySelector(this.container);
        let basketMiniStringMain = document.createElement("div");
        basketMiniStringMain.className = "basketMiniStringMain";
        block.append(basketMiniStringMain);
        basketMiniStringMain.innerText = "Ваша корзина:";
        for (let item of this.products) {
            // console.log(this.allProducts)               
            const productObj = new ProductInBasket(item);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.renderProductInBasket())
        }
        // console.log(this.allProducts)  
        var basketMiniStringSummary = document.createElement("div");
        basketMiniStringSummary.className = "basketMiniStringSummary";
        block.append(basketMiniStringSummary);
        basketMiniStringSummary.innerText = `Итого: ${this.summaryBasket()} руб.`;
        var basketCompletedBtn = document.createElement("button");
        basketCompletedBtn.className = "btn-complete";
        block.append(basketCompletedBtn);
        basketCompletedBtn.innerText = `Завершить покупку`;
        let button = document.querySelector('.btn-complete')
        button.addEventListener('click', () => {
            document.querySelector('.containerBasket').classList.toggle('invisible');
            document.querySelector('.orderForm').classList.toggle('invisible');

        })
        document.querySelector('.backToBasket-btn').addEventListener('click', () => {
            document.querySelector('.containerBasket').classList.toggle('invisible');
            document.querySelector('.orderForm').classList.toggle('invisible');

        })
        document.getElementById('contactsForm').addEventListener('submit', e => {
            let valid = new Validator('contactsForm');
            if (!valid.valid) {
                e.preventDefault();
            }
        })
    }


    removeProduct(element) {
        this.getJson(delFromBasket)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) {
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

    _init() {
        try {
            document.querySelector(this.container).addEventListener('click', e => {
                if (e.target.classList.contains('del-btn')) {
                    this.removeProduct(e.target);
                }
            })
        } catch {

        }


    }
}


class BasketMini extends List {
    constructor(container = '.basketMini', url = newProductsInBasket) {
        super(url, container);
        this.getJson()
            .then(data => this.unPackData(data.contents));
    }

    renderPage() {
        try {
            document.querySelector(this.container).innerHTML = '';
            const block = document.querySelector(this.container);
            if (this.allProducts.length == 0) {
                let basketMiniStringMain = document.createElement("div");
                basketMiniStringMain.className = "basketMiniStringMain";
                block.append(basketMiniStringMain);
                basketMiniStringMain.innerText = "Ваша корзина пуста";
                basketMiniStringMain.style.color = "red";
            } else {
                let basketMiniStringMain = document.createElement("div");
                basketMiniStringMain.className = "basketMiniStringMain";
                block.append(basketMiniStringMain);
                basketMiniStringMain.innerText = "Ваша корзина:";
                console.log(this.allProducts)
                for (let item of this.allProducts) {
                    const productObj = new ProductInBasket(item);
                    block.insertAdjacentHTML('beforeend', productObj.renderProductInBasket())
                }
                var basketMiniStringSummary = document.createElement("div");
                basketMiniStringSummary.className = "basketMiniStringSummary";
                block.append(basketMiniStringSummary);
                basketMiniStringSummary.innerText = `Итого: ${this.summaryBasket()} руб.`;
                var basketForwardBtn = document.createElement("button");
                basketForwardBtn.className = "basketForwardBtn";
                block.append(basketForwardBtn);
                basketForwardBtn.innerText = `Перейти к оформлению`;
                basketForwardBtn.setAttribute('onclick', "document.location='basket.html'");
            }
        } catch {

        }
    }

    _init() {
        try {
            document.querySelector('.btnBasketText').addEventListener('click', () => {
                document.querySelector(this.container).classList.toggle('invisible');
            })
        } catch {
        }
        try {
            document.querySelector(this.container).addEventListener('click', e => {
                if (e.target.classList.contains('del-btn')) {
                    this.removeProduct(e.target);
                }
            })
        } catch {
        }
    }

}

class ProductInBasket extends Product {
    constructor(product) {
        super(product);
        this.quantity = product.quantity;
    }

    renderProductInBasket() {
        return `<div class="productItemInBasket" data-id="${this.id_product}">            
            <h3 class="productNameInBasket">${this.product_name}</h3>
            <p class="productQuantityInBasket">${this.quantity} шт.</p>
            <p class="productPriceInBasket">${(this.price == undefined) ? 777 : this.price * this.quantity} руб.</p>
            <button class="del-btn" data-id="${this.id_product}">x</button>
            
        </div>`
    }
}

class Validator {
    constructor(form) {
        this.patterns = {
            name: /^[a-zа-яё]+$/i,
            phone: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,
            email: /^[\w.-]+@\w+\.[a-z]{2,4}$/i
        };
        this.errors = {
            name: 'Введите имя, содержащее только буквы',
            phone: 'Формат телефона +7(900)000-00-00',
            email: 'Введен некорректный email'
        };
        this.errorClass = 'error-msg';
        this.form = form;
        this.valid = false;
        this._validateForm();
    }
    validate(regexp, value) {
        regexp.test(value)
    }

    _validateForm() {
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
        for (let error of errors) {
            error.remove();
        }
        let formFields = [...document.getElementById(this.form).getElementsByTagName('input')];
        for (let field of formFields) {
            this._validate(field);
        }
        if (![...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
            this.valid = true;
        }
    }
    _validate(field) {
        if (this.patterns[field.name]) {
            if (!this.patterns[field.name].test(field.value)) {
                field.classList.add('invalid');
                this._addErrorMsg(field);
                this._watchField(field);
            }
        }
    }
    _addErrorMsg(field) {
        let error = `<div class="${this.errorClass}">${this.errors[field.name]}</div> `;
        field.parentNode.insertAdjacentHTML('beforebegin', error);

    }
    _watchField(field) {
        field.addEventListener('input', () => {
            let error = field.parentNode.querySelector(`.${this.errorClass}`);
            if (this.patterns[field.name].test(field.value)) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                if (error) {
                    error.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if (!error) {
                    document.querySelector(`.${this.errorClass}`).remove();
                    this._addErrorMsg(field);
                }
            }

        })
    }
}





const list2 = {
    Catalog: ProductItem,
    Basket: ProductInBasket
};


let bask2 = new BasketMax();
let bask1 = new BasketMini();
let list1 = new Catalog(bask1);



