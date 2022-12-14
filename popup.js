const shoutSelector = '.__shout__';

let usernameBlackList = [];

function renderUsername(username) {
    let rowHtmlContent = `<tr><td class="align-middle">` + username + `</td><td><button type="button" class="btn btn-sm btn-outline-danger float-end btn-eliminar-usuario"><i class="bi bi-x-octagon"></i></button></td></tr>`;
    let tableRef = document.querySelector('#table-user-blacklist tbody');
    let newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = rowHtmlContent;
};

function onClickEliminarUsuario() {
    let tr = this.parentNode.parentNode;
    let username = tr.firstChild.innerHTML;
    
    chrome.storage.sync.get("blacklist", function(result) {
        let blacklist_ = result.blacklist;
        const index = blacklist_.indexOf(username);
        if (index > -1) {
            blacklist_.splice(index, 1);
        }
        chrome.storage.sync.set({blacklist: blacklist_}, function() {
            tr.parentNode.removeChild(tr);
            usernameBlackList = blacklist_;
        })
    });
};

chrome.storage.sync.get({blacklist: []}, function(result) {
    usernameBlackList = result.blacklist;

    usernameBlackList.forEach(username => {
        renderUsername(username);
    });

    document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
        btn.onclick = onClickEliminarUsuario;
    });
});


let username = document.querySelector('#username');
let btnAgregarUsuario = document.querySelector("#btn-agregar-usuario");

btnAgregarUsuario.onclick = function() {
    chrome.storage.sync.get({blacklist: []}, function(result) {
        let blacklist_ = result.blacklist;
        blacklist_.push(username.value);
        chrome.storage.sync.set({blacklist: blacklist_}, function() {
            console.log("username blocked!");
        })
    });
};

window.onscroll = function() {
    document.querySelectorAll(shoutSelector).forEach((shout) => { 
        let userDiv = shout.querySelector('.color_username'); 
        
        if (userDiv && usernameBlackList.includes(userDiv.textContent)) { 
            shout.remove(); 
        }
    }); 
};

