class Burger{
    constructor(callories = 20, price = 50){
        this.callories = callories;       
        this.price = price;
    }

    addCheese(){
        this.callories += 20;
        this.price += 10;
    }

    addSalad(){
        this.callories += 5;
        this.price += 20;
    }

    addPotato(){
        this.callories += 10;
        this.price += 15;
    }

    addSpice(){        
        this.price += 15;
    }

    addMayonnaise(){
        this.callories += 5;
        this.price += 20;
    }

    showInfo(){
        console.log(this.callories + ' каллорий, ' + this.price + ' руб.');        
    }
}

class MiniBurger extends Burger{    
}

class BigBurger extends Burger{
    constructor(callories, price){
        super(callories = 40, price = 100); 
    }
}

let burger1 = new MiniBurger();

burger1.addPotato();
burger1.addPotato();
burger1.showInfo();

let burger2 = new BigBurger();
burger2.showInfo();
burger2.addPotato();
burger2.showInfo();

