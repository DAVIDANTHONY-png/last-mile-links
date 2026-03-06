document.addEventListener('DOMContentLoaded', function() {
    // Get the form - works for any form ID
    const form = document.querySelector('.consultation-form');
    if (!form) return; // Exit if no form found
    
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    const submitBtn = document.getElementById('submitBtn');
    const consentCheckbox = document.getElementById('consent');

    // Step navigation - Next buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStep = this.closest('.form-step');
            const nextStepNum = this.dataset.next;
            
            if (validateStep(currentStep)) {
                goToStep(nextStepNum);
            }
        });
    });

    // Step navigation - Previous buttons
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const prevStepNum = this.dataset.prev;
            goToStep(prevStepNum);
        });
    });

    // Equipment toggle (ICT form)
    const equipmentRadios = document.querySelectorAll('input[name="equipment"]');
    const equipmentList = document.getElementById('equipmentList');
    
    if (equipmentRadios.length && equipmentList) {
        equipmentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    equipmentList.classList.add('show');
                } else {
                    equipmentList.classList.remove('show');
                }
            });
        });
    }

    // Loan details toggle (Agriculture form)
    const loanRadios = document.querySelectorAll('input[name="seekingLoan"]');
    const loanDetails = document.getElementById('loanDetails');
    
    if (loanRadios.length && loanDetails) {
        loanRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    loanDetails.classList.add('show');
                } else {
                    loanDetails.classList.remove('show');
                }
            });
        });
    }

    // Consent toggle for submit button
    if (consentCheckbox && submitBtn) {
        consentCheckbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentStep = document.querySelector('.form-step.active');
        if (validateStep(currentStep)) {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show success message based on form type
            let successMsg = 'Thank you! Your request has been submitted. We will contact you shortly.';
            if (form.id === 'academyForm' || form.querySelector('input[name="course"]')) {
                successMsg = 'Thank you for enrolling! Welcome to Last Mile Links Academy. We will send your admission details shortly.';
            } else if (form.id === 'agricultureForm' || form.querySelector('input[name="farmSize"]')) {
                successMsg = 'Thank you farmer! Your application has been received. Our agricultural team will visit your farm soon.';
            }
            
            alert(successMsg);
            
            // Reset form
            form.reset();
            goToStep('1');
            if (submitBtn) submitBtn.disabled = true;
            if (equipmentList) equipmentList.classList.remove('show');
            if (loanDetails) loanDetails.classList.remove('show');
        }
    });

    function goToStep(stepNum) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (progressLines[index]) progressLines[index].classList.remove('active');
        });

        // Show target step
        const targetStep = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        if (targetStep) targetStep.classList.add('active');
        
        // Update progress
        progressSteps.forEach((step, index) => {
            const stepNumber = parseInt(step.dataset.step);
            if (stepNumber < stepNum) {
                step.classList.add('completed');
                if (progressLines[index]) progressLines[index].classList.add('active');
            } else if (stepNumber == stepNum) {
                step.classList.add('active');
            }
        });
        
        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateStep(step) {
        let isValid = true;
        const inputs = step.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;
            
            // Remove previous error state
            formGroup.classList.remove('error');
            
            // Check if empty
            if (!input.value.trim()) {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                // Email validation
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        formGroup.classList.add('error');
                        isValid = false;
                    }
                }
                
                // Phone validation (basic)
                if (input.type === 'tel') {
                    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                    if (!phoneRegex.test(input.value) || input.value.length < 10) {
                        formGroup.classList.add('error');
                        isValid = false;
                    }
                }
            }
        });

        // Check radio groups that are required
        const radioGroups = new Set();
        step.querySelectorAll('input[type="radio"][required]').forEach(radio => {
            radioGroups.add(radio.name);
        });
        
        radioGroups.forEach(name => {
            const checked = step.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                isValid = false;
                // Add error styling to the radio group container if exists
                const firstRadio = step.querySelector(`input[name="${name}"]`);
                if (firstRadio) {
                    const container = firstRadio.closest('.form-group') || firstRadio.closest('.radio-group');
                    if (container) container.classList.add('error');
                }
            }
        });

        return isValid;
    }

    // Real-time validation removal
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup) formGroup.classList.remove('error');
        });
        
        input.addEventListener('change', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup) formGroup.classList.remove('error');
        });
    });
    
    // Initialize first step
    goToStep('1');
});