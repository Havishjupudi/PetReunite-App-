
document.addEventListener('DOMContentLoaded', function () {
    const lostToggle = document.getElementById('lost-toggle');
    const foundToggle = document.getElementById('found-toggle');
    const lostSection = document.getElementById('lost-section');
    const foundSection = document.getElementById('found-section');

    // Ensure all elements exist
    if (!lostToggle || !foundToggle || !lostSection || !foundSection) {
        console.error('One or more toggle elements are missing in the DOM.');
        return;
    }

    // Toggles between lost and found pet sections
    lostToggle.addEventListener('click', () => {
        lostToggle.classList.add('active');
        foundToggle.classList.remove('active');
        lostSection.classList.add('active');
        foundSection.classList.remove('active');
    });

    foundToggle.addEventListener('click', () => {
        foundToggle.classList.add('active');
        lostToggle.classList.remove('active');
        foundSection.classList.add('active');
        lostSection.classList.remove('active');
    });


    document.getElementById('Lost-reportForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const submitButton = this.querySelector('button[type="submit"]'); // Get the submit button
        submitButton.disabled = true;

        const notification = document.createElement('div');
        notification.className = 'notification';

        const notificationText = document.createElement('div');
        notificationText.className = 'notification-text';
        notificationText.innerText = 'Processing form..';

        const animatedText = document.createElement('div');
        animatedText.className = 'animated-text';
        animatedText.innerText = 'This may take some time...'; // Animated part

        notification.appendChild(notificationText);
        notification.appendChild(animatedText);

        document.body.appendChild(notification);

        // Make the notification visible
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);



    
        // Create a FormData object from the form
        const formData = new FormData(this);
    
        // Log FormData entries
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
    
        try {
            const response = await fetch('/pets', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Lost pet reported successfully:', data);
            
            // Show message for successfully posted on Instagram
            notification.innerText = 'Form Validated Successfully!';
    
            // After a delay, show the posted message
            setTimeout(() => {
                notification.innerText = 'Posted on Instagram!';
            }, 3000); // Change the delay (2000ms = 2 seconds) as needed
        } catch (error) {
            console.error('Error reporting lost pet:', error);
            alert('Error reporting lost pet. Please try again.');
        }
    
        // Hide notification after 6 seconds
        setTimeout(() => {
            notification.classList.remove('visible'); 
            document.body.removeChild(notification); 
            submitButton.disabled = false;
        }, 7000);
    });

    document.getElementById('verify-found').addEventListener('click', async () => {
        const reuniteId = document.getElementById('found-reunite-id').value;
    
        // Disable the button to prevent multiple clicks
        const verifyButton = document.getElementById('verify-found');
        verifyButton.disabled = true;
    
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerText = 'Verifying... Please wait.';
        document.body.appendChild(notification);
    
        // Make the notification visible
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);
    
        try {
            const response = await fetch(`/pets/${reuniteId}`);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const petDetails = await response.json();
    
            // Autofill the form fields with pet details
            document.getElementById('found-pet-name').value = petDetails.name || '';
            document.getElementById('fill-species').value = petDetails.species || '';
            document.getElementById('fill-last-missing-date').value = petDetails.dateLastSeen ? petDetails.dateLastSeen.split('T')[0] : ''; // Convert date to 'YYYY-MM-DD'
            document.getElementById('fill-last-seen-area').value = petDetails.areaLastSeen || '';
            document.getElementById('fill-email').value = petDetails.emailAddress || '';
            document.getElementById('fill-image').value = petDetails.pictureUrl || '';
    
            console.log('Fetched Pet Details:', petDetails);
    

            const tickMark = document.getElementById('tick-mark');
            tickMark.style.display = 'inline'; 
    
      
            notification.innerText = 'Valid ID!';
            notification.classList.add('valid'); 
        } catch (error) {
            console.error('Error fetching pet details:', error);
            
  
            const tickMark = document.getElementById('wrong-mark');
            tickMark.style.display = 'inline'; 
    
      
            notification.innerText = 'Invalid ID!';
            notification.classList.add('invalid'); 
            // Clean up
            setTimeout(() => {
                notification.classList.remove('visible'); 
                document.body.removeChild(notification); 
                verifyButton.disabled = false; 
            }, 3000); 
        }
    });
    
    document.getElementById('Found-reportForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission
        const submitButton = this.querySelector('button[type="submit"]'); // Get the submit button
        submitButton.disabled = true;

        const notification = document.createElement('div');
        notification.className = 'notification';

        const notificationText = document.createElement('span');
        notificationText.className = 'notification-text';
        notificationText.innerText = 'Processing form...';

        const animatedText = document.createElement('span');
        animatedText.className = 'animated-text';
        animatedText.innerText = 'This may take some time'; // Animated part

        notification.appendChild(notificationText);
        notification.appendChild(animatedText);

        document.body.appendChild(notification);

        // Make the notification visible
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);


        const formData = new FormData(this); // Create a FormData object from the form

        // Log FormData entries
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await fetch('/TempFoundPet', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Lost pet reported successfully:', data);
            // Show message for successfully posted on Instagram
            notification.innerText = 'Form Validated Successfully!';
    
            // After a delay, show the posted message
            setTimeout(() => {
                notification.innerText = 'Posted on Instagram!';
            }, 3000); 
        } catch (error) {
            console.error('Error reporting lost pet:', error);
            alert('Error reporting lost pet. Please try again.');
        }

        // Hide notification after 6 seconds
        setTimeout(() => {
            notification.classList.remove('visible'); 
            document.body.removeChild(notification); 
            submitButton.disabled = false;
        }, 10000);
    
    
        const imageInput = document.getElementById('image');
        const files = imageInput.files; 
        
        const imageUrls = []; 
        
        // Upload each image to Cloudinary and get the URL
        for (let file of files) {
            try {
                const url = await uploadToCloudinary(file);
                imageUrls.push(url); // Store the URL
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
                return; // Exit the function if any upload fails
            }
        }
    
        // Get the email and extract the username
        const email = document.getElementById('fill-email').value;
        const recipientName = email.substring(0, email.indexOf('@')); // Get the username part
    
        // Prepare the EmailJS template parameters with the image URLs
        const templateParams = {
            recipientEmail: email,
            recipientName: recipientName, // Use the extracted username
            petName: document.getElementById('found-pet-name').value,
            petSpecies: document.getElementById('fill-species').value,
            lastmissingdate: document.getElementById('fill-last-missing-date').value,
            lastseenarea: document.getElementById('fill-last-seen-area').value,
            foundArea: document.getElementById('found-area').value,
            petDescription: document.getElementById('found-description').value,
            reuniteId: document.getElementById('found-reunite-id').value,
            contactMailId: document.getElementById('found-email').value,
            imageUrls: imageUrls.join(', '), // Include URLs in the email
        };
    
        // Send the email using EmailJS
        try {
            const response = await emailjs.send('service_mr7zkad', 'template_f7pa0s7', templateParams);
            console.log('Email sent successfully!', response);
            setTimeout(() => {
                notification.innerText = 'Mail sent!'; // Update notification text
            }, 3000);
            

            
        } catch (error) {
            console.error('Error sending email:', error);
            notification.innerText = 'Error sending email. Please try again later.';
        } finally {
            setTimeout(() => {
                notification.classList.remove('visible'); 
                document.body.removeChild(notification); 
            }, 15000);
        }
    });

    document.getElementById('report-no-id').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        document.getElementById('Found-reportForm').style.display = 'none'; 
        document.getElementById('found-no-id-form').style.display = 'block'; 
    });

    document.getElementById('have-id').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        document.getElementById('found-no-id-form').style.display = 'none'; 
        document.getElementById('Found-reportForm').style.display = 'block'; 
    });
    
    document.getElementById('found-pet-no-id-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission
        const submitButton = this.querySelector('button[type="submit"]'); // Get the submit button
        submitButton.disabled = true;
    
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Prepare and show the notification
        const notificationText = document.createElement('span');
        notificationText.className = 'notification-text';
        notificationText.innerText = 'Processing form...';
        
        const animatedText = document.createElement('span');
        animatedText.className = 'animated-text';
        animatedText.innerText = 'This may take some time'; // Animated part
        
        notification.appendChild(notificationText);
        notification.appendChild(animatedText);
        document.body.appendChild(notification);
        
        // Make the notification visible
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);

        const formData = new FormData(this); // Create a FormData object from the form

         // Log FormData entries
         for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await fetch('/FoundPets', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Lost pet reported successfully:', data);
            // Show message for successfully posted on Instagram
            notification.innerText = 'Form Validated Successfully!';
    
            // After a delay, show the posted message
            setTimeout(() => {
                notification.innerText = 'Posted on Instagram!';
            }, 3000); 
        } catch (error) {
            console.error('Error reporting lost pet:', error);
            alert('Error reporting lost pet. Please try again.');
        }

        // Hide notification after 6 seconds
        setTimeout(() => {
            notification.classList.remove('visible'); 
            document.body.removeChild(notification); 
            submitButton.disabled = false;
        }, 10000);
    
    
        const imageInput = document.getElementById('noid-image'); // Ensure this ID is correct
        const files = imageInput.files; 
    
        // Check if any files were selected
        if (!files || files.length === 0) {
            alert('Please select at least one image.');
            submitButton.disabled = false; 
            return; // Exit the function if no files are selected
        }
    
        const imageUrls = []; // To store uploaded image URLs
    
        // Upload each image to Cloudinary and get the URL
        for (let file of files) {
            try {
                const url = await uploadToCloudinary(file); 
                imageUrls.push(url); // Store the URL
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
                submitButton.disabled = false; 
                return; 
            }
        }
    });
    
    
    

    document.getElementById('report-no-id').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        document.getElementById('Found-reportForm').style.display = 'none'; 
        document.getElementById('found-no-id-form').style.display = 'block'; 
    });

    
    //Cloudinary Configuration
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dhlembqcw/image/upload`;
    const cloudinaryPreset = 'ahkrdkel';

    async function uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryPreset);

        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const data = await response.json();
        return data.secure_url; // Return the secure URL
    }
    
});


