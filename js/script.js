// FORM Code
let currentStep = 0;
const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');

function showStep(step) {
    steps.forEach((stepDiv, index) => {
        stepDiv.classList.toggle('active', index === step);
    });
    prevBtn.style.display = step === 0 ? 'none' : 'inline';
    nextBtn.style.display = step === steps.length - 1 ? 'none' : 'inline';
    submitBtn.style.display = step === steps.length - 1 ? 'inline' : 'none';
}

function changeStep(stepChange) {
    currentStep += stepChange;
    showStep(currentStep);
}

document.getElementById('multiStepForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendEmail();
});

function sendEmail() {
    const formData = new FormData(document.getElementById('multiStepForm'));
    const formObj = {};
    formData.forEach((value, key) => {
        formObj[key] = value;
    });

    emailjs.send('service_emailjs_dn', 'template_x0xmahc', formObj)
        .then(function(response) {
            alert('Your form has been sent!', response.status, response.text);
        }, function(error) {
            alert('Something went wrong...', error);
        });
}

showStep(currentStep);
