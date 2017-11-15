let tower = [];
let money;
let citizen = [];

//Creates a new tower
function newTower() {
    // console.log("New Tower");

    //Sets Base Values
    document.getElementById("tower").innerHTML = '';
    tower = [];
    citizen = [];
    money = 5000;

    //Adds the lobby to the tower
    tower = [{
        id:"lobby",
        name:"Lobby",
        type:"Store",
        color:["#DC143C","#1E90FF"] //Primary Secondary
    }];
    //Displays the lobby
    displayFloor(0);

    document.getElementById("money").innerText = '$'+money;
    citizen = [];
    toggleNav('navExpanded');

    window.localStorage.setItem("TowerID", generateID());
    window.localStorage.setItem("Money", 5000);
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    window.localStorage.setItem("Tenates", JSON.stringify(citizen));

    //Displays the cost of the next floor
    document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);

}

window.onload = onLoad();

function onLoad() {
    //Gets the tower ID
    let id = window.localStorage.getItem("TowerID");


    if(id === null){
       newTower()
    }
    else {
        //Gets the tower from local storage and sets it to the tower length
        tower = JSON.parse(window.localStorage.getItem("TowerFloors"));
        // console.log(tower);
    }

    //Displays the amount of the money the user has
    money = window.localStorage.getItem("Money");
    document.getElementById("money").innerText = '$'+money;

    //Gets the tenants
    citizen = JSON.parse(window.localStorage.getItem("Tenates"));

    //Displays the cost of the next floor
    document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);

    //Displays the floors
    for(let i = 0; i < tower.length; i++) {
        displayFloor(i);
    }

    //Watches the stockroom expiration date to see if its expired

    window.setInterval(function(){
        let currentTime = new Date();
        for(let i = 1; i < tower.length; i++) {
            if(new Date(tower[i].stockRoom.expires) <= currentTime && tower[i].stockRoom.expires !== 0){
                // console.log("Expired");
                tower[i].stockRoom.expires = 0;
                tower[i].stockRoom.count = 0;

                //Stores the room has been stocked
                window.localStorage.setItem("TowerFloors", JSON.stringify(tower));

                //Adds the cost of purchased merchandise
                let purchasedMerch = (300 * multiplier(i) );
                // console.log(purchasedMerch);
                wallet(purchasedMerch);

                //Sets the button up to be stocked again
                let supplyRoom = document.getElementById(tower[i].id + "stock");
                // console.log(tower[i].id + "stock");
                supplyRoom.innerText = `Stock floor: $${(multiplier(i) * 250)}`;
                supplyRoom.addEventListener ("click", function () {
                    stockRoom(i);
                });
                supplyRoom.disabled = false;

            }
        }
    }, 500);

}

function Store(name, category, colors, multiplier) {
    //Creates a new store in the tower

    this.id = generateID();
    this.name = name;
    this.type = "Store";
    this.storeCategory = category;
    this.color= colors;
    this.stockRoom = {item: "Item", count: 0, expires: 0, multiplier: multiplier};
}

function Apartment(name, floor, colors) {
    //Creates a new apartment in tower
    this.id = generateID();
    this.name = name;
    this.type = "Apartment";
    this.floor = floor;
    this.color= colors;
    this.changeFloor = function (newFloorNumber) {
        this.floor = newFloorNumber;
    }
}

function Person(name, bio, home, job) {
    //Creates a person in the tower

    this.id = generateID();
    this.name = name;
    this.bio = bio;
    this.home = home;
    this.job = job;
}

function generateID() {
    //Generates a random 6 digit id
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) +Math.floor(Math.random() * 9);
    return randLetter;
}

function createNewFloor(randomness) {
    let newFloor;
    let name = document.getElementById("name").value;
    let type = document.getElementById("type").value;
    let category;
    let color = [document.getElementById("color").value];
    let floor = (tower.length);

    //Random Floor
    if(randomness === 'random'){
        category = getRandom('category');
        color = [getRandom("color")];
    }
    //Custom Floor
    else {
        category = document.getElementById("category").value;
    }

    //If no color is selected
    if(color === '#fff'){
        color = [getRandom("color")];
    }

    //If the name is blank it will be the category value
    if(name === 'Store Name'){
        name = category;
    }

    //If Store or apartment
    if (type === "Store"){
        newFloor = new Store(name, category, color, 1 + (parseInt(floor)/10 ));
        //Closes the create menu
    }
    else {
        newFloor = new Apartment(name,  color);
    }

    // console.table(newFloor);


    //Takes the money from the uses account to purchase the new floor
    let purchased = wallet(-(floor * 1000));

    if(purchased === true){
        toggleNav('navExpanded')
        tower.push(newFloor);
        // console.log(tower);
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        displayFloor(floor);
        //Displays the cost of the next floor
        document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
    }
    else {
        setTimeout(function(){ toggleNav('navExpanded') }, 3000);
    }
}

function createNewPerson() {
    let newPerson;
    let name = [];
    let bio = document.getElementById("bio").value;

    // If the name is blank it will be the category value
    if(document.getElementById("firstName").value==='' && document.getElementById("lastName").value===''){
        // console.log("Getting random");
        name = [getRandom("first"),getRandom("last")];
    }
    else {
        // console.log("Given");
        // console.log(document.getElementById("firstName").value);
        name = [document.getElementById("firstName").value, document.getElementById("lastName").value];
    }

    newPerson = new Person(name, bio, 1, 1);
    // console.log(newPerson);

    citizen.push(newPerson);
    // console.log(citizen);
    window.localStorage.setItem("Tenates", JSON.stringify(citizen));

}

