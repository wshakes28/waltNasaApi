const resultsNav = document.querySelector("#resultsNav")
const favoritesNav = document.querySelector("#favoritesNav")
const imagesContainer = document.querySelector(".images-container")
const saveConfirmed = document.querySelector(".save-confirmed")
const loader = document.querySelector(".loader")





// NASA API key
const count = 10
const apiKey = 'DEMO_KEY'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`


let resultsArray = [ ]
let favorites = {

}

function createDomNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
    
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement("div")
        card.classList.add("card")
        // Link
        const link = document.createElement("a")
        link.href = result.hdurl
        link.title = "View Full Image"
        link.target = "_blank"
        // Image
        const image = document.createElement("img")
        image.src = result.url 
        image.title = "NASA picture of the day"
        image.loading = "lazy"
        image.classList.add("card-img-top")
        // Card Body
        const cardBody = document.createElement("div")
        cardBody.classList.add("card-Body")
        // Card Title
        const cardTitle = document.createElement("h5")
        cardTitle.classList.add("card-title")
        cardTitle.textContent = result.title
        
        // Save Text
        const saveText = document.createElement('p')
        saveText.classList.add("clickable")
        if(page === 'results') {
            saveText.textContent = "Add to Favorites"
            saveText.setAttribute('onclick', `saveFavorites('${result.url}')`)
    
        } else {
            saveText.textContent = "Remove Favorite"
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`)
    
        }
        // Card Text
        const cardText = document.createElement('p')
        cardText.textContent = result.explanation
        // Footer Container
        const footer = document.createElement("small")
        footer.classList.add("text-muted")
        // date
        const date = document.createElement("strong")
        date.textContent = result.date
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright
        const copyright = document.createElement("span")
        copyright.textContent = ` ${copyrightResult}`
        // Append
        footer.append(date, copyright)
        cardBody.append(cardTitle, saveText, cardText, footer)
        link.appendChild(image)
        card.append(link, cardBody)
        imagesContainer.appendChild(card)
       


    })
}


function updateDom(page) {
    
    // get favorites from local storage 
    if(localStorage.getItem('nasaFavorites')) {  
    
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    
    }
    



    imagesContainer.textContent = ''
    createDomNodes(page)

}


// Fetch Response

async function getNASAPics() {
    // Show Loader
    
    loader.classList.remove('hidden')
    imagesContainer.hidden = true
    setTimeout(() => {
        loader.classList.add('hidden')
        imagesContainer.hidden = false
    }, 2000)

    try { 
        const response = await fetch(apiUrl)
        resultsArray = await response.json()
        updateDom('results')

    } catch(error) {

    }
}

// Add result to favorites

function saveFavorites(itemUrl) {

    // Loop through results array to select favorite
    resultsArray.forEach(item => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item
           
            // Show save confirmation for two seconds
            saveConfirmed.hidden = false
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000)
       
       // Set favorites to local storage
       localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })


}

// Remove Favorite

function removeFavorite(itemUrl) {

    if(favorites[itemUrl]) {
        delete favorites[itemUrl]
        // Set favorites to local storage
       localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
       updateDom(favorites)
    }

}




// On  load get NASA Pictures

getNASAPics()













