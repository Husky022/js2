const newProducts = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json'
const newProductsInBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json'
const addToBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/addToBasket.json'
const delFromBasket = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/deleteFromBasket.json'



const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: newProducts,
        basketUrl: newProductsInBasket,
        products: [],
        filtered: [],
        inBasket: [],       
        img: 'pictures/nophoto.png',
        userSearch: '',
        validateString: '',
        showBasket: false,
        showMaxBasket: true,
        patterns = {
                name: /^[a-zа-яё]+$/i,
                phone: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,
                email: /^[\w.-]+@\w+\.[a-z]{2,4}$/i
        },
        errors = {
                name: 'Введите имя, содержащее только буквы',
                phone: 'Формат телефона +7(900)000-00-00',
                email: 'Введен некорректный email'
        }
        
    },
    methods: {
        getJson(url) {
            return fetch(url ? url : this.catalogUrl)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product){
            this.getJson(addToBasket)
                .then(data => {
                    if (data.result === 1) {                    
                    let find = this.inBasket.find(el => el.id_product === product.id_product);
                    if (find) {
                        find.quantity++;                        
                    } else {
                        const prod = Object.assign({quantity: 1}, product);
                        this.inBasket.push(prod)
                    }
                } else {
                    alert('Error');
                }
            })
        },
        removeProduct(product){
            this.getJson(delFromBasket)
                .then(data => {
                    if (data.result === 1) {                   
                        if (product.quantity > 1) {
                            product.quantity--;
                        } else {
                        this.inBasket.splice(this.inBasket.indexOf(product), 1);                        
                    }                   
                } else {
                    alert('Error');
                }
            })
        },
        filter(){
            const regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(product => regexp.test(product.product_name));
        },
        summaryBasket() {
            let sum = 0;
            for (let item of this.inBasket) {
                sum += item.price * item.quantity
            }
            return sum;
        },
        validate(){

        }


    },
    mounted(){
        this.getJson(this.catalogUrl)
            .then(data => {
                for (let item of data){
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
        this.getJson(this.basketUrl)
            .then(data => {
                for (let item of data.contents){                    
                    this.$data.inBasket.push(item);
                }
            });
    }
})


// class Validator {
//     constructor(form) {
//         this.patterns = {
//             name: /^[a-zа-яё]+$/i,
//             phone: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,
//             email: /^[\w.-]+@\w+\.[a-z]{2,4}$/i
//         };
//         this.errors = {
//             name: 'Введите имя, содержащее только буквы',
//             phone: 'Формат телефона +7(900)000-00-00',
//             email: 'Введен некорректный email'
//         };
//         this.errorClass = 'error-msg';
//         this.form = form;
//         this.valid = false;
//         this._validateForm();
//     }
//     validate(regexp, value) {
//         regexp.test(value)
//     }

//     _validateForm() {
//         let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)];
//         for (let error of errors) {
//             error.remove();
//         }
//         let formFields = [...document.getElementById(this.form).getElementsByTagName('input')];
//         for (let field of formFields) {
//             this._validate(field);
//         }
//         if (![...document.getElementById(this.form).querySelectorAll('.invalid')].length) {
//             this.valid = true;
//         }
//     }
//     _validate(field) {
//         if (this.patterns[field.name]) {
//             if (!this.patterns[field.name].test(field.value)) {
//                 field.classList.add('invalid');
//                 this._addErrorMsg(field);
//                 this._watchField(field);
//             }
//         }
//     }
//     _addErrorMsg(field) {
//         let error = `<div class="${this.errorClass}">${this.errors[field.name]}</div> `;
//         field.parentNode.insertAdjacentHTML('beforebegin', error);

//     }
//     _watchField(field) {
//         field.addEventListener('input', () => {
//             let error = field.parentNode.querySelector(`.${this.errorClass}`);
//             if (this.patterns[field.name].test(field.value)) {
//                 field.classList.remove('invalid');
//                 field.classList.add('valid');
//                 if (error) {
//                     error.remove();
//                 }
//             } else {
//                 field.classList.remove('valid');
//                 field.classList.add('invalid');
//                 if (!error) {
//                     document.querySelector(`.${this.errorClass}`).remove();
//                     this._addErrorMsg(field);
//                 }
//             }

//         })
//     }
// }





// const list2 = {
//     Catalog: ProductItem,
//     Basket: ProductInBasket
// };


// let bask2 = new BasketMax();
// let bask1 = new BasketMini();
// let list1 = new Catalog(bask1);



