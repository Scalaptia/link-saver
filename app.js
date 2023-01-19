let myLinks = []
const inputField = document.querySelector("#input-el")
const saveButton = document.querySelector("#save-btn")
const tabButton = document.querySelector("#tab-btn")
const deleteButton = document.querySelector("#delete-btn")
const ulEl = document.querySelector("#ul-el")
const deleteItemBtn = document.querySelector("#delete-item-btn")
const changeThemeBtn = document.querySelector("#theme-toggle-btn")
const localStorageLinks = JSON.parse(localStorage.getItem("myLinks"))

function changeTheme() {
    const root = document.documentElement;
    const newTheme = root.className === 'dark' ? 'light' : 'dark';
    root.className = newTheme;
}

if (localStorageLinks) {
    myLinks = localStorageLinks
    render(myLinks)
}

function render(links) {
    let listItems = ""
    for (i = 0; i < links.length; i++) {
        listItems += `<li><a href="${links[i]}" target="_blank">${links[i]}</a><div id="delete-item-btn"><img src="images/trash.png" /></div></li>`
    }
    ulEl.innerHTML = listItems
}

function saveInput() {
    if (inputField.value) {
        myLinks.push(inputField.value)
        inputField.value = ""
        localStorage.setItem("myLinks", JSON.stringify(myLinks))
        render(myLinks)
    }
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
