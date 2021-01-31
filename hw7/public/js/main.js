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
        userSearch: '',
        validateString: '',
        showBasket: false,
        showMaxBasket: true,
        patterns: {
                name: /^[a-zа-яё]+$/i,
                phone: /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,
                email: /^[\w.-]+@\w+\.[a-z]{2,4}$/i
        },
        errors: {
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
        postJson(url, data){
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(result => result.json())
                .catch(error => {
                    // console.log(error)
                    this.$refs.error.text = error;
                })
        },
        putJson(url, data){
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(result => result.json())
                .catch(error => {
                    // console.log(error)
                    this.$refs.error.text = error;
                })
        },
        deleteJson(url){
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(result => result.json())
                .catch(error => {
                    console.log(error);                    
                })
        },
        addProduct(item){
            let find = this.inBasket.find(el => el.id_product === item.id_product);
            if(find){
                this.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if(data.result === 1){
                            find.quantity++
                        }
                    })
            } else {
                const prod = Object.assign({quantity: 1}, item);
                this.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result === 1){
                            this.inBasket.push(prod)
                        }
                    })
            }
        },
        removeProduct(item) {
            if(item.quantity > 1){
                this.putJson(`/api/cart/${item.id_product}`, {quantity: -1})
                    .then(data => {
                        if(data.result === 1){
                            item.quantity--;
                        }
                    })
            } else {
                this.deleteJson(`/api/cart/${item.id_product}`)
                    .then(data => {
                        if(data.result === 1){
                            this.inBasket.splice(this.inBasket.indexOf(item), 1)
                        }
                    })
            }
        },
        filter(userSearch){
            const regexp = new RegExp(userSearch, 'i');
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
        this.getJson(`/api/products`)
            .then(data => {
                for (let item of data){
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
        this.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){                    
                    this.$data.inBasket.push(item);
                }
            });
    }
})

