new Vue({el:"#app",data:{catalogUrl:"https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json",basketUrl:"https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json",products:[],filtered:[],inBasket:[],userSearch:"",validateString:"",showBasket:!1,showMaxBasket:!0,patterns:{name:/^[a-zа-яё]+$/i,phone:/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,email:/^[\w.-]+@\w+\.[a-z]{2,4}$/i},errors:{name:"Введите имя, содержащее только буквы",phone:"Формат телефона +7(900)000-00-00",email:"Введен некорректный email"}},methods:{getJson(t){return fetch(t||this.catalogUrl).then((t=>t.json())).catch((t=>{console.log(t)}))},postJson(t,e){return fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((t=>t.json())).catch((t=>{this.$refs.error.text=t}))},putJson(t,e){return fetch(t,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((t=>t.json())).catch((t=>{this.$refs.error.text=t}))},deleteJson:t=>fetch(t,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then((t=>t.json())).catch((t=>{console.log(t)})),addProduct(t){let e=this.inBasket.find((e=>e.id_product===t.id_product));if(e)this.putJson(`/api/cart/${e.id_product}`,{quantity:1}).then((t=>{1===t.result&&e.quantity++}));else{const e=Object.assign({quantity:1},t);this.postJson("/api/cart",e).then((t=>{1===t.result&&this.inBasket.push(e)}))}},removeProduct(t){t.quantity>1?this.putJson(`/api/cart/${t.id_product}`,{quantity:-1}).then((e=>{1===e.result&&t.quantity--})):this.deleteJson(`/api/cart/${t.id_product}`).then((e=>{1===e.result&&this.inBasket.splice(this.inBasket.indexOf(t),1)}))},filter(t){const e=new RegExp(t,"i");this.filtered=this.products.filter((t=>e.test(t.product_name)))},summaryBasket(){let t=0;for(let e of this.inBasket)t+=e.price*e.quantity;return t},validate(){}},mounted(){this.getJson("/api/products").then((t=>{for(let e of t)this.$data.products.push(e),this.$data.filtered.push(e)})),this.getJson("/api/cart").then((t=>{for(let e of t.contents)this.$data.inBasket.push(e)}))}});