function getRandom(type) {
    if(type === "color"){
        let colors = ['#f7556e', '#b3187d', '#d44d47', '#7fafea', '#aa78db', '#8b6715', '#3a8f96', '#7b35b0', '#98d70c', '#d0793e'];
        return colors[Math.floor(Math.random() * colors.length)]
    }
    else if (type === "first"){
        let first = ["John", "Steve"];
        return first[Math.floor(Math.random() * (first.length))];
    }
    else if (type === "last"){
        let last = ["Smith", "Hyde", "Stevens"];
        return last[Math.floor(Math.random() * last.length)];
    }
    else if (type === 'category'){
        let categories = ["Car Dealership", "Grocery Store", "Jewellery Store", "Flower Store", "Beauty Salon", "Butcher", "Toy Store", "Music Store", "Clothes Store","Book Store","Tech Store","Sports Store","E-Store","Dollar Store","Brand Store"];
        return categories[Math.floor(Math.random() * categories.length)]
    }
}

function displayFloor(i) {
    // console.log(tower[i]);

    //Creates the elements
    let targetElement = document.getElementById("tower");
    let divFloor = document.createElement("div");
    let divElevator = document.createElement("div");
    let divRoom = document.createElement("div");
    let supplyRoom = document.createElement("button");
    let info = document.createElement("button");

    //Sets the ids classes for the elements
    supplyRoom.id = tower[i].id + "stock";
    divFloor.className = "floor";
    divElevator.className = "elevator";
    divRoom.className = "room";
    info.innerText = "i";
    info.className = "info";
    divRoom.id = tower[i].id;

    //Sets the background color of the room
    divRoom.style = "background: " + tower[i].color[0];

    //Add the floor number to the elevator
    divElevator.innerHTML = "<h1>" + i + "</h1>";
    //Displays the room name in the room
    if(i === 0){
        divRoom.innerHTML = tower[i].name;
    }
    else if(tower[i].stockRoom.count >= 1000){
        divRoom.innerHTML = `<div>${tower[i].name}</div>`;
        supplyRoom.innerText = "Stocking...";
        supplyRoom.disabled = true;
        divRoom.appendChild(supplyRoom);
        // divRoom.appendChild(info);
    }
    else {
        divRoom.innerHTML = `<div>${tower[i].name}</div>`;
        supplyRoom.innerText = `Stock floor: $${(multiplier(i) * 250)}`;
        supplyRoom.addEventListener ("click", function () {
            stockRoom(i);
        });
        divRoom.appendChild(supplyRoom);
    }

    //Binders
    divFloor.appendChild(divElevator);
    divFloor.appendChild(divRoom);

    targetElement.appendChild(divFloor);
}

function toggleNav(item) {
    if(document.getElementById(item).style.display === "flex"){
        document.getElementById(item).style.display = "none";
    }
    else{
        document.getElementById(item).style.display = "flex";
    }
}


function stockRoom(i) {

    let supplyRoom = document.getElementById(tower[i].id + "stock");
    supplyRoom.disabled = true;

    let timeInMinutes = tower[i].stockRoom.multiplier || 1;
    let currentTime = Date.parse(new Date());
    let deadline = new Date(currentTime + timeInMinutes*60*1000);
    // console.log(timeInMinutes*60*1000);
    // console.log(timeInMinutes);

    //Takes away the cost of merchandise
    let purchased = wallet(-(250 * multiplier(i)));

    if(purchased === true){
        // document.getElementById(tower[index].id).innerHTML = `<span>${tower[index].name}</span>`;

        //Stocks the room
        tower[i].stockRoom.count = 1000;
        // console.log(tower[index]);
        tower[i].stockRoom.expires = deadline;

        // console.log(tower[i].id + "stock");
        supplyRoom.innerText = "Stocking...";

        //Stores the room has been stocked
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    }
    else{
        supplyRoom.disabled = false;
    }

    console.log(tower[i]);
}

function wallet(amount) {
    //Creates a temp value for the money amount
    let newMoney = parseInt(money) + parseInt(amount);
    console.log(money +"+"+ parseInt(amount) +"="+parseInt(newMoney));

    //Sees is you have enough money to purchase the item
    if(parseInt(newMoney) < 0){
        displayError("Not enough money");
        return false
    }
    else{
        //If the user has enough money the money is deducted fom there account
        money = parseInt(newMoney);
        // console.log("Updated wallet to " + money);

        //Save the amount of money the user has in local storage
        window.localStorage.setItem("Money", money);
        //Displays that the amount of money on the screen
        document.getElementById("money").innerText = `$${money}`;
        return true
    }
}

function displayError(message) {
    //Displays the banner
    document.getElementById("error").style.display = "flex";
    //Displays the message in the banner
    document.getElementById("error").innerHTML = `<p>${message}</p>`;

    //Hides the banner after 3 seconds
    setTimeout(function(){
        document.getElementById("error").style.display = "none"
        }, 3000);
}

function multiplier(i, base) {
    if(i === 0){
    }
    else if(tower[i].stockRoom.multiplier === undefined){
        return 1
    }
    else {
        return tower[i].stockRoom.multiplier
    }
}