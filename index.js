const Events = {
  CREATE_FILE: "create-file",
  SEND_MESSAGE: "send-message",
  GET_FILES: "get-files",
  GET_USERS: "get-users",
  GET_FILE: "get-file",
  UPDATE_FILE: "update-file",
  HANDLE_MESSAGE: "handle-message",
  SET_FILE: "set-file"
};

//const uri = "lab-recursos-74fb64985ebf.herokuapp.com";
const uri = "192.168.1.191:3030"
const myUsername = prompt("Hola, Ingresa tu nombre") || "Anonymous";
const socket = new WebSocket(
  `ws://${uri}?username=${myUsername}`,
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
            fileClicked: $datos.getAttribute("file-clicked")
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
    const $backupButton = document.createElement("button");
    const $deleteButton = document.createElement("button");
    const $div = document.createElement("div");
    const $div1 = document.createElement("div1");
    
    $backupButton.setAttribute("id","backupButton");
    $deleteButton.setAttribute("id","deleteButton");
    $backupButton.setAttribute("class","cloudB");
    $deleteButton.setAttribute("class","cloudD");
    
    $backupButton.innerHTML ='<svg width="50" height="30" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24.0195 8.27781C23.3662 4.84748 21.6242 2.54548 19.4067 1.25599C17.1339 -0.0657055 14.4023 -0.300225 11.9192 0.3461C9.43615 0.992414 7.1698 2.52785 5.83901 4.78776C4.57076 6.94148 4.17462 9.71549 5.20076 12.9246C-1.88926 13.8694 -1.73009 24.339 5.67826 24.8562C5.6882 24.8569 5.69816 24.8573 5.70812 24.8573H22.387C24.5219 24.8725 26.5793 24.0902 28.1479 22.6644C33.2966 18.2114 30.6619 9.37355 24.0195 8.27781ZM6.09124 12.887C5.03962 9.78946 5.4175 7.19353 6.57794 5.2229C7.77827 3.18453 9.84089 1.77317 12.1352 1.17598C14.4295 0.5788 16.9237 0.804073 18.9756 1.99729C21.017 3.18441 22.6615 5.35309 23.2291 8.72871C23.2605 8.9154 23.4106 9.0594 23.5985 9.08303C29.7498 9.8567 32.2453 17.9923 27.5832 22.0191L27.5831 22.019L27.5748 22.0265C26.1663 23.3084 24.3154 24.0138 22.3917 23.9997L22.3885 23.9997H5.7233C-0.764292 23.5327 -0.764387 14.2001 5.72301 13.7328C6.55446 13.7351 7.37023 13.9283 8.10206 14.2974C8.31349 14.4041 8.57134 14.3191 8.67798 14.1077C8.78463 13.8963 8.69968 13.6384 8.48825 13.5318C7.74358 13.1562 6.92694 12.9381 6.09124 12.887Z" fill="#292D32"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24.1415 8.69501C24.1455 8.93177 23.9569 9.12699 23.7201 9.13103C22.9113 9.14484 22.1164 9.33812 21.3912 9.69716C21.179 9.80222 20.9218 9.71535 20.8167 9.50313C20.7116 9.29092 20.7985 9.03371 21.0107 8.92865C21.8497 8.5133 22.7695 8.2896 23.7055 8.27362C23.9422 8.26958 24.1374 8.45824 24.1415 8.69501Z" fill="#292D32"/><path d="M19.1339 12.7129L16.8391 10.4181C16.5721 10.1507 16.2098 10.0003 15.8319 10H12.4253C12.0473 10 11.6848 10.1502 11.4175 10.4175C11.1502 10.6848 11 11.0473 11 11.4253V17.1267C11 17.5047 11.1502 17.8672 11.4175 18.1345C11.6848 18.4018 12.0473 18.552 12.4253 18.552H18.1267C18.5047 18.552 18.8672 18.4018 19.1345 18.1345C19.4018 17.8672 19.552 17.5047 19.552 17.1267V13.7201C19.5517 13.3422 19.4013 12.9799 19.1339 12.7129ZM14.3258 17.6018V16.6516H16.2262V17.6018H14.3258ZM18.6018 17.1267C18.6018 17.2527 18.5517 17.3735 18.4626 17.4626C18.3735 17.5517 18.2527 17.6018 18.1267 17.6018H17.1764V16.1764C17.1764 16.0504 17.1264 15.9296 17.0373 15.8405C16.9482 15.7514 16.8273 15.7013 16.7013 15.7013H13.8507C13.7247 15.7013 13.6038 15.7514 13.5147 15.8405C13.4256 15.9296 13.3756 16.0504 13.3756 16.1764V17.6018H12.4253C12.2993 17.6018 12.1785 17.5517 12.0894 17.4626C12.0003 17.3735 11.9502 17.2527 11.9502 17.1267V11.4253C11.9502 11.2993 12.0003 11.1785 12.0894 11.0894C12.1785 11.0003 12.2993 10.9502 12.4253 10.9502H13.3756V13.3258C13.3756 13.4518 13.4256 13.5726 13.5147 13.6617C13.6038 13.7508 13.7247 13.8009 13.8507 13.8009H15.7511C15.8771 13.8009 15.998 13.7508 16.0871 13.6617C16.1762 13.5726 16.2262 13.4518 16.2262 13.3258C16.2262 13.1998 16.1762 13.0789 16.0871 12.9898C15.998 12.9007 15.8771 12.8507 15.7511 12.8507H14.3258V10.9502H15.8319C15.9577 10.952 16.0782 11.0012 16.1692 11.088L18.464 13.3828C18.508 13.4272 18.5429 13.4798 18.5665 13.5377C18.5902 13.5956 18.6021 13.6576 18.6018 13.7201V17.1267Z" fill="#292D32"/></svg>';    
    $deleteButton.innerHTML = '<svg width="50" height="30" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.4061 12.2794H17.0306V11.4859C17.0194 11.1818 16.8881 10.8944 16.6655 10.6869C16.4428 10.4794 16.147 10.3687 15.8428 10.3789H14.4175C14.1133 10.3687 13.8174 10.4794 13.5948 10.6869C13.3721 10.8944 13.2408 11.1818 13.2297 11.4859V12.2794H10.8541C10.7281 12.2794 10.6073 12.3294 10.5182 12.4185C10.4291 12.5076 10.379 12.6285 10.379 12.7545C10.379 12.8805 10.4291 13.0013 10.5182 13.0904C10.6073 13.1795 10.7281 13.2296 10.8541 13.2296H11.3293V18.4558C11.3293 18.8338 11.4794 19.1964 11.7467 19.4637C12.014 19.731 12.3766 19.8811 12.7546 19.8811H17.5057C17.8837 19.8811 18.2463 19.731 18.5136 19.4637C18.7809 19.1964 18.931 18.8338 18.931 18.4558V13.2296H19.4061C19.5321 13.2296 19.653 13.1795 19.7421 13.0904C19.8312 13.0013 19.8813 12.8805 19.8813 12.7545C19.8813 12.6285 19.8312 12.5076 19.7421 12.4185C19.653 12.3294 19.5321 12.2794 19.4061 12.2794ZM14.1799 11.4859C14.1799 11.4099 14.2797 11.3291 14.4175 11.3291H15.8428C15.9806 11.3291 16.0804 11.4099 16.0804 11.4859V12.2794H14.1799V11.4859ZM17.9808 18.4558C17.9808 18.5818 17.9308 18.7027 17.8417 18.7918C17.7525 18.8809 17.6317 18.9309 17.5057 18.9309H12.7546C12.6286 18.9309 12.5077 18.8809 12.4186 18.7918C12.3295 18.7027 12.2795 18.5818 12.2795 18.4558V13.2296H17.9808V18.4558Z" fill="#231F20"/><path d="M13.7048 17.5056C13.8309 17.5056 13.9517 17.4555 14.0408 17.3664C14.1299 17.2773 14.18 17.1565 14.18 17.0305V15.13C14.18 15.004 14.1299 14.8832 14.0408 14.7941C13.9517 14.705 13.8309 14.6549 13.7048 14.6549C13.5788 14.6549 13.458 14.705 13.3689 14.7941C13.2798 14.8832 13.2297 15.004 13.2297 15.13V17.0305C13.2297 17.1565 13.2798 17.2773 13.3689 17.3664C13.458 17.4555 13.5788 17.5056 13.7048 17.5056Z" fill="#231F20"/> <path d="M16.5556 17.5056C16.6816 17.5056 16.8024 17.4555 16.8915 17.3664C16.9806 17.2773 17.0307 17.1565 17.0307 17.0305V15.13C17.0307 15.004 16.9806 14.8832 16.8915 14.7941C16.8024 14.705 16.6816 14.6549 16.5556 14.6549C16.4295 14.6549 16.3087 14.705 16.2196 14.7941C16.1305 14.8832 16.0804 15.004 16.0804 15.13V17.0305C16.0804 17.1565 16.1305 17.2773 16.2196 17.3664C16.3087 17.4555 16.4295 17.5056 16.5556 17.5056Z" fill="#231F20"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0195 8.27781C23.3662 4.84748 21.6242 2.54548 19.4067 1.25599C17.1339 -0.0657055 14.4023 -0.300225 11.9192 0.3461C9.43615 0.992414 7.1698 2.52785 5.83901 4.78776C4.57076 6.94148 4.17462 9.71549 5.20076 12.9246C-1.88926 13.8694 -1.73009 24.339 5.67826 24.8562C5.6882 24.8569 5.69816 24.8573 5.70812 24.8573H22.387C24.5219 24.8725 26.5793 24.0902 28.1479 22.6644C33.2966 18.2114 30.6619 9.37355 24.0195 8.27781ZM6.09124 12.887C5.03962 9.78946 5.4175 7.19353 6.57794 5.2229C7.77827 3.18453 9.84089 1.77317 12.1352 1.17598C14.4295 0.5788 16.9237 0.804073 18.9756 1.99729C21.017 3.18441 22.6615 5.35309 23.2291 8.72871C23.2605 8.9154 23.4106 9.0594 23.5985 9.08303C29.7498 9.8567 32.2453 17.9923 27.5832 22.0191L27.5831 22.019L27.5748 22.0265C26.1663 23.3084 24.3154 24.0138 22.3917 23.9997L22.3885 23.9997H5.7233C-0.764292 23.5327 -0.764387 14.2001 5.72301 13.7328C6.55446 13.7351 7.37023 13.9283 8.10206 14.2974C8.31349 14.4041 8.57134 14.3191 8.67798 14.1077C8.78463 13.8963 8.69968 13.6384 8.48825 13.5318C7.74358 13.1562 6.92694 12.9381 6.09124 12.887Z" fill="#292D32"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.1415 8.69501C24.1455 8.93177 23.9569 9.12699 23.7201 9.13103C22.9113 9.14484 22.1164 9.33812 21.3912 9.69716C21.179 9.80222 20.9218 9.71535 20.8167 9.50313C20.7116 9.29092 20.7985 9.03371 21.0107 8.92865C21.8497 8.5133 22.7695 8.2896 23.7055 8.27362C23.9422 8.26958 24.1374 8.45824 24.1415 8.69501Z" fill="#292D32"/> </svg>';

    $newAnchor.setAttribute("href", "javascript:void(0);");
    $newAnchor.innerHTML = file;
    $newElement.setAttribute("class","guionLista");
    $div.setAttribute("class","divGuion");
    $div1.setAttribute("class","divGuionMedio");
    $newAnchor.addEventListener("click", handleFileClick);

    $div.append($newAnchor);
    $div.append($div1);
    $div.append($backupButton);
    $div.append($deleteButton);
    $newElement.append($div);
    $filesList.append($newElement);
  });
};

const handleGetFile = (data) => {
  const $content = document.querySelector("#datos");
  $content.value = data.file;
};

const  handleUpdatedFile = (data) => {
  const $datos = document.querySelector("#datos");
  $datos.value = data.file;
};

const handleFileClick = (e) => {
  const $datos = document.querySelector("#datos");
  $datos.setAttribute("file-clicked", e.target.innerText);
  socket.send(
    JSON.stringify({
      event: Events.SET_FILE,
      fileClicked: e.target.innerText,
      client: myUsername
    }),
  );
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
    const $iconos = document.createElement("div"); 
    const $newElement1 = document.createElement("span");
    const $divUsers = document.createElement("div");

    $iconos.setAttribute("class","iconos");
    $divUsers.setAttribute("class","listaUsers");
    $newElement.setAttribute("class","listas");
   
    $newElement1.innerHTML = user;

    $divUsers.append($iconos);
    $divUsers.append($newElement1);
    // $newElement.append($iconos);
    $newElement.append($divUsers);
    // $newElement.append($newElement1);
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
