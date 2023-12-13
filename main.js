let inputElem = document.querySelectorAll('input[type="number"]');

let dailyConsumption = document.querySelector('.daily_consumption');
let usedUp = document.querySelector('.used_up');
let remains = document.querySelector('.remains');
let budget = document.querySelector('.budget');
let btnSend = document.querySelector('.btn_send');
let formSend = document.querySelector('#form_send');
let btnGet = document.querySelector('.btn_get');
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
usedUp.oninput = function() {
   remains.innerText = Math.floor(dailyConsumption.value - usedUp.value);
   forecastTextDays.innerText = Math.floor((dailyConsumption.value - usedUp.value) * days);
}

function sendRemains() {
   let sumSet = Math.floor(budget.value - usedUp.value);
   let remainsSet = Math.floor(dailyConsumption.value - usedUp.value);
   localStorage.setItem("Остаток", JSON.stringify(sumSet));
   localStorage.setItem("Остаток на день", JSON.stringify(remainsSet));
   localStorage.setItem("Осталось дней", JSON.stringify(days - 1));
   localStorage.setItem("Сегодня", currentDate);
}

btnGet.addEventListener('click', (e) => {
   e.preventDefault();
   remainsTextBudget.innerText = JSON.parse(localStorage.getItem("Остаток"));
   remains.innerText = JSON.parse(localStorage.getItem("Остаток на день"));
   remainsTextDays.innerText = JSON.parse(localStorage.getItem("Осталось дней"));
});

localStorage.getItem("Сегодня") == currentDate ? btnSend.disabled = true : btnSend.disabled = false;

formSend.addEventListener('submit', (e) => {
   e.preventDefault();
   sendRemains();
   e.target.reset();
   localStorage.setItem("Сегодня", currentDate);
   btnSend.disabled = true;
});