var formElement = document.forms['formElement'];

formElement.addEventListener("focus", (evt) => {
  var activeElement = formElement.querySelector('.focused');
	if (activeElement) {
	    activeElement.classList.remove('focused');
    }
  evt.target.classList.add('focused');
}, true);

formElement.addEventListener("blur", (evt) => {
  var activeElement = formElement.querySelector('.focused');
    if (activeElement) {
     	activeElement.classList.remove('focused');
    }
}, true);
