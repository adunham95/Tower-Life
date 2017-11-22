let tower = [];
let money;
let citizen = [];
let cheat = 0;

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
    let browser = {
        'Browser Codename': navigator.appCodeName,
        'Browser Name': navigator.appName,
        'BrowserVersion':navigator.appVersion,
        'Cookies enabled':navigator.cookieEnabled,
        'Browser Language':navigator.language,
        'Browser Online':navigator.onLine,
        'Platform':navigator.platform,
        'User agent header':navigator.userAgent
    };
    console.log(browser);

    //Gets the tower ID
    let id = window.localStorage.getItem("TowerID");

    //Checks to see the is there is already a tower
    if(id === null){
       newTower()
    }
    else {
        //Gets the tower from local storage and sets it to the tower length
        tower = JSON.parse(window.localStorage.getItem("TowerFloors"));
        // console.log(tower);
    }

    //Dev Check
    let devOptions = window.localStorage.getItem("DevOptions");
    let devCreative = window.localStorage.getItem("CreativeMode");
    let devApartments = window.localStorage.getItem("DevApartment");
    if(devOptions === 'enabled'){
        document.getElementById('devOptions').style.display = 'flex';
        document.getElementById('tower').style.marginBottom = '50px';
        if(devCreative === 'enabled'){
            let e =document.getElementsByClassName('nav')[0];
            e.style.backgroundColor ='#F4511E';
        }
    }
    if(devApartments === 'enabled'){
        let beta = document.getElementsByClassName('beta');
        for (let i=0; i<beta.length; i++){
            beta[i].style.display = 'inherit';
        }
    }

    //Displays the amount of the money the user has
    money = window.localStorage.getItem("Money");
    document.getElementById("money").innerText = '$'+money;

    //Gets the tenants
    citizen = JSON.parse(window.localStorage.getItem("Tenates"));

    //Displays the cost of the next floor
    document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);

    render();

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
                    stockRoom(event, i);
                });
                supplyRoom.disabled = false;

            }
        }
    }, 500);
}

