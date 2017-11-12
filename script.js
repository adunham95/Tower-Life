let tower = [];
let money;

//Creates a new tower
function newTower() {
    window.localStorage.setItem("TowerID", generateID());
    window.localStorage.setItem("Money", 5000);
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower))
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
            floor:0,
            color:["#DC143C","#1E90FF"] //Primary Secondary
        });
        newTower()

    }
    else {
        //Gets the tower from local storage and sets it to the tower length
        tower = JSON.parse(window.localStorage.getItem("TowerFloors"));
        console.log(tower);
    }

    //Displays the amount of the money the user has
    money = window.localStorage.getItem("Money");
    document.getElementById("money").innerText = '$'+money;

    for(let i = 0; i < tower.length; i++){
       displayFloor(i)
    }
}

function Store(name, category, floor, colors) {
    //Creates a new store in the tower

    this.id = generateID();
    this.name = name;
    this.type = "Store";
    this.storeCategory = category;
    this.floor = floor;
    this.color= colors;
    this.stockRoom = [];
    this.stockFloor = function (item, count, i) {
        this.stockRoom[i] = {"Item": item, "Count": count}
    };
    this.changeFloor = function (newFloorNumber) {
        this.floor = newFloorNumber;
    }
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

function Person(name, home, job) {
    //Creates a person in the tower

    this.id = generateID();
    this.name = name;
    this.home = home;
    this.job = job;
}

function generateID() {
    //Generates a random 6 digit id
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) +Math.floor(Math.random() * 9);
    console.log(randLetter);
    return randLetter;
}

function createNewFloor() {
    let newFloor;
    let name = document.getElementById("name").value;
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let color = [document.getElementById("color").value];
    let floor = (tower.length);

    //If the name is blank it will be the category value
    if(name === ''){
        name = category;
    }

    //If no color is selected
    if(color === '#fff'){
        color = [randColor()];
    }

    if (type === "Store"){
        newFloor = new Store(name, category, floor, color);
    }
    else {
        newFloor = new Apartment(name, floor, color);
    }
    console.log(newFloor);

    tower.push(newFloor);
    console.log(tower);
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    displayFloor(floor);

    //Takes the money from the uses account to purchase the new floor
    money -= (floor * 1000);
    window.localStorage.setItem("Money", money);
    document.getElementById("money").innerText = '$'+money;
}

function randColor() {
    let colors = ['#f7556e', '#b3187d', '#d44d47', '#7fafea', '#aa78db', '#8b6715', '#3a8f96', '#7b35b0', '#98d70c', '#d0793e'];
    return colors[Math.floor(Math.random() * colors.length)]
}

function displayFloor(i) {
    console.log(tower[i]);

    //Creates the elements
    let targetElement = document.getElementById("tower");
    let divFloor = document.createElement("div");
    let divElevator = document.createElement("div");
    let divRoom = document.createElement("div");
    // let supplyRoom = document.createElement("button");

    //Sets the classes for the elements
    divFloor.className = "floor";
    divElevator.className = "elevator";
    divRoom.className = "room";

    //Sets the background color of the room
    divRoom.style = "background: " + tower[i].color[0];

    //Add the floor number to the elevator
    divElevator.innerHTML = "<h1>" + i + "</h1>";
    //Displays the room name in the room
    divRoom.innerHTML = tower[i].name;
    //Adds text to supply room
    // supplyRoom.innerText = "Supply Room";

    //Binders
    divFloor.appendChild(divElevator);
    divFloor.appendChild(divRoom);
    // divRoom.appendChild(supplyRoom);

    targetElement.appendChild(divFloor);
}