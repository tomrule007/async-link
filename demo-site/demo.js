// Get Dom Refs

const editButton = document.querySelector('#editButton');
const abortButton = document.querySelector('#abortButton');
const asyncLink = document.querySelector('#asyncLink');
const theLink = document.querySelector('#theLink');
const loadingDiv = document.querySelector('#loadingDiv');
const successDiv = document.querySelector('#successDiv');

const form = document.querySelector('form');

// Setup event listeners

editButton.addEventListener('click', handleEditClick);
abortButton.addEventListener('click', handleAbortClick);
asyncLink.addEventListener('click', handleAsyncClick);
form.addEventListener('submit', handleSubmit);

// Event handlers
function handleAbortClick() {
  if (window.abortController) abortController.abort();
  hide(this);
  theLink.classList.remove('loading');
  theLink.classList.add('failure');
}
function handleEditClick() {
  hide(editButton);
  show(form);
}

function handleSubmit(event) {
  event.preventDefault();

  // Get form values
  const url = this.url.value;
  const redirect = this.redirect.checked;
  const delay = this.delay.value;

  // Setup link and make visible
  theLink.href = url;
  theLink.innerText = url;
  redirect && (theLink.dataset.redirect = '');

  window.mockDelay = delay;

  hide(form);
  show(editButton, asyncLink);
}
function handleAsyncClick(e) {
  const { target } = e;
  console.log(target);
  if (target.dataset.ready !== undefined || target.tagName !== 'A') return;
  e.preventDefault();

  const redirect = target.dataset.redirect !== undefined;
  const { href } = target;

  console.log({ href });

  setTimeout(() => {
    e.target.dataset.ready = '';

    window.abortController = asyncRequest(href, {
      handleSuccess: (response) => {
        hide(abortButton);
        target.classList.add('success');
        target.classList.remove('loading');
        target.dataset.ready = '';
      },
      handleError: (response) => {
        console.log(response);
        target.classList.add('failure');
        target.classList.remove('loading');
      },
      redirect,
    });
  }, Number(window.mockDelay) * 1000);

  target.classList.add('loading');
  show(abortButton);
}

// helpers
function hide(...elements) {
  elements.forEach((el) => el.classList.add('hidden'));
}
function show(...elements) {
  elements.forEach((el) => el.classList.remove('hidden'));
}
