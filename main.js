let inputElem = document.querySelectorAll('input[type="number"]');

let dailyConsumption = document.querySelector('.daily_consumption');
let usedUp = document.querySelector('.used_up');
let remains = document.querySelector('.remains');
let budget = document.querySelector('.budget');
let btnSend = document.querySelector('.btn_send');
let formSend = document.querySelector('#form_send');
let btnGet = document.querySelector('.btn_get');
let btnClear = document.querySelector('.btn_clear');
let remainsTextBudget = document.querySelector('.remains_text-budget');
let remainsTextDays = document.querySelector('.remains_text-days');
let forecastTextDays = document.querySelector('.forecast_text-days');

let currentDate = new Date().toLocaleDateString();
// Получаем текущую дату и время
let date = new Date();
// Устанавливаем текущую дату и время на начало следующего дня
let nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
// Вычисляем разницу в миллисекундах между текущим временем и началом следующего дня
let timeDiff = nextDay.getTime() - date.getTime();
// Вычисляем количество оставшегося времени в часах, минутах и секундах
let hours = Math.floor(timeDiff / (1000 * 60 * 60));
let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
let arrDate = [hours, minutes, seconds].join(':');

let days = JSON.parse(localStorage.getItem("Осталось дней"));

if(days == 0 || days == null) {
   days = 31;
}

inputElem.forEach((input) => {
   input.addEventListener('input', (e) => {
      e.preventDefault();
      input.value = input.value.replace(/[^0-9\.]/g, '');
   });
});

budget.oninput = function() {dailyConsumption.value = Math.floor(budget.value / days);}
usedUp.oninput = function() {remains.innerText = Math.floor(dailyConsumption.value - usedUp.value);}

function sendRemains() {
   let sumSet = Math.floor(budget.value - usedUp.value);
   let remainsSet = Math.floor(dailyConsumption.value - usedUp.value);
   let consumptionSet = Math.floor(dailyConsumption.value);
   let usedUpSet = Math.floor(usedUp.value);
   localStorage.setItem("Остаток", JSON.stringify(sumSet));
   localStorage.setItem("Расход на день", JSON.stringify(consumptionSet));

   let usedUpGet = JSON.parse(localStorage.getItem("Сколько израсходовано"));
   let consumptionGet = JSON.parse(localStorage.getItem("Расход на день"));

   if(usedUpGet > consumptionGet) {
      localStorage.setItem("Сколько израсходовано", JSON.stringify(usedUpGet - consumptionGet));
   } else {
      localStorage.setItem("Сколько израсходовано", JSON.stringify(usedUpSet));
   }
   days = days - 1;
   localStorage.setItem("Остаток на день", JSON.stringify(remainsSet));
   localStorage.setItem("Осталось дней", JSON.stringify(days));
   localStorage.setItem("Сегодня", currentDate);
}

btnGet.addEventListener('click', (e) => {
   e.preventDefault();
   remainsTextBudget.innerText = JSON.parse(localStorage.getItem("Остаток"));
   remains.innerText = JSON.parse(localStorage.getItem("Остаток на день"));
   remainsTextDays.innerText = JSON.parse(localStorage.getItem("Осталось дней"));

   let usedUpGet = JSON.parse(localStorage.getItem("Сколько израсходовано"));
   let consumptionGet = JSON.parse(localStorage.getItem("Расход на день"));

   let daysDeclination;
   let quantity = Math.round(usedUpGet / consumptionGet);
   quantity > 4 && quantity < 20 ? daysDeclination = "дней" :
   quantity > 1 && quantity < 5 ? daysDeclination = "дня" :
   quantity == 1 ? daysDeclination = "день" : "";
   if(usedUpGet >= consumptionGet && (quantity != NaN && consumptionGet != undefined)) forecastTextDays.innerText = `Экономьте бюджет: ${quantity + ' ' + daysDeclination}`;
});

btnClear.addEventListener('click', (e) => {
   e.preventDefault();
   localStorage.clear();
   location.reload();
});

localStorage.getItem("Сегодня") == currentDate ? btnSend.disabled = true : btnSend.disabled = false;

formSend.addEventListener('submit', () => {
   sendRemains();
   localStorage.setItem("Сегодня", currentDate);
   btnSend.disabled = true;
});