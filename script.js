let tower = [];
let money;
let citizen = [];

//Creates a new tower
function newTower() {
    window.localStorage.setItem("TowerID", generateID());
    window.localStorage.setItem("Money", 5000);
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    // citizen = [];
    window.localStorage.setItem("Tenates", JSON.stringify(citizen));

}

function onLoad() {
    //Gets the tower ID
    let id = window.localStorage.getItem("TowerID");


    if(id === null){
        //Adds the lobby
        tower.push({
            id:generateID(),
            name:"Lobby",
            type:"Store",
            color:["#DC143C","#1E90FF"] //Primary Secondary
        });
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

    // for(let i = 0; i < tower.length; i++){
    //     displayFloor(i);
    // }

    window.setInterval(function(){
        reload()
    }, 500);

}


function reload() {
    // console.log("Reloaded");
    document.getElementById("tower").innerHTML = '';
    let currentTime = new Date();
    // console.log(tower);
    // console.log("Current: " + currentTime);
    for(let i = 0; i < tower.length; i++) {
        if( i!==0){
            // console.log("Expire: " + new Date(tower[i].stockRoom.expires));
            if(new Date(tower[i].stockRoom.expires) <= currentTime && tower[i].stockRoom.expires !== 0){
                // console.log("Expired");
                tower[i].stockRoom.expires = 0;
                tower[i].stockRoom.count = 0;

                //Stores the room has been stocked
                window.localStorage.setItem("TowerFloors", JSON.stringify(tower));

                //Takes away the cost of merchandise
                wallet(750);

            }
        }
        displayFloor(i);
    }
}

function Store(name, category, colors) {
    //Creates a new store in the tower

    this.id = generateID();
    this.name = name;
    this.type = "Store";
    this.storeCategory = category;
    this.color= colors;
    this.stockRoom = {item: "Item", count: 0, expires: 0};
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
    if(name === ''){
        name = category;
    }

    //If Store or apartment
    if (type === "Store"){
        newFloor = new Store(name, category, color);
    }
    else {
        newFloor = new Apartment(name,  color);
    }

    // console.log(newFloor);

    tower.push(newFloor);
    // console.log(tower);
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    displayFloor(floor);

    //Takes the money from the uses account to purchase the new floor
    wallet(-(floor * 1000));
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

    //Sets the classes for the elements
    divFloor.className = "floor";
    divElevator.className = "elevator";
    divRoom.className = "room";
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
        divRoom.innerHTML = `<span>${tower[i].name}</span> <span>Stocked</span>`;
    }
    else {
        divRoom.innerHTML = `<span>${tower[i].name}</span> <span>Unstocked</span>`;
        supplyRoom.innerText = "Supply Room";
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

function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

function stockRoom(index) {

    let timeInMinutes = 1;
    let currentTime = Date.parse(new Date());
    let deadline = new Date(currentTime + timeInMinutes*60*1000);

    //Stocks the room
    tower[index].stockRoom.count = 1000;
    // console.log(tower[index]);
    tower[index].stockRoom.expires = deadline;

    //Stores the room has been stocked
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));

    //Takes away the cost of merchandise
    wallet(-500);

    document.getElementById(tower[index].id).innerHTML = `<span>${tower[index].name}</span> <span>Stocked</span>`;
}

function reset() {
    // console.log("RESET");
    tower = [{
        id:generateID(),
        name:"Lobby",
        type:"Store",
        color:["#DC143C","#1E90FF"] //Primary Secondary
    }];
    money = 5000;
    document.getElementById("money").innerText = '$'+money;
    citizen = [];
    newTower();
    reload();
}

function wallet(amount) {
    money = parseInt(money) + amount;
    // console.log("Updated wallet to " + money);
    window.localStorage.setItem("Money", money);
    document.getElementById("money").innerText = `$${money}`;
}

function displayError() {

}