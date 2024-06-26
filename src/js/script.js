"use strict";

//Page elemnets
const appContainer = document.querySelector(".app");
const movementsWindow = document.querySelector(".movements");
const loginMessage = document.querySelector(".login-message");

//Balance value
const balanceValue = document.querySelector(".balance-value");

//Summary values
const inValue = document.querySelector(".in--value");
const interestValue = document.querySelector(".interest--value");
const outValue = document.querySelector(".out--value");

//Inputs
const loginUser = document.querySelector(".input--user");
const loginPin = document.querySelector(".input--password");

//Buttons
const loginBtn = document.querySelector(".btn--login");

//Transfer money
const transferBtn = document.querySelector(".sendto");
const inputTransferTo = document.querySelector(".input-to-user");
const inputTransferAmount = document.querySelector(".input-to-amount");

//Loan
const loanBtn = document.querySelector(".loan-btn");
const inputLoan = document.querySelector(".input-loan");

//Close account
const closeBtn = document.querySelector(".close--btn");
const inputCloseUser = document.querySelector(".input-close-user");
const inputClosePin = document.querySelector(".input-close-pin");

//Sort
const sortBtn = document.querySelector(".btn--sort");

//Date
const datey = document.querySelector(".datee");

//Timer
const timerr = document.querySelector(".timer");
//
//
//

// Accounts
const account1 = {
  name: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: "1111",

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-03-26T12:01:20.894Z",
    "2022-03-30T18:49:59.371Z",
    "2022-03-31T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  name: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: "2222",

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-03-26T12:01:20.894Z",
    "2022-03-30T18:49:59.371Z",
    "2022-03-31T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
/////////////////////////////////
//
//
//

let currentAccount, timer;

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    timerr.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      loginMessage.textContent = `Log in to get started`;
      appContainer.style.opacity = 0;
    }

    time--;
  };

  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

//Pravimo funkciju koju cemoci koristiti i ostale funkcije
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  movementsWindow.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    //Iteriramo istovremeno i kroz njega
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}
    </div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>
    `;

    movementsWindow.insertAdjacentHTML("afterbegin", html);
  });
};

//
//
//
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //Options
  const options = {
    style: "currency",
    currency: acc.currency,
  };

  balanceValue.textContent = `${new Intl.NumberFormat(
    acc.locale,
    options
  ).format(acc.balance)}`;
};

//
//
//
const calcDisplaySummary = function (acc) {
  const options = {
    style: "currency",
    currency: acc.currency,
  };

  const inVal = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outVal = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );

  const interestVal = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (1.2 * mov) / 100)
    .filter((mov) => mov > 1)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);

  inValue.textContent = `${new Intl.NumberFormat(acc.locale, options).format(
    inVal
  )}`;

  outValue.textContent = `${new Intl.NumberFormat(acc.locale, options).format(
    outVal
  )}`;

  interestValue.textContent = `${new Intl.NumberFormat(
    acc.locale,
    options
  ).format(interestVal)}`;
};

//
//
//
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.name
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

const displayUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

///////////////////////////////////
//
//
//

//Function calls
createUsernames(accounts);

///////////////////////////////////
//
//
//

//Event listeners

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === loginUser.value);
  console.log(currentAccount);

  //Welocme message
  if (currentAccount?.pin === loginPin.value) {
    loginMessage.textContent = `Welcome back, ${
      currentAccount.name.split(" ")[0]
    }`;

    appContainer.style.opacity = 100;

    //Clear inputs
    loginUser.value = loginPin.value = "";
    loginPin.blur();

    //Date
    const now = new Date();

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    datey.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Timer
    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    //Display UI
    displayUI(currentAccount);
  }
});

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const accTo = accounts.find((acc) => acc.username === inputTransferTo.value);

  if (
    amount <= currentAccount.movements.reduce((acc, mov) => acc + mov, 0) &&
    amount &&
    amount > 0
  ) {
    accTo.movements.push(amount);
    currentAccount.movements.push(-amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    accTo.movementsDates.push(new Date().toISOString());

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    displayUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
});

loanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoan.value);
  if (
    amount &&
    amount > 0 &&
    amount <= currentAccount.movements.reduce((acc, mov) => acc + mov, 0) / 10
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    displayUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputLoan.value = "";
  inputLoan.blur();
});

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const nameClose = inputCloseUser.value;
  const pinClose = inputClosePin.value;

  if (
    currentAccount.username === nameClose &&
    currentAccount.pin === pinClose
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === nameClose && acc.pin === pinClose
    );

    accounts.splice(index, 1);

    inputClosePin.value = inputCloseUser.value = "";
    inputClosePin.blur();

    appContainer.style.opacity = 0;
  }
});

let sort = false;
sortBtn.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;
});

//FAKE LOGIN
// currentAccount = account1;
// appContainer.style.opacity = 100;

//Countdowntimer
