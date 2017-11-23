let tower = [];
let money;
let cheat = 0;

//Creates a new tower
function newTower() {
    // console.log("New Tower");

    //Sets Base Values
    tower = [];
    citizen = [];
    money = 5000;

    //Adds the lobby to the tower
    tower = [{
        id:"lobby",
        name:"Lobby",
        type:"Store",
        color:["linear-gradient(to right, #16a085, #f4d03f)"], //Primary Secondary
    }];
    //Rerenders the tower
    render()

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

    //If Store or apartment
    if (type === "Store"){
        //If the name is blank it will be the category value
        if(name === 'Level Name' || name === ''){
            name = category;
        }
        newFloor = new Store(name, category, color, 1 + (parseInt(floor)/10 ));
        //Closes the create menu
    }
    else if(type === 'Apartment') {
        //If the name is blank it will be get a random name
        if (name === 'Level Name' || name === ''){
            name = getRandom('aptName')
        }
        newFloor = new Apartment(name, color);
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
        displayMessage(newFloor.name + ' added', 'success');
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
            displayMessage("There are no available apartments", 'error')
        }
        else if(tower[i].type === "Apartment"){
            home = i;
            if(tower[i].residents.length === 4){
                displayMessage("Four residents per apartment", 'error');
                continue
            }
            else {
                newPerson = new Person(fname, lname, home, 2);
                let newHome =tower[home].residents;
                newHome.push(newPerson);
                // citizen.push(newPerson);
                // window.localStorage.setItem("Tenates", JSON.stringify(citizen));
                window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
                displayMessage(fname + ' ' + lname + ' added', 'success')
            }
            render();
            break
        }
    }
}

