const products = [
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
//Функция для формирования верстки каждого товара
const renderProduct = product => {
    return `<div class="productItem">
                <div><img class="productImage" src="pictures/nophoto.png" alt="photo"></div>
                <h3 class="productName">${product.title}</h3>
                <p class="productPrice">${(product.price == undefined)? 777: product.price} руб.</p>
                <button class="buy-btn">Купить</button>
            </div>`
};
const renderPage = list => {
    const productsList = list.map(item => renderProduct(item)).join('');
    console.log(productsList);
    document.querySelector('.products').innerHTML = productsList;
};

renderPage(products);