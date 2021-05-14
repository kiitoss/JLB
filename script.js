const socket = io();

var pseudo;
const default_pseudo = "anonyme";
const modal_pseudo = document.getElementById("modal-pseudo");
const input_pseudo = document.getElementById("input-pseudo");

function update_btn_pseudo() {
  document.getElementById("btn-pseudo").innerHTML = pseudo;
}
function validate_new_pseudo() {
  let new_pseudo = input_pseudo.value;
  if (!new_pseudo) new_pseudo = default_pseudo;
  localStorage.setItem("jlb-pseudo", new_pseudo);
  pseudo = new_pseudo;
  update_btn_pseudo();
  close_modal_pseudo();
}

function btn_yes_clicked() {
  console.log("Oui");
  location.href = "./results.html";
}

function btn_no_clicked() {
  console.log("Non");
}

function close_modal_pseudo() {
  modal_pseudo.style.display = "none";
}

function modal_pseudo_clicked(event) {
  if (event.target.id !== "input-pseudo") close_modal_pseudo();
}

function open_modal_pseudo() {
  modal_pseudo.style.display = "block";
  input_pseudo.placeholder = pseudo;
  input_pseudo.value = "";
  input_pseudo.focus();
}

function main() {
  pseudo = localStorage.getItem("jlb-pseudo");
  if (!pseudo) pseudo = default_pseudo;
  update_btn_pseudo();
}

window.onload = () => {
  document.body.style.height = (window.innerHeight * 0.9).toString() + "px";
  document.body.style.width = (window.innerWidth * 0.9).toString() + "px";
  document.body.style.margin = `${(window.innerHeight * 0.05).toString()}px ${(window.innerWidth * 0.05).toString()}px`;
  main();
}