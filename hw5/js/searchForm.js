Vue.component('search-form', {
    data(){
        return {
            userSearch: ''
        }
    },
    template: 
    `
        <form action="#" class="search-form" @submit.prevent="$parent.filter(userSearch)">
        <input class="textSearch" type="text" placeholder="Поиск.." v-model="userSearch">
        <button class="submitSearch" type="submit"><img class="logo-search" src="icons/search.png" alt="search"><i class="fas fa-search"></i></button>
        </form>
    `



})