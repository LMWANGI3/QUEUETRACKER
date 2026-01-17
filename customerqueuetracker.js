let queue = [];    //this creates an empty array where all customers will be stored.
let queueNumber = 1;   //this helps in generatng ticket numbers.
let currentStatus = 'waiting';  //this controls the customers to be displayed according to the active button status.

const statusButtons = document.getElementById('button-status');
const customerNameInput = document.getElementById('customerName');
const customerContactInput = document.getElementById('customerContact');
const groupSizeInput = document.getElementById('groupSize');
const customerFormInput = document.getElementById('customerForm');
const customerDetailsForm = document.getElementById('customer-details-form');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const closeBtn = document.querySelector('.close-btn');
const customerList = document.getElementById('customerList');
const cancelBtn = document.querySelector('.cancelBtn');
const serveBtn = document.querySelector('.serveBtn');

  addCustomerBtn.addEventListener('click', ()=>{
    customerDetailsForm.classList.remove('hidden');
   });
   closeBtn.addEventListener('click',()=>{
    customerForm.reset();
    customerDetailsForm.classList.add('hidden');
   });
   cancelBtn.addEventListener('click',()=>{
    customerForm.reset();
    customerDetailsForm.classList.add('hidden');
   });

customerForm.addEventListener('submit',function(e){
      e.preventDefault();
    const customer = {  //creates the customer object
        ticket : 'Q' + String(queueNumber).padStart(3, '0'),
        name: customerNameInput.value.trim(),
        contact: customerContactInput.value.trim(),
        groupSize: groupSizeInput.value,
        status: 'waiting',
        addedAt: Date.now(),
        servedAt: null,
        completedAt: null,
    };
    queue.push(customer);   //adds the customer into the array
    queueNumber ++;    //ensures the next customer gets a new ticket number;prevents customers from all being Q001

    saveData();
    showCustomerList();
    updateStatus();
    customerForm.reset();  //clears the form entry and prepares for the next customer entry

  customerDetailsForm.classList.add('hidden'); //closes the add customer form pop up
});

function showCustomerList(){
    const customerList = document.getElementById('customerList');   //this gets the container from html where the list will be dsplayed
    customerList.innerHTML = '';         //this clears the list to prevent duplicting

    const displayedCustomers = queue.filter(customer =>   //this filters customer based on their current status
                customer.status === currentStatus);
   if(displayedCustomers.length === 0 ){
        let message = '';    //this displays the message if no user found on the selected button status
        if(currentStatus === 'waiting'){
            message = 'No customers waiting. Add a customer to get started.';
        }else if(currentStatus=== 'inService'){
            message = 'No customers currently being served.';
        }else if(currentStatus === 'completed'){
            message = 'No completed customers yet.';
        }else{
            message = 'No customers found.'
        }
     customerList.innerHTML = `<p class = "blank-text">${message}</p>`;
     return;
   }

        displayedCustomers.forEach(customer =>{  //this loops through each customer
        const customerCard = document.createElement('div');   //this creates a card for each customer we need to display
        customerCard.classList.add('customer-card');   //this helps in css styling

        //this fills content on the created card
        customerCard.innerHTML = `  
        <div class="ticket-circle">${customer.ticket}</div>
        <div class="customer-info">
        <h3 class ="customer-name">${customer.name}</h3>
        <div class="customer-meta">
        <span class="contact"><img src="/IMAGES/callicon.png" alt="Contact" class="contact-img">${customer.contact}</span>
        <span class="group"><img src="/IMAGES/group2icon.png" alt="Group" class="group-img"> ${customer.groupSize}person(s)</span>
        </div>

        <div class="customer-status-time">
        <button class="status-btn ${customer.status.toLowerCase().replace(/\s/g,'-')}">${customer.status}</button>
        <span class="time">${getTimeText(customer)}</span>
        </div>
        ${customer.servedAt?
            `<p><strong>Served:</strong>${new Date(customer.servedAt).toLocaleTimeString()}</p>`:''}
        ${customer.completedAt?
            `<p><strong>Completed:</strong>${new Date(customer.completedAt).toLocaleTimeString()}</p>`:''}
        </div>
         <div class="card-buttons">
         ${customer.status === 'waiting'?
        `<button class="serve-btn" data-ticket="${customer.ticket}">Serve Now</button>`:''}
        ${customer.status === 'waiting'?
        `<button class="cancel-btn" data-ticket="${customer.ticket}">X</button>`:''}
        ${customer.status === 'inService'?
        `<button class="complete-btn" data-ticket="${customer.ticket}" >Complete</button>`:''}
        ${customer.status === 'inService'?
        `<button class="cancel-btn" data-ticket="${customer.ticket}">X</button>`:''}
        ${customer.status === 'completed'?
        `<button class="remove-btn"data-ticket="${customer.ticket}">Remove</button>`:''}
        </div>
        `;
     customerList.appendChild(customerCard)  //this puts the customer card on the screen
    });
    }
function getTimeText(customer){     //this function shows the time message ie when customer was added, served and completed
    if(customer.status === 'waiting'){
        return `added at ${new Date(customer.addedAt).toLocaleTimeString()}`;
    }
if(customer.status === 'In Service'){
        return `serving since ${new Date(customer.addedAt).toLocaleTimeString()}`;
    }
if(customer.status === 'completed'){

        return `completed at  ${new Date(customer.addedAt).toLocaleTimeString()}`;

    }
return '';
}
function serveCustomer(ticket){  //this function changes the selected customer in the queue from waiting to in service and record the time they were served
    const customer = queue.find(customer =>
        customer.ticket === ticket);  //searches through the queue and return the customer that matches the selected ticket
        if(!customer || customer.status !== 'waiting')  
            return;   //if no customer that matches the ticket number it stops
        customer.status = 'inService';  //this moves the customer from waiting to being served
        customer.servedAt = Date.now();  ////this stores the exact time customer started being served.

            saveData();
            showCustomerList();
            updateStatus();
            setStatusActive('inService');    
    }

 