function render() {
    document.getElementById('tower').innerHTML = '';
    //Displays the floors
    for(let i = 0; i < tower.length; i++) {
        displayFloor(i);
    }
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

function Apartment(name,  colors) {
    //Creates a new apartment in tower
    this.id = generateID();
    this.name = name;
    this.type = "Apartment";
    this.color= colors;
    this.stockRoom = {expires: 0};
    this.residents = [];
}

function Person(fname, lname, home, job, bio) {
    //Creates a person in the tower

    this.id = generateID();
    this.fname = fname;
    this.lname = lname;
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

function createNewFloor(randomness, type) {
    let newFloor;
    let name = document.getElementById("name").value;
    let nameApt = document.getElementById('nameApt').value;
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
    if(name === 'Store Name' || name === ''){
        name = category;
    }
    else if (nameApt === 'Apartment Name' || nameApt === ''){
        nameApt = getRandom('aptName')
    }

    //If Store or apartment
    if (type === "Store"){
        newFloor = new Store(name, category, color, 1 + (parseInt(floor)/10 ));
        //Closes the create menu
    }
    else if(type === 'Apartment') {
        newFloor = new Apartment(nameApt, [getRandom("color")]);
    }

    // console.table(newFloor);

    //CreativeMode
    let creative = window.localStorage.getItem("CreativeMode");

    //Takes the money from the uses account to purchase the new floor
    let purchased;
    if(creative === 'enabled'){
        purchased = true;
    }
    else {
        purchased = wallet(-(floor * 1000));
    }


    if(purchased === true){
        toggleNav('navExpanded');
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
    let fname = document.getElementById("fName").value;
    let lname = document.getElementById("lName").value;
    let home = 0;
    // let bio = document.getElementById("bio").value;

    // If the name is blank
    if(fname === 'First Name' || fname === ''){
        fname = getRandom("first");
    }
    if(lname === 'Last Name' || lname === ''){
        lname = getRandom("last");
    }

    for(let i = 0; i <= tower.length; i++) {
        if(i === tower.length){
            displayError("There are no available apartments")
        }
        else if(tower[i].type === "Apartment"){
            home = i;
            if(tower[i].residents.length === 4){
                displayError("Four residents per apartment")
            }
            else {
                newPerson = new Person(fname, lname, home, 2);
                let newHome =tower[home].residents;
                newHome.push(newPerson);
                // citizen.push(newPerson);
                // window.localStorage.setItem("Tenates", JSON.stringify(citizen));
                window.localStorage.setItem("TowerFloors", JSON.stringify(tower));

            }
            render();
            break
        }
    }


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
        let categories = ["Car Dealership", "Grocery Store", "Jewellery Store", "Flower Store", "Beauty Salon", "Butcher", "Toy Store", "Music Store", "Clothes Store","Book Store","Tech Store","Sports Store","E-Store","Dollar Store"];
        return categories[Math.floor(Math.random() * categories.length)]
    }
    else if(type === 'aptName'){
        let name = ["Hill Apartments", "One Hill Apartments"];
        return name[Math.floor(Math.random() * name.length)]
    }
}

function displayFloor(i) {
    // console.log(tower[i]);

    //Creates the elements
    let targetElement = document.getElementById("tower");
    let divFloor = document.createElement("div");
    let divElevator = document.createElement("div");
    let divRoom = document.createElement("div");

    // //Sets the ids classes for the elements
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
    else if(tower[i].type === 'Apartment'){
        divRoom.innerHTML = `
            <div class="storeFront">
                <div>${tower[i].name}</div>
                <div></div>
                <div>
                    <button onclick="toggleNav('${tower[i].id}C')">Citizens</button>
                    <button onclick="toggleNav('${tower[i].id}SR')" class="info"><i class="fa fa-ellipsis-v-alt"></i></button>
                </div>
            </div>
            <div class="stockRoom" id="${tower[i].id}SR">
                <input id="${tower[i].id}Name" type="text" value="${tower[i].name}" class="stockBtn">
                <a onclick="updateFloor(${i})" href="#" class="update stockBtn">Update Apartment</a>
                <a onclick="deleteFloor(${i})" href="#" class="delete stockBtn">Delete Apartments</a>
            </div>
            <div class="stockRoom" id="${tower[i].id}C">
                ${tower[i].residents.map(resident => `<div><i class="fa fa-user-alt"></i> ${resident.fname} ${resident.lname}</div>`).join('')}
                
               
            </div>`

    }
    else if(tower[i].stockRoom.count >= 1000){
        divRoom.innerHTML = `
            <div class="storeFront">
                <div>${tower[i].name}</div>
                <div>
                     <button id="${tower[i].id}stock" disabled>Stocking...</button>
                    <button onclick="toggleNav('${tower[i].id}SR')" class="info"><i class="fa fa-ellipsis-v-alt"></i></button>
                </div>
            </div>
            <div class="stockRoom" id="${tower[i].id}SR">
                <input id="${tower[i].id}Name" type="text" value="${tower[i].name}" class="stockBtn">
                <a onclick="updateFloor(${i})" href="#" class="update stockBtn">Update Store</a>
                <a onclick="deleteFloor(${i})" href="#" class="delete stockBtn">Delete Store</a>
            </div>`
    }
    else {
        divRoom.innerHTML = `
            <div class="storeFront">
                <div>${tower[i].name}</div>
                <div>
                    <button id="${tower[i].id}stock" onclick="stockRoom(event, ${i});">Stock floor: $${(multiplier(i) * 250)}</button>
                    <button onclick="toggleNav('${tower[i].id}SR')" class="info"><i class="fa fa-ellipsis-v-alt"></i></button>              
                </div>
            </div>
            <div class="stockRoom" id="${tower[i].id}SR">
                <input id="${tower[i].id}Name" type="text" value="${tower[i].name}" class="stockBtn">
                <a onclick="updateFloor(${i})" href="#" class="update stockBtn">Update Store</a>
                <a onclick="deleteFloor(${i})" href="#" class="delete stockBtn">Delete Store</a>
            </div>`;
    }

    // document.getElementById('ex1').addEventListener('click', function(e){
    //     e.stopPropagation();
    //     this.style.backgroundColor = 'deeppink';
    // },false);


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


function stockRoom(e, i) {

    let supplyRoom = document.getElementById(tower[i].id + "stock");
    supplyRoom.disabled = true;
    e.stopImmediatePropagation();

    console.log(supplyRoom.disabled);
    console.log(supplyRoom.innerText);

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
        supplyRoom.disabled= true;

        //Stores the room has been stocked
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        console.log(supplyRoom.disabled);
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

function updateFloor(i) {
    let newName = document.getElementById(tower[i].id + "Name").value;
    tower[i].name = newName;
    //Stores new name
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    //Rebuilds the tower
    document.getElementById("tower").innerHTML = '';
    for(let i = 0; i < tower.length; i++) {
        displayFloor(i);
    }
    // console.log("Name updated to: " + newName);
    toggleNav(tower[i].id + 'SR')
}

function deleteFloor(i) {
    // console.log(tower[i].id + ' deleted');
    tower = tower.filter(item => item !== tower[i]);
    //Stores new name
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    //Rebuilds the tower
    document.getElementById("tower").innerHTML = '';
    for(let i = 0; i < tower.length; i++) {
        displayFloor(i);
    }
    //Displays the cost of the next floor since the height has changed
    document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
}

function cheater() {
    cheat++;

    if(cheat === 5){
        console.log("DevOptions enabled");
        window.localStorage.setItem("DevOptions", 'enabled');
        document.getElementById('devOptions').style.display = 'flex';
        displayError("DevOps Enabled");
        document.getElementById('tower').style.marginBottom = '50px';
    }
}

function devOption() {
    let option = document.getElementById('devText').value;

    if(option === 'disable'){
        console.log("DevOptions disabled");
        window.localStorage.setItem("DevOptions", 'disabled');
        document.getElementById('devOptions').style.display = 'none';
        document.getElementById('tower').style.marginBottom = '0px';
    }
    else if(option === 'millionaire'){
        wallet(1000000)
    }
    else if(option === 'broke'){
        wallet(-money)
    }
    else if(option === 'creative-on'){
        window.localStorage.setItem("CreativeMode", 'enabled');
        let e =document.getElementsByClassName('nav')[0];
        e.style.backgroundColor ='#F4511E';
    }
    else if(option === 'creative-off'){
        window.localStorage.setItem("CreativeMode", 'disabled');
        let e =document.getElementsByClassName('nav')[0];
        e.style.backgroundColor ='#607D8B';
    }
    else if (option === 'enable-apt'){
        window.localStorage.setItem("DevApartment", 'enabled');
        let apt = document.getElementsByClassName('beta');
        for (let i=0; i<apt.length; i++){
            apt[i].style.display = 'inherit';
        }
    }
    else if(option === 'tesla'){
        let newFloor = new Store('Tesla', "Car Company", ["#cc0000"], 1 + (parseInt(tower.length)/10 ));
        console.log(newFloor);

        tower.push(newFloor);
        console.log(tower);
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        displayFloor(tower.length - 1);
        //Displays the cost of the next floor
        document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
    }
    else if(option === 'elon'){
        for(let i = 0; i <= tower.length; i++) {
            if(i === tower.length){
                displayError("There are no available apartments")
            }
            else if(tower[i].type === "Apartment"){
                let home = i;
                if(tower[i].residents.length === 4){
                    displayError("Four residents per apartment")
                }
                else {
                    let newPerson = new Person("Elon", "Musk", home, 2);
                    let newHome =tower[home].residents;
                    newHome.push(newPerson);
                    // citizen.push(newPerson);
                    // window.localStorage.setItem("Tenates", JSON.stringify(citizen));
                    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));

                }
                render();
                break
            }
        }

    }
    else if(option === 'panther'){
        let newFloor = new Store('Panthers', "Sports Team", ["#0085CA"], 1 + (parseInt(tower.length)/10 ));
        console.log(newFloor);

        tower.push(newFloor);
        console.log(tower);
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        displayFloor(tower.length - 1);
        //Displays the cost of the next floor
        document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
    }
}