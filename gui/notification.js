function ShowNotification(msg = 'Please type atleast one keyword', type = 'error') {
    document.getElementById('notification-container').innerHTML =
        `<div class="notification ${type}">
            <div class="content">
                <span class="message">${msg}</span>
                <i class="fa fa-times" aria-hidden="true" onclick="CloseNotification()"></i>
            </div>
            <div class="progress"></div>
        </div>`;
    setTimeout(() => {
        CloseNotification();
    }, 3000);
}

function CloseNotification() {
    document.getElementById('notification-container').innerHTML = "";
}