Vue.component('basket-mini', {
    props: ['inBasket'],
    template: `
        <div class="basketMini" v-show="$parent.showBasket">
            <div v-if="!inBasket.length" class="basketMiniStringMain" style="color:rgb(255, 0, 0)">Ваша корзина пуста</div>
            <div v-else class="basketMiniStringMain">Ваша корзина</div>
            <product-in-basket v-for="product of inBasket" :key="product.id_product" :product-in-basket="product"></product-in-basket>
        </div>
    `
});

Vue.component('product-in-basket', {
    props: ['productInBasket'],
    template: `
    <div>
        <div class="productItemInBasket"> 
            <h3 class="productNameInBasket">{{productInBasket.product_name}}</h3>
            <p class="productQuantityInBasket">{{productInBasket.quantity}} шт.</p>
            <p class="productPriceInBasket">{{(productInBasket.price == undefined) ? 777 : productInBasket.price * productInBasket.quantity}} руб.</p>
            <button class="del-btn" @click="$parent.$emit('removeProduct', productInBasket)">x</button>
        </div>
        <div v-if="$parent.inBasket.length" class="basketMiniStringSummary">Итого {{$root.summaryBasket()}} руб.</div>
        <button v-if="$parent.inBasket.length" onclick="location.href = 'basket.html'" class="basketForwardBtn">Перейти к оформлению</button>
        </div>
    </div>
    `
})

/* <div class="basketMini" v-show="showBasket">
<div v-if="!inBasket.length" class="basketMiniStringMain" style="color:rgb(255, 0, 0)">Ваша корзина пуста</div>
<div v-else class="basketMiniStringMain">Ваша корзина</div>
<div class="productItemInBasket" v-for="product in inBasket":key="product.id_product">
    <h3 class="productNameInBasket">{{product.product_name}}</h3>
    <p class="productQuantityInBasket">{{product.quantity}} шт.</p>
    <p class="productPriceInBasket">{{(product.price == undefined) ? 777 : product.price * product.quantity}} руб.</p>
    <button class="del-btn" @click=removeProduct(product)>x</button>
</div>
<div v-if="inBasket.length" class="basketMiniStringSummary">Итого {{summaryBasket()}} руб.</div>
<button v-if="inBasket.length" onclick="location.href = 'basket.html'" class="basketForwardBtn">Перейти к оформлению</button>
</div> */