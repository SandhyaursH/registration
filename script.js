$(document).ready(function() {
    // Form validation function
    function validateForm(formData) {
        let errors = [];
        
        // Name validation (only letters and spaces)
        if (!/^[A-Za-z\s]{2,50}$/.test(formData.fullName)) {
            errors.push("Name should only contain letters and be 2-50 characters long");
        }
        
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push("Please enter a valid email address");
        }
        
        // Phone validation (basic)
        if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            errors.push("Phone number should be 10 digits");
        }
        
        // Date validation (must be in the past)
        let inputDate = new Date(formData.dob);
        let today = new Date();
        if (inputDate >= today) {
            errors.push("Date of birth must be in the past");
        }
        
        // Gender validation
        if (!formData.gender) {
            errors.push("Please select a gender");
        }
        
        return errors;
    }

    // Add input event listeners for real-time validation
    $('#fullName').on('input', function() {
        let value = $(this).val();
        if (!/^[A-Za-z\s]{0,50}$/.test(value)) {
            $(this).addClass('error');
            $(this).next('.error-message').remove();
            $(this).after('<span class="error-message">Only letters and spaces allowed</span>');
        } else {
            $(this).removeClass('error');
            $(this).next('.error-message').remove();
        }
    });

    $('#phone').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        // Format phone number as (XXX) XXX-XXXX
        if (value.length >= 6) {
            value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
        }
        $(this).val(value);
    });

    // Form submission handler
    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();

        // Remove any existing error messages
        $('.error-message').remove();
        $('.form-error').remove();

        // Collect form data
        let formData = {
            fullName: $('#fullName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            dob: $('#dob').val(),
            gender: $('#gender').val()
        };

        // Validate form
        let errors = validateForm(formData);
        
        if (errors.length > 0) {
            // Display errors at the top of the form
            let errorHtml = '<div class="form-error"><ul>';
            errors.forEach(error => {
                errorHtml += `<li>${error}</li>`;
            });
            errorHtml += '</ul></div>';
            $(this).prepend(errorHtml);
            return;
        }

        // Show loading state
        let submitButton = $(this).find('button[type="submit"]');
        let originalButtonText = submitButton.text();
        submitButton.prop('disabled', true)
                   .html('<span class="spinner"></span> Submitting...');

        // Send data to PHP using Ajax
        $.ajax({
            type: 'POST',
            url: 'process.php',
            data: formData,
            success: function(response) {
                try {
                    let data = JSON.parse(response);
                    
                    // Animate the result container
                    $('#result').fadeOut(300, function() {
                        let displayHtml = '';
                        for (let key in data) {
                            displayHtml += `
                                <div class="data-item" style="opacity: 0">
                                    <strong>${key}:</strong> ${data[key]}
                                </div>`;
                        }
                        
                        $('#displayData').html(displayHtml);
                        $(this).fadeIn(300);

                        // Animate each data item
                        $('.data-item').each(function(index) {
                            $(this).delay(100 * index).animate({
                                opacity: 1
                            }, 500);
                        });
                    });

                    // Reset form
                    $('#registrationForm')[0].reset();
                    
                    // Show success message
                    $('<div class="success-message">Registration successful!</div>')
                        .insertBefore('#result')
                        .delay(3000)
                        .fadeOut(500, function() {
                            $(this).remove();
                        });
                    
                } catch (e) {
                    throw new Error('Invalid response format');
                }
            },
            error: function(xhr, status, error) {
                // Show error message
                $('<div class="error-message">Error submitting form: ' + error + '</div>')
                    .insertAfter(submitButton)
                    .delay(3000)
                    .fadeOut(500, function() {
                        $(this).remove();
                    });
            },
            complete: function() {
                // Reset button state
                submitButton.prop('disabled', false)
                           .text(originalButtonText);
            }
        });
    });
});