import * as db from './firebase.js';
import * as button from './button.js';

let uid = null;
let memeList = [];
let tableView = localStorage['tableView'] ? parseInt(localStorage['tableView']) : 1;

async function main() {
    // Confirm login information
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            uid = user.uid; 
            db.app_main.retriveData(uid);
        } 
        else window.location.href = 'index.html';
    });

    let loading = document.createElement('img');
    loading.id = 'loading';
    loading.src = './img/loading.svg';
    document.body.appendChild(loading);

    //memeList = db.getAllMemes(uid);
    let cnt = 0;
    while(memeList.length == 0) {
        cnt++;
        if(cnt == 25) {
            let warning = document.createElement('p');
            warning.id = 'warning';
            warning.innerHTML = 'Go make a new meme so that the cute cat can have a rest!';
            document.body.appendChild(warning);
        }
        memeList = db.item;
        await sleep(200);
    }

    memeList.sort(sortByProp('-date'));
    document.body.removeChild(loading);
    checkView();
   


    document.querySelector('#toggleView').addEventListener('click', handleToggleView);
    document.querySelector('#logOutButton').addEventListener('click', () => {
        firebase.auth().signOut();
        button.generateGoToURLHandler('./login.html');
    });
    document.querySelector('#newMemeButton').addEventListener('click', button.generateGoToURLHandler('./index.html'));
    document.querySelector('#changePasswordButton').addEventListener('click', button.generateGoToURLHandler('./changepw.html'));
}




window.addEventListener('load', main);




function renderList(type) {
    memeList.forEach(memeInfo => {
        let panel = document.createElement('div');
        panel.className = `${type}Panel panel`;

        let meme = new Image();
        meme.setAttribute('class', 'meme');
        meme.addEventListener('load', ()=>{
            panel.appendChild(meme);
            let info = document.createElement('div');
            info.setAttribute('class', 'info');

            let title = document.createElement('p');
            title.setAttribute('class', 'title');
            title.innerHTML = `${memeInfo.title} [Last Edited @ ${memeInfo.date.toDateString()}]`;
            info.appendChild(title);

            let buttons = document.createElement('div');
            buttons.setAttribute('class', 'listButtons');



            let trashButton = button.createButton('trash');
            trashButton.addEventListener('click', ()=>{
                let c = confirm('Be careful! You will lose this fantastic meme forever if you choose OK');
                if(c) {
                    button.startLoading();
                    db.app_main.deleteMeme(uid, memeInfo.key, ()=>{
                        window.location.href = window.location.href;
                    });
                }
            });
            buttons.appendChild(trashButton);


            if(memeInfo.editable) {
                let editButton = button.createButton('edit');
                editButton.addEventListener('click', ()=>{
                    localStorage.setItem('editting', 1);
                    localStorage.setItem('info', JSON.stringify(memeInfo));
                    window.location.href = './index.html';
                });
                buttons.appendChild(editButton);
            }


            buttons.appendChild(button.createButton('share'));

            let downloadButton = button.createButton('download');
            downloadButton.addEventListener('click', button.generateDownloadHandler(memeInfo.rendered, memeInfo.title));
            buttons.appendChild(downloadButton);
            info.appendChild(buttons);
            panel.appendChild(info);
            document.querySelector('main').appendChild(panel);
        });
        meme.src = memeInfo.rendered;
    });
}

/*
function renderTable() {
    renderList();
    let panels = document.querySelectorAll('.listPanel');
    panels.forEach(panel => {
        console.log('Changing...');
        panel.className = 'tablePanel panel';
    });
}
*/



function checkView() {
    let b = document.querySelector('#toggleView');
    tableView =  (localStorage.tableView) ? parseInt(localStorage.tableView) : 1;
    if(tableView) {
        b.innerHTML = 'List';
        removePanels();
        renderList('table');
    }
    else {
        b.innerHTML = 'Table';
        removePanels();
        renderList('list');
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}