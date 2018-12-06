import * as db from './firebase.js';

let uid = null;
let memeList = [];
let tableView = localStorage['tableView'] ? parseInt(localStorage['tableView']) : 1;

function main() {
    // Confirm login information
    firebase.auth().onAuthStateChanged(user => {
        if(user) uid = user;
        else window.location.href = 'index.html';
    });

    memeList = db.getAllMemes(uid);
    memeList.sort(sortByProp('date'));

    checkView();

    document.querySelector('#toggleView').addEventListener('click', handleToggleView);
}

window.addEventListener('load', main);

function renderList() {
    renderTmp('#listTmp');
}

function renderTable() {
    renderTmp('#tableTmp');
}

function checkView() {
    let b = document.querySelector('#toggleView');
    if(tableView) {
        b.innerHTML = 'List';
        removePanels();
        renderTable();
    }
    else {
        b.innerHTML = 'Table';
        removePanels();
        renderList();
    }
}

function removePanels() {
    let m = document.querySelector('main');
    let ps = m.querySelectorAll('.panel');
    ps.forEach(e => {
        m.removeChild(e);
    });
}

function renderTmp(tmp) {
    memeList.forEach(memeInfo => {
        let panel = document.querySelector(tmp).content.querySelector('div').cloneNode(true);

        let meme = panel.querySelector('.meme');
        meme.src = memeInfo.url;
        panel.style.visibility = 'hidden';
        meme.addEventListener('load', ()=>{
            panel.style.visibility = 'visible';
        });
        document.querySelector('main').appendChild(panel);
    });
}


function handleToggleView() {
    tableView = tableView ? 0:1;
    localStorage.setItem('tableView', tableView);
    checkView();
}


function sortByProp(property) {
    var sortOrder = 1;
    if(property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}