function getRandom(type) {
    if(type === "color"){
        let colors = ["#8B0000","#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#9E9E9E","#000000"];
        return colors[Math.floor(Math.random() * colors.length)]
    }
    else if (type === "first"){
        let first = ["John", "Steve", "Anthony"];
        return first[Math.floor(Math.random() * (first.length))];
    }
    else if (type === "last"){
        let last = ["Smith", "Hyde", "Stevens"];
        return last[Math.floor(Math.random() * last.length)];
    }
    else if (type === 'category'){
        let categories = ["Dealership", "Grocery Store", "Jewellery Store", "Flower Store", "Beauty Salon", "Butcher", "Toy Store", "Music", "Clothe Store","Book Store","Tech Store","Sports","E-Store","Dollar Store"];
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
                 <div class="storeBanner">
                    <span>${tower[i].name}</span>
                    <button onclick="toggleNav('${tower[i].id}SR')" class="info"><i class="fa fa-ellipsis-v-alt"></i></button>
                </div>
                <div class="storeItems">
                    <button onclick="toggleNav('${tower[i].id}C')">Citizens</button>
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
                 <div class="storeBanner">
                    <span>${tower[i].name}</span>
                    <button onclick="toggleNav('${tower[i].id}SR')" class="info"><i class="fa fa-ellipsis-v-alt"></i></button>
                </div>
                <div class="storeItems">
                     <button id="${tower[i].id}stock" disabled>Stocking...</button>
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
                <div class="storeBanner">
                    <span>${tower[i].name}</span>
                    <button onclick="toggleNav('${tower[i].id}SR')" class="info"><i class="fa fa-ellipsis-v-alt"></i></button>
                </div>
                <div class="storeItems">
                    <!--<div></div>-->
                    <button id="${tower[i].id}stock" onclick="stockRoom(event, ${i});">Stock floor: $${(multiplier(i) * 250)}</buttoon>
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

function toggleNav(item, type) {
    //if displayed hide
    if(document.getElementById(item).style.display === "flex"){
        document.getElementById(item).style.display = "none";
    }
    //If hidden display
    else{
        document.getElementById(item).style.display = "flex";
    }
    if(type === 'store'){
        document.getElementById('name').style.display = "inherit";
        document.getElementById('category').style.display = "inherit";
        document.getElementById('color').style.display = "inherit";
        document.getElementById('fName').style.display = "none";
        document.getElementById('lName').style.display = "none";
        document.getElementById('newStore').style.display = "inherit";
        document.getElementById('newApt').style.display = "none";
        document.getElementById('newPerson').style.display = "none";
    }
    else if(type === 'apartment'){
        document.getElementById('name').style.display = "inherit";
        document.getElementById('category').style.display = "none";
        document.getElementById('color').style.display = "inherit";
        document.getElementById('fName').style.display = "none";
        document.getElementById('lName').style.display = "none";
        document.getElementById('newStore').style.display = "none";
        document.getElementById('newApt').style.display = "inherit";
        document.getElementById('newPerson').style.display = "none";
    }
    else if(type === 'person'){
        document.getElementById('name').style.display = "none";
        document.getElementById('category').style.display = "none";
        document.getElementById('color').style.display = "none";
        document.getElementById('fName').style.display = "inherit";
        document.getElementById('lName').style.display = "inherit";
        document.getElementById('newStore').style.display = "none";
        document.getElementById('newApt').style.display = "none";
        document.getElementById('newPerson').style.display = "inherit";
    }

}

function stockRoom(e, i) {

    let supplyRoom = document.getElementById(tower[i].id + "stock");
    supplyRoom.disabled = true;
    e.stopImmediatePropagation();

    // console.log(supplyRoom.disabled);
    // console.log(supplyRoom.innerText);

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

    // console.log(tower[i]);
}

function wallet(amount) {
    //Creates a temp value for the money amount
    let newMoney = parseInt(money) + parseInt(amount);
    // console.log(money +"+"+ parseInt(amount) +"="+parseInt(newMoney));

    //Sees is you have enough money to purchase the item
    if(parseInt(newMoney) < 0){
        displayMessage("Not enough money", 'error');
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

function displayMessage(message, type) {
    //Displays the banner
    document.getElementById("message").style.display = "flex";
    //Displays the message in the banner
    document.getElementById("message").innerHTML = `<p>${message}</p>`;

    if(type === 'error'){
        document.getElementById("message").style.background = 'darkred'
    }
    else if(type === 'success'){
        document.getElementById("message").style.background = 'darkgreen'
    }
    else if(type==='dev'){
        document.getElementById("message").style.background = '#F4511E'
    }

    //Hides the banner after 3 seconds
    setTimeout(function(){
        document.getElementById("message").style.display = "none"
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
    displayMessage(tower[i].name + ' deleted', 'error');
    tower = tower.filter(item => item !== tower[i]);
    //Stores new name
    window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
    //Rebuilds the tower
    render()
    //Displays the cost of the next floor since the height has changed
    document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
}

function cheater() {
    cheat++;

    if(cheat === 5){
        console.log("DevOptions enabled");
        window.localStorage.setItem("DevOptions", 'enabled');
        document.getElementById('devOptions').style.display = 'flex';
        displayMessage("DevOps Enabled", 'dev');
        document.getElementById('tower').style.marginBottom = '50px';
        cheat = 0;
    }
}

function devOption() {
    let option = document.getElementById('devText').value;

    if(option === 'disable'){
        console.log("DevOptions disabled");
        window.localStorage.setItem("DevOptions", 'disabled');
        document.getElementById('devOptions').style.display = 'none';
        document.getElementById('tower').style.marginBottom = '0px';
        displayMessage('DevOptions Off', 'dev');

        //Turns off creative mode
        window.localStorage.setItem("CreativeMode", 'disabled');
        let e =document.getElementsByClassName('nav')[0];
        e.style.backgroundColor ='#607D8B';
    }
    else if(option === 'millionaire'){
        displayMessage('Millionaire Enabled', 'dev');
        wallet(1000000)
    }
    else if(option === 'broke'){
        displayMessage('Broke Enabled', 'dev');
        wallet(-money)
    }
    //money-amount
    else if(option.startsWith('money')){
        displayMessage('Added money', 'dev');
        let optionArray = option.split("-");
        // console.log(optionArray);
        if(optionArray.length===2){
            wallet(optionArray[1])
        }
    }
    else if(option === 'creative-on'){
        displayMessage('Creative Mode On', 'dev');
        window.localStorage.setItem("CreativeMode", 'enabled');
        let e =document.getElementsByClassName('nav')[0];
        e.style.backgroundColor ='#F4511E';
    }
    else if(option === 'creative-off'){
        displayMessage('Creative Mode Off', 'dev');
        window.localStorage.setItem("CreativeMode", 'disabled');
        let e =document.getElementsByClassName('nav')[0];
        e.style.backgroundColor ='#607D8B';
    }
    //customFloor.name.category.color
    else if(option.startsWith('customFloor')){
        let contentArray=option.split(".");
        // console.log(contentArray);
        if(contentArray.length === 4){
            let newFloor = new Store(contentArray[1], contentArray[2], [contentArray[3]], 1 + (parseInt(tower.length)/10 ));
            // console.log(newFloor);
            tower.push(newFloor);
            // console.log(tower);
            window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
            displayFloor(tower.length - 1);
            //Displays the cost of the next floor
            document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
            displayMessage(contentArray[1] + ' added', 'success');
        }
    }
    else if(option === 'tesla'){
        let newFloor = new Store('Tesla', "Car Company", ["#cc0000"], 1 + (parseInt(tower.length)/10 ));
        // console.log(newFloor);
        tower.push(newFloor);
        // console.log(tower);
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        displayFloor(tower.length - 1);
        //Displays the cost of the next floor
        document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
    }
    else if(option === 'elon'){
        for(let i = 0; i <= tower.length; i++) {
            if(i === tower.length){
                displayMessage("There are no available apartments", 'error')
            }
            else if(tower[i].type === "Apartment"){
                let home = i;
                if(tower[i].residents.length === 4){
                    displayMessage("Four residents per apartment", 'error')
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
        let newFloor = new Store('Panthers', "Sports Team", ["linear-gradient(135deg, rgba(0,133,202,1) 0%, rgba(165,172,175,1) 100%)"], 1 + (parseInt(tower.length)/10 ));
        // console.log(newFloor);
        tower.push(newFloor);
        // console.log(tower);
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        displayFloor(tower.length - 1);
        //Displays the cost of the next floor
        document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
    }
    else if(option === 'xbox'){
        let newFloor = new Store('Xbox', "Game Store", ["linear-gradient(45deg, rgba(82,176,67,1) 0%, rgba(0,0,0,1) 100%)"], 1 + (parseInt(tower.length)/10 ));
        // console.log(newFloor);
        tower.push(newFloor);
        // console.log(tower);
        window.localStorage.setItem("TowerFloors", JSON.stringify(tower));
        displayFloor(tower.length - 1);
        //Displays the cost of the next floor
        document.getElementById("nextTower").innerHTML = "Next floor costs: $" + ( (tower.length + (tower.length/10)) * 1000);
    }
}