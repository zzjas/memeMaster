import * as db from './firebase.js';
import * as button from './button.js';

let uid = null;
let memeList = [];
let tableView = localStorage['tableView'] ? parseInt(localStorage['tableView']) : 1;

function main() {
    // Confirm login information
    firebase.auth().onAuthStateChanged(user => {
        if(user) uid = user;
        else window.location.href = 'index.html';
    });

    //memeList = db.getAllMemes(uid);
    memeList = db.app_main.item;
    memeList.sort(sortByProp('date'));

    checkView();

    document.querySelector('#toggleView').addEventListener('click', handleToggleView);
}




window.addEventListener('load', main);




function renderList() {
    memeList.forEach(memeInfo => {
        let panel = document.createElement('div');
        panel.setAttribute('class', 'listPanel panel');

        let meme = new Image();
        meme.setAttribute('class', 'meme');
        meme.addEventListener('load', ()=>{
            panel.appendChild(meme);
            let right = document.createElement('div');
            right.setAttribute('class', 'right');

            let title = document.createElement('p');
            title.setAttribute('class', 'title');
            title.innerHTML = 'Title Here';
            right.appendChild(title);

            let bs = document.createElement('div');
            bs.setAttribute('class', 'listButtons');
            bs.appendChild(button.createButton('trash'));
            bs.appendChild(button.createButton('edit'));
            bs.appendChild(button.createButton('share'));

            let dB = button.createButton('download');
            dB.addEventListener('click', button.generateDownloadHandler(memeInfo.url));
            bs.appendChild(dB);
            right.appendChild(bs);
            panel.appendChild(right);
            document.querySelector('main').appendChild(panel);
        });
        meme.src = memeInfo.url;
    });
}

function renderTable() {
    memeList.forEach(memeInfo => {
        let panel = document.createElement('div');
        panel.setAttribute('class', 'tablePanel panel');

        let meme = new Image();
        meme.setAttribute('class', 'meme');
        meme.addEventListener('load', ()=>{
            panel.appendChild(meme);
            panel.appendChild(button.createButton('trash'));
            panel.appendChild(button.createButton('edit'));
            panel.appendChild(button.createButton('share'));

            let dB = button.createButton('download');
            dB.addEventListener('click', button.generateDownloadHandler(memeInfo.url));
            panel.appendChild(dB);

            document.querySelector('main').appendChild(panel);
        });
        meme.src = memeInfo.url;
    });
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
    m.innerHTML = '';
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