const COORDS = "coords";
const range = 5000;
const dataList = document.querySelector(".js-infoList");
let info_list = [];

function gandleGeoError() {
  console.log("Can`t access geo localtion");
}
function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}
function handleGeoSucces(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    // latitude: latitude
    latitude,
    longitude
  };
  saveCoords(coordsObj);
  getRangeMasksInfo(latitude, longitude, range);
}

function askForCoords() {
  // success:handleGeoSucces , fail : gandleGeoError
  navigator.geolocation.getCurrentPosition(handleGeoSucces, gandleGeoError);
}
function getRangeMasksInfo(latitude, longitude, range) {
  // API 호출 패스
  fetch(
    `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${latitude}&lng=${longitude}&m=${range}`
  )
    .then(function(response) {
      // fetch
      return response.json();
    })
    .then(function(json) {
      console.log(json);
    });
}
function getSearchAddressMasksInfo() {
  const address = document.getElementById("input_address").value;
  fetch(
    `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${address}`
  )
    .then(function(response) {
      // fetch
      return response.json();
    })
    .then(function(json) {
      console.log(json.stores);
      json.stores.forEach(function(item) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const newId = info_list.length + 1;
        li.appendChild(span);
        li.id = newId;
        span.innerText = item.addr + "  " + item.name;
        if (item.remain_stat == "empty") {
          span.innerText += "  재고없음";
        } else if (item.remain_stat == "some") {
          span.innerText += "  조금남음";
          span.style.color = "#f00";
        } else if (item.remain_stat == "few") {
          span.innerText += "  몇개없음";
          span.style.color = "#f00";
        } else if (item.remain_stat == "plenty") {
          span.innerText += "  여유로움";
          span.style.color = "#f00";
        } else {
          span.innerText += "  정보확인중";
        }
        dataList.appendChild(li);
        const toDoObj = {
          text: item.addr,
          id: newId
        };
        info_list.push(toDoObj);
      });
    });
}
function loadCoords() {
  const loadedCoords = localStorage.getItem(COORDS);

  if (loadedCoords === null) {
    askForCoords();
  } else {
    const parseCoords = JSON.parse(loadedCoords);
    getRangeMasksInfo(parseCoords.latitude, parseCoords.longitude, range);
  }
}