function cancelCustomer(ticket){   //this function removes the customer from the queue completely
    queue = queue.filter(customer =>
        customer.ticket !== ticket);  //this goes through the queue and only keeps the customers that does match the selected ticket
        saveData();
        updateStatus();
        showCustomerList();
}

function completedCustomer(ticket){    //this function receives which customer to complete
    const customer = queue.find(customer =>
        customer.ticket === ticket);  //this searches through the customers array and returns the ticket that matches the ticket selected.
    if(!customer){
        return;
    }
        customer.status = 'completed'; //moves the customer from waiting to completed
        customer.completedAt = new Date();  //this records completion timestamp

        saveData();
        updateStatus();
        showCustomerList();
        setStatusActive('completed');
}

function removeCustomer(ticket){   //this function permanently deletes the customer from the queue
       queue = queue.filter(customer =>
        customer.ticket !== ticket);  //this keeps all customers except the one clicked
        saveData();
        updateStatus();
        showCustomerList();
}

function setStatusActive(status){   //this displays the current active status button
    currentStatus = status; //shows which tab is active
    const buttons = document.querySelectorAll('.button-status'); //this gets all buttons ie waiting, in service and completed
    buttons.forEach(button =>{
        if(button.dataset.status === status){  //this check the button data-status
            button.classList.add('active');   //this highlights the selected button
        } else {
            button.classList.remove('active');  //this removes highlight from other buttons
        }
    });
    showCustomerList();
}

function updateStatus(){ //this filters the customers according to their status
    const waitingCustomers = queue.filter(customer =>
        customer.status === 'waiting');
    const inServiceCustomers = queue.filter(customer =>
        customer.status === 'inService');
    const completedCustomers = queue.filter(customer =>
        customer.status === 'completed');

//this gets their counts
const waitingCount = waitingCustomers.length;
const inServiceCount = inServiceCustomers.length;
const completedCount = completedCustomers.length;

//this updates the DOM both for the cards and buttons
document.getElementById('waitingBtnCount').textContent = waitingCount;
document.getElementById('inServiceBtnCount').textContent = inServiceCount;
document.getElementById('completedBtnCount').textContent = completedCount;
document.getElementById('waitingCount').textContent = waitingCount;
document.getElementById('inServiceCount').textContent = inServiceCount;
document.getElementById('completedCount').textContent = completedCount;

//this gets the total wait time for all customers based on the time they were added and served
    let totalWaitTime = 0;
    completedCustomers.forEach(customer =>{
    if(customer.servedAt && customer.addedAt){
            totalWaitTime += customer.servedAt - customer.addedAt ;
        }
    });

    //this calculated the total average time for each customer
    let avgDisplay = '0m 00s';
    if(completedCount > 0){
    const avgMs = totalWaitTime/completedCount;
    const totalSeconds = Math.floor(avgMs/1000);
    const minutes = Math.floor(totalSeconds/60);
    const seconds = totalSeconds%60;
    avgDisplay = `${minutes}m ${seconds.toString().padStart(2,'0')}s`;
    }
   document.getElementById('averageWaitTime').textContent = avgDisplay;
}

document.addEventListener('click', function(e){   //this runs whenever there's a click on the page.
    if(e.target.classList.contains('button-status')){    //checks if the click is on one of the button status
      const status = e.target.dataset.status;      //gets the value of the data status attribute of the clicked button
      currentStatus = status;   //this updates the currently selected status to the one the user just clicked
      setStatusActive(status);  //this highlights the clicked button
      showCustomerList();//shows the customers with the current status
      return; 
    }
    if(e.target.classList.contains('remove-btn')){  //this function checks if the clicked element is remove button
    const ticket = e.target.dataset.ticket;
    removeCustomer(ticket); //removes that specific customer
    return;
   }
    if(e.target.classList.contains('serve-btn')){   //this function check if the clicked element is serve now button
    const ticket = e.target.dataset.ticket;  //uses the closest customer card to find which customer the card belong to then gets its ticket.
    serveCustomer(ticket); //transfers the particular customer for that ticket number to inservice
    return;  
   }
   if(e.target.classList.contains('cancel-btn')){   //this function checks if the clicked element is cancel button
    const ticket = e.target.dataset.ticket;    
    cancelCustomer(ticket);  //removes that specific customer for that particular ticket number.
    return;  
   }
   if(e.target.classList.contains('complete-btn')){  //this function checks if the clicked element is complete button.
    const ticket = e.target.dataset.ticket; //uses the closest customer card for find which customer the card belong to then gets its ticket
    completedCustomer(ticket); //this marks the customer completed
    return; 
   }
});

function saveData(){     // this keeps data even when the page is refreshed
    localStorage.setItem('queue',    //keeps tmy data with the label name queue
        JSON.stringify(queue));    //this converts my data into a string since local storage only stores strings and yet my data is an array of customer objects
}

function loadData(){
    const savedQueue = localStorage.getItem('queue'); //this loads data saved earlier
    if(savedQueue){    //checks if we have any stored data
        queue = JSON.parse(savedQueue); // converts the data stored in string form back to array of customer object
    }
}
loadData();
showCustomerList();
updateStatus();