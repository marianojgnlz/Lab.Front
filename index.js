const Events = {
    CREATE_FILE: "create-file",
    SEND_MESSAGE: "send-message",
    GET_FILES: "get-files",
    GET_USERS: "get-users",
    GET_FILE: "get-file"
}

const uri = "localhost:1000";
const myUsername = prompt("Please enter your name") || "Anonymous";
const socket = new WebSocket(
    `ws://${uri}?username=${myUsername}`
);


socket.onmessage = (m) => {
    const data = JSON.parse(m.data);
    switch (data.event) {
        case Events.SEND_MESSAGE:
            console.log("OLaaaa, mensaje guardado")
            break;
        case Events.GET_FILES: {
            clearFileList();
            handleGetFiles(data.files);
        }
            break;
        case Events.GET_USERS: {
            clearUserList();
            handleGetUsers(data.users);
        }
            break;
        case Events.GET_FILE: {
            handleGetFile(data);
        }
            break;
    }
};

const handleConnected = () =>
    socket.send(
        JSON.stringify({
            event: Events.GET_FILES
        })
    );

const handleGetFiles = (files) => {
    const $filesList = document.querySelector("#filesList");
    files.forEach(file => {
        const $newAnchor = document.createElement("a");
        const $newElement = document.createElement("li");
        $newAnchor.setAttribute("href", "javascript:void(0);");
        $newAnchor.innerHTML = file;

        $newAnchor.addEventListener("click", handleFileClick);

        $newElement.append($newAnchor);
        $filesList.append($newElement);
    });
}

const handleGetFile = (data) => {
    const $fileName = document.querySelector("#fileName");
    const $content = document.querySelector("#content");
    $content.innerHTML = data.file;
    $fileName.value = data.fileName;
}

const handleFileClick = e => {
    console.log(e.target.innerText);

    socket.send(
        JSON.stringify({
            event: Events.GET_FILE,
            fileName: e.target.innerText,
            username: myUsername
        })
    );
}

const handleGetUsers = (users) => {
    const $usersList = document.querySelector("#usersList");
    users.forEach(user => {
        const $newElement = document.createElement("li");
        $newElement.innerHTML = user;
        $usersList.append($newElement);
    });
}

const clearFileList = () => {
    const $filesList = document.querySelector("#filesList");
    $filesList.innerHTML = '';
}

const clearUserList = () => {
    const $usersList = document.querySelector("#usersList");
    $usersList.innerHTML = '';
}

const SendText = () => {
    const $textArea = document.querySelector("#content");
    const $inputFileName = document.querySelector("#fileName");

    socket.send(
        JSON.stringify({
            event: Events.CREATE_FILE,
            username: myUsername,
            message: $textArea.value,
            fileName: $inputFileName.value
        })
    );

    clearFileList();

    socket.send(
        JSON.stringify({
            event: Events.GET_FILES
        })
    );

    const $form = document.querySelector("#form");

    $form.reset();
}

socket.onopen = () => handleConnected();
