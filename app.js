let myLinks = []
const inputField = document.querySelector("#input-el")
const saveButton = document.querySelector("#save-btn")
const tabButton = document.querySelector("#tab-btn")
const deleteButton = document.querySelector("#delete-btn")
const ulEl = document.querySelector("#ul-el")
const deleteItemBtn = document.querySelector("#delete-item-btn")
const changeThemeBtn = document.querySelector("#theme-toggle-btn")
const closeAlertBtn = document.querySelector("#close-alert-btn")
const alertEl = document.querySelector("#alert-el")
const alertDialog = document.querySelector("#alert-dialog")
const preferedTheme = localStorage.getItem("preferedTheme")
const localStorageLinks = JSON.parse(localStorage.getItem("myLinks"))
const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const root = document.documentElement

if (preferedTheme) {
    root.className = preferedTheme
}

function changeTheme() {
    const newTheme = root.className === 'dark' ? 'light' : 'dark'
    root.className = newTheme
    localStorage.setItem("preferedTheme", newTheme)
}

if (localStorageLinks) {
    myLinks = localStorageLinks
    render(myLinks)
}

function render(links) {
    let listItems = ""
    for (i = 0; i < links.length; i++) {
        listItems += `<li><a href="${links[i]}" target="_blank">${links[i]}</a><div id="delete-item-btn"><img src="images/trash.png" alt="trash"/></div></li>`
    }
    ulEl.innerHTML = listItems
}

function saveInput() {
    if (inputField.value) {
        if(urlPattern.test(inputField.value)){
            myLinks.push(inputField.value);
            inputField.value = "";
            localStorage.setItem("myLinks", JSON.stringify(myLinks));
            render(myLinks);
        }else{
            showAlert()
        }
    }
}

function showAlert(){
    alertEl.style.display = "flex"
    alertDialog.textContent = "Please enter a valid URL"
}

inputField.addEventListener("keydown", function(e) {
    if (e.code === "Enter")  {
        saveInput();
    }
});

saveButton.addEventListener("click", function(){
    saveInput()
})

tabButton.addEventListener("click", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLinks.push(tabs[0].url)
        localStorage.setItem("myLinks", JSON.stringify(myLinks))
        render(myLinks)
    })
})

deleteButton.addEventListener("dblclick", function(){
    localStorage.clear()
    myLinks = []
    render(myLinks)
})

ulEl.addEventListener("click", function(event){
    if (event.target.matches("img")) {
        let linkValue = event.target.parentNode.parentNode.firstChild.textContent
        let index = myLinks.indexOf(linkValue);
        if (index > -1) {
            myLinks.splice(index, 1);
        }
        localStorage.setItem("myLinks", JSON.stringify(myLinks))
        render(myLinks)
    }
});

changeThemeBtn.addEventListener("click", function(){
    changeTheme()
})

closeAlertBtn.addEventListener("click", function(){
    alertEl.style.display = "none";
});