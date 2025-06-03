document.addEventListener('DOMContentLoaded', () => { // FIXED: Correct arrow function syntax
    // --- DATA MANAGEMENT ---
    let explosiveData = [];
    const defaultData = [
         {
            "code": "1.1A",
            "description": "Substances and articles which have a mass explosion hazard. Consists of primary explosives such as lead azide, lead styphnate, tetracene, etc. transport of these explosives is forbidden except in special cases.",
            "compatible": "1.1A"
        },
        {
            "code": "1.1B",
            "description": "Articles which have a mass explosion hazard but are not made of primary explosives. It comprises items filled with secondary explosives, like bombs, torpedoes, grenades and rockets.",
            "compatible": "1.1B, 1.1C, 1.1D, 1.1E, 1.2B, 1.2C, 1.2D, 1.2E, 1.3C, 1.4B, 1.4C, 1.4D, 1.4E, 1.4S, 1.5D"
        },
        {
            "code": "1.1C",
            "description": "Substances and articles which have a fire hazard and either a minor blast hazard or a minor projection hazard or both, but not a mass explosion hazard.",
            "compatible": "1.1B, 1.1C, 1.1D, 1.1E, 1.1G, 1.2B, 1.2C, 1.2D, 1.2E, 1.2G, 1.3C, 1.3G, 1.4B, 1.4C, 1.4D, 1.4E, 1.4G, 1.4S, 1.5D"
        },
        {
            "code": "1.4S",
            "description": "Substances and articles which present no significant hazard, packed or designed to present only a small hazard in the event of accidental ignition.",
            "compatible": "1.1B, 1.1C, 1.2B, 1.2C, 1.3C, 1.4B, 1.4C, 1.4S"
        },
        {
            "code": "1.5D",
            "description": "Very insensitive substances which have a mass explosion hazard but are so insensitive that there is very little probability of initiation.",
            "compatible": "1.1B, 1.1C, 1.1D, 1.1E, 1.1G, 1.2B, 1.2C, 1.2D, 1.2E, 1.2G, 1.3C, 1.3G, 1.4B, 1.4C, 1.4D, 1.4E, 1.4G, 1.5D"
        },
        {
            "code": "1.6N",
            "description": "Extremely insensitive articles which do not have a mass explosion hazard. Containing only extremely insensitive substances and which demonstrate a negligible probability of accidental initiation or propagation.",
            "compatible": ""
        }
    ];

    function loadData() {
        const storedData = localStorage.getItem('explosiveDB');
        if (storedData) {
            explosiveData = JSON.parse(storedData);
        } else {
            explosiveData = defaultData;
            localStorage.setItem('explosiveDB', JSON.stringify(explosiveData));
        }
    }

    function saveData() {
        localStorage.setItem('explosiveDB', JSON.stringify(explosiveData));
    }

    // --- DOM ELEMENTS ---
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocomplete-list');
    const resultsContainer = document.getElementById('results-container');
    const placeholderText = document.getElementById('placeholder-text');
    const modal = document.getElementById('addExplosiveModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close-btn');
    const addExplosiveForm = document.getElementById('addExplosiveForm');

    // --- SEARCH & AUTOCOMPLETE ---
    searchInput.addEventListener('input', function() {
        const value = this.value;
        closeAllLists();
        if (!value) return false;

        let matches = explosiveData.filter(item => item.code.toUpperCase().includes(value.toUpperCase()));
        
        matches.forEach(item => {
            let div = document.createElement("DIV");
            div.innerHTML = `<strong>${item.code.substr(0, value.length)}</strong>${item.code.substr(value.length)}`;
            div.addEventListener('click', function() {
                searchInput.value = item.code;
                displayResult(item);
                closeAllLists();
            });
            autocompleteList.appendChild(div);
        });
    });

    function displayResult(item) {
        document.getElementById('result-title').innerText = `Hazard Division ${item.code}`;
        document.getElementById('result-description').innerText = item.description;
        const compatibility = item.compatible ? item.compatible : "None";
        document.getElementById('result-compatibility').innerText = compatibility;
        
        placeholderText.style.display = 'none';
        resultsContainer.style.display = 'block';
    }

    function closeAllLists() {
        while (autocompleteList.firstChild) {
            autocompleteList.removeChild(autocompleteList.firstChild);
        }
    }

    document.addEventListener('click', function (e) {
        if (e.target !== searchInput) {
            closeAllLists();
        }
    });

    // --- MODAL & FORM HANDLING ---
    openModalBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    addExplosiveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newCode = document.getElementById('addCode').value.toUpperCase().trim();
        const newDescription = document.getElementById('addDescription').value.trim();

        // --- IMPROVEMENT: Validation and Duplicate Check ---
        if (!newCode || !newDescription) {
            alert('Please fill out both the Classification Code and Description fields.');
            return;
        }

        const existing = explosiveData.find(item => item.code === newCode);
        if (existing) {
            alert(`Error: Classification code '${newCode}' already exists in the database.`);
            return;
        }
        // --- END IMPROVEMENT ---

        const newExplosive = {
            code: newCode,
            description: newDescription,
            compatible: document.getElementById('addCompatible').value
        };

        // Add to our data array
        explosiveData.push(newExplosive);
        // Sort data to keep list tidy
        explosiveData.sort((a, b) => a.code.localeCompare(b.code));
        
        // Save to localStorage
        saveData();
        
        // Give user feedback and close modal
        alert(`Explosive ${newExplosive.code} has been added successfully!`);
        addExplosiveForm.reset();
        modal.style.display = "none";
    });

    // --- INITIALIZE ---
    loadData();
});