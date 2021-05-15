const socket = io();

var pseudo;

const DEFAULT_PSEUDO = 'anonyme';
const MODAL_PSEUDO = document.getElementById('modal-pseudo');
const INPUT_PSEUDO = document.getElementById('input-pseudo');
const MODAL_RESULTS = document.getElementById('modal-results');
const LIST_RESULTS = document.getElementById('list-results');
const RESULT_VERDICT = document.getElementById('result-verdict');
const BTN_START_AGAIN = document.getElementById('btn-start-again');
const BTN_PSEUDO = document.getElementById('btn-pseudo');
const YES_IMG_PATH = 'res/yes.svg';
const NO_IMG_PATH = 'res/no.svg';
const NULL_IMG_PATH = 'res/question-mark.svg';
const YES_VALUE = 'y';
const NO_VALUE = 'n';
const YES_VERDICT = 'YES';
const NO_VERDICT = 'NO';
const NULL_VERDICT = 'Egalité';
const YES_COLOR = '#99ca4e';
const NO_COLOR = '#fd5e50';
const NULL_COLOR = '#34568B';
const BTN_START_COLOR_ACTIVE = '#4b719c';
const BTN_START_COLOR_NOT_ACTIVE = '#66696e';

function update_verdict(list_votes) {
  let nb_yes = 0, nb_no = 0,
      start_again_available = true,
      verdict, background_color;

  list_votes.map(vote => {
    if (vote.vote_value === YES_VALUE) nb_yes++;
    else if (vote.vote_value === NO_VALUE) nb_no++;
    else start_again_available = false;
  });

  if (nb_yes > nb_no) {
    verdict = YES_VERDICT;
    background_color = YES_COLOR;
  } else if (nb_no > nb_yes) {
    verdict = NO_VERDICT;
    background_color = NO_COLOR;
  } else {
    verdict = NULL_VERDICT;
    background_color = NULL_COLOR;
  }
  RESULT_VERDICT.innerHTML = verdict;
  MODAL_RESULTS.style.backgroundColor = background_color;

  if (start_again_available) {
    BTN_START_AGAIN.style.backgroundColor = BTN_START_COLOR_ACTIVE;
    BTN_START_AGAIN.onclick = () => {
      socket.emit('start-again');
    }
  } else {
    BTN_START_AGAIN.style.backgroundColor = BTN_START_COLOR_NOT_ACTIVE;
    BTN_START_AGAIN.onclick = () => null;
  }
}

function append_vote_to_html(vote) {
  const vote_html = document.createElement('li');

  let img_path;
  if (vote.vote_value === YES_VALUE) img_path = YES_IMG_PATH;
  else if (vote.vote_value === NO_VALUE) img_path = NO_IMG_PATH;
  else img_path = NULL_IMG_PATH;
  const img = document.createElement('img');
  img.setAttribute('src', img_path);
  img.setAttribute('alt', vote.vote_value + ' image');

  const pseudo = document.createElement('p');
  pseudo.innerHTML = vote.pseudo;

  vote_html.appendChild(img);
  vote_html.appendChild(pseudo);

  LIST_RESULTS.appendChild(vote_html);
}

function update_btn_pseudo() {
  BTN_PSEUDO.innerHTML = pseudo;
}

function validate_new_pseudo() {
  let new_pseudo = INPUT_PSEUDO.value;
  if (!new_pseudo) new_pseudo = DEFAULT_PSEUDO;
  localStorage.setItem('jlb-pseudo', new_pseudo);
  pseudo = new_pseudo;
  socket.emit('change-pseudo', new_pseudo);
  update_btn_pseudo();
  close_modal_pseudo();
}

function btn_yes_clicked() {
  socket.emit('new-vote', YES_VALUE);
  MODAL_RESULTS.style.display = 'block';
}

function btn_no_clicked() {
  socket.emit('new-vote', NO_VALUE);
  MODAL_RESULTS.style.display = 'block';
}

function close_modal_pseudo() {
  MODAL_PSEUDO.style.display = 'none';
}

function modal_pseudo_clicked(event) {
  if (event.target.id !== 'input-pseudo') close_modal_pseudo();
}

function open_modal_pseudo() {
  MODAL_PSEUDO.style.display = 'block';
  INPUT_PSEUDO.placeholder = pseudo;
  INPUT_PSEUDO.value = '';
  INPUT_PSEUDO.focus();
}

function main() {
  pseudo = localStorage.getItem('jlb-pseudo');
  if (!pseudo) pseudo = DEFAULT_PSEUDO;
  update_btn_pseudo();
  socket.emit('new-player', pseudo);
}

socket.on('restart', () => MODAL_RESULTS.style.display = 'none');

socket.on('update-votes', (list_votes) => {
  console.log(list_votes);
  LIST_RESULTS.innerHTML = '';
  list_votes.map(vote => append_vote_to_html(vote));
  update_verdict(list_votes);
});

window.onload = () => {
  document.body.style.height = (window.innerHeight * 0.9).toString() + 'px';
  document.body.style.width = (window.innerWidth * 0.9).toString() + 'px';
  document.body.style.margin = `${(window.innerHeight * 0.05).toString()}px ${(window.innerWidth * 0.05).toString()}px`;
  main();
}