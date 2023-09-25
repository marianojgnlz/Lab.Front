const Events = {
  CREATE_FILE: "create-file",
  SEND_MESSAGE: "send-message",
  GET_FILES: "get-files",
  GET_USERS: "get-users",
  GET_FILE: "get-file",
  UPDATE_FILE: "update-file",
  HANDLE_MESSAGE: "handle-message"
};

const uri = "lab-recursos-74fb64985ebf.herokuapp.com";
const myUsername = prompt("Hola, Ingresa tu nombre") || "Anonymous";
const myGroup = prompt("Ingresa tu numero de grupo") || "0";
const socket = new WebSocket(
  `wss://${uri}?username=${myUsername}&group=${myGroup}`,
);

socket.onmessage = (m) => {
  const data = JSON.parse(m.data);
  switch (data.event) {
    case Events.SEND_MESSAGE:
      console.log("OLaaaa, mensaje guardado");
      break;
    case Events.GET_FILES:
      {
        clearFileList();
        handleGetFiles(data.files);
      }
      break;
    case Events.GET_USERS:
      {
        clearUserList();
        handleGetUsers(data.users);
      }
      break;
    case Events.GET_FILE:
      {
        handleGetFile(data);
      }
      break;
    case Events.UPDATE_FILE:
      {
        handleUpdatedFile(data);
      }
      break;
    case Events.HANDLE_MESSAGE:
      {
        handleUpdatedFile(data);
      }
      break;
  }
};

const handleConnected = () => {
  socket.send(
    JSON.stringify({
      event: Events.HANDLE_MESSAGE,
      message: {
        event: Events.GET_FILES
      }
    }),
  );

  const $datos = document.querySelector("#datos");

  $datos.addEventListener("keydown", (e) => {
    var keyValue = e.key;
    var charCode = e.keyCode;

    if (
      (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) ||
      charCode == 32
    ) {
      socket.send(
        JSON.stringify({
          event: Events.HANDLE_MESSAGE,
          message: {
            event: Events.UPDATE_FILE,
            keyPressed: keyValue,
            group: $datos.getAttribute("group-number")
          },
        }),
      );
    }
  }, false);
};

const handleGetFiles = (files) => {
  const $filesList = document.querySelector("#filesList");
  files.forEach((file) => {
    const $newAnchor = document.createElement("a");
    const $newElement = document.createElement("li");
    $newAnchor.setAttribute("href", "javascript:void(0);");
    $newAnchor.innerHTML = file;
    $newElement.setAttribute("class","archivoLista")
    $newAnchor.addEventListener("click", handleFileClick);

    $newElement.append($newAnchor);
    $filesList.append($newElement);
  });
};

const handleGetFile = (data) => {
  const $fileName = document.querySelector("#fileName");
  const $content = document.querySelector("#content");
  $content.innerHTML = data.file;
  $fileName.value = data.fileName;
};

const  handleUpdatedFile = (data) => {
  console.log(data.file)
  const $datos = document.querySelector("#datos");
  $datos.value = data.file;
};

const handleFileClick = (e) => {
  const $datos = document.querySelector("#datos");
  $datos.setAttribute("group-number", myGroup);
  socket.send(
    JSON.stringify({
      event: Events.HANDLE_MESSAGE,
      message: {
        event: Events.GET_FILE,
        fileName: e.target.innerText,
        username: myUsername
      },
    }),
  );
};

const handleGetUsers = (users) => {
  const $usersList = document.querySelector("#usersList");
  users.forEach((user) => {
    const $newElement = document.createElement("li");
    const $newElement1 = document.createElement("span");
    $newElement1.innerHTML = user;
    $newElement.setAttribute("class","listas");
    $newElement.append($newElement1);
    $usersList.append($newElement);
  });
};

const clearFileList = () => {
  const $filesList = document.querySelector("#filesList");
  $filesList.innerHTML = "";
};

const clearUserList = () => {
  const $usersList = document.querySelector("#usersList");
  $usersList.innerHTML = "";
};

const SendText = () => {
  const $textArea = document.querySelector("#content");
  const $inputFileName = document.querySelector("#fileName");

  socket.send(
    JSON.stringify({
      event: Events.HANDLE_MESSAGE,
      message: {
        event: Events.CREATE_FILE,
        username: myUsername,
        message: $textArea.value,
        fileName: $inputFileName.value,
      },
    }),
  );

  clearFileList();

  socket.send(
    JSON.stringify({
      event: Events.HANDLE_MESSAGE,
      message: {
        event: Events.GET_FILE,
      },
    }),
  );

  const $form = document.querySelector("#form");

  $form.reset();
};

const createFile = () => {
  var id = "id" + Math.random().toString(16).slice(2);
  console.log(id);

  const $inputGroup = document.querySelector("#group");

  socket.send(
    JSON.stringify({
      event: Events.HANDLE_MESSAGE,
      message: {
        event: Events.CREATE_FILE,
        fileName: id,
        group: $inputGroup.value == "" ? 0 : $inputGroup.value,
      },
    }),
  );
};

socket.onopen = () => handleConnected();
