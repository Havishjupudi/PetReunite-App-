document.addEventListener('DOMContentLoaded', async function () {
    const petCardsContainer = document.getElementById('pet-cards-container');
    const searchBox = document.querySelector('.search-box'); 
    const searchButton = document.querySelector('.search-button'); 
  
  
 
    const socket = new WebSocket('ws://localhost:8080');
  
    // Handle WebSocket messages for new pets added in real-time
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.message === 'New pet added') {
        addPetCard(message.data); // Add the new pet card in real-time
      }
    };
  

    // Function to add a single pet card
    function addPetCard(pet) {
      const petCard = document.createElement('div');
      petCard.classList.add('pet-card');

      // Check if pictureUrl is defined; if not, use a placeholder
      const fullImageURL = pet.pictureUrl;

      petCard.innerHTML = `
        <img class="pet-img" src="${fullImageURL}" alt="${pet.name}" />
        <div class="pet-content">
          <div class="pet-info">
            <p class="pet-name"><strong>Pet Name: ${pet.name}</strong></p>
            <p class="pet-location"><strong>Area Found:</strong> ${pet.foundArea}</p>
          </div>
          <div class="pet-details">
            <p class="pet-species"><strong>Species:</strong> ${pet.species}</p>
            <p class="pet-id"><strong>Reunite ID:</strong> ${pet.reuniteId}</p>
          </div>
        </div>
      `;

      // Store the Reunite ID in a data attribute for filtering
      petCard.dataset.reuniteId = pet.reuniteId;

      // Redirect to the details page when clicked
      petCard.addEventListener('click', () => {
        window.location.href = `/html/found-details.html?id=${pet.reuniteId}`; 
      });

      petCardsContainer.appendChild(petCard);
    }

  
    // Function to fetch pets from the database and update the pet cards
    async function fetchAndUpdatePets() {
      try {
        const response = await fetch('/TempFoundPet'); // Fetch pets from the server
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`); 
        }
        const pets = await response.json(); 
  
        // Clear the current pet cards to avoid duplicates
        petCardsContainer.innerHTML = '';
  
        // Loop through the pets and create cards
        pets.forEach(pet => {
          addPetCard(pet);
        });
      } catch (error) {
        console.error('Error fetching pets:', error); 
      }
    }
  
  
    function filterPets() {
      const searchValue = searchBox.value.trim(); 
      const petCards = petCardsContainer.querySelectorAll('.pet-card'); 
      let petFound = false; 
  
      petCards.forEach(card => {
        const reuniteId = card.dataset.reuniteId; 
        if (reuniteId.includes(searchValue) || searchValue === '') {
          card.style.display = ''; 
          petFound = true; 
        } else {
          card.style.display = 'none'; 
        }
      });
  
      // Show or hide the search message based on whether a pet was found
      const searchMessage = document.getElementById('search-message');
      if (!petFound) {
        searchMessage.style.display = 'block'; 
        petCardsContainer.classList.add('hidden'); 
      } else {
        searchMessage.style.display = 'none'; 
        petCardsContainer.classList.remove('hidden'); 
      }
    }
  
  // Add event listener to the search button
  searchButton.addEventListener('click', filterPets);
  
  
    // Initial fetch to populate the page with pets
    await fetchAndUpdatePets(); 
  
    // Fetch the pets every few secondsto update the pet list
    setInterval(fetchAndUpdatePets, 500000); 
  });
  
