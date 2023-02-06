const button = document.querySelector("button")
const image = document.querySelector(".image")
const searchName = document.querySelector('#searchName')
const searchBtn = document.querySelector('#searchBtn')

const pokeNumber = document.querySelector(".number")
const pokeName = document.querySelector(".name")
const pokeSymbol = document.querySelector("#pokeSymbol")

const cardBG = document.querySelector(".wrapper")

const flipCard = document.querySelector(".card")
const sound = document.querySelector(".sound")

let youFindIt = false


// * Fonction asynchrone
async function changePokemon() {
    // * pokémon entre 1 et 151
    let randomNumber = Math.ceil((Math.random()*150)+1)
    searchName.value =""

    setTimeout(() => {
        image.style.filter = "brightness(0)"
        pokeName.textContent = "???"
        searchName.focus()
    }, 600);

    // * REQUETE API
    let requestStr = `https://pokebuildapi.fr/api/v1/pokemon/${randomNumber}`
    // let requestStr = `https://pokebuildapi.fr/api/v1/pokemon/39`


    // * Obtient 'promise' à cause de 'asynchrone'
        // ! 'await' 
    let data = await fetch(requestStr)
    // * traduit en JSON
    response = await data.json()
    

    setTimeout(() => {
        image.src = response.image
        pokeNumber.textContent = `#${response.id}`
    }, 300);

    if(response.name == "Nidoran♀") response.name = "nidoran"
    if(response.name == "Nidoran♂") response.name = "nidoran"

    // * CHANGE BACKGROUND
    button.addEventListener("click", changeBG)

    function changeBG() {
        const types = response.apiTypes

        function convert(string) {
            // permet de remplacer les accent par les lettres de bases ("é" => "e")
            return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }

        let typeName =
            typeof types[1] === "undefined" ? types[0].name.toLowerCase() : types[1].name.toLowerCase()

            setTimeout(() => {
                cardBG.style.backgroundImage = `url(./images/${convert(typeName)}.png)` 
                pokeSymbol.src = `./images/symboles/${convert(typeName)}.png` 
            }, 300);
        
    }
    changeBG()
}

// * pour avoir un pokémon dès le départ
changePokemon()

button.addEventListener("click", () => {
    flipCard.classList.remove("card--active")
    setTimeout(() => {
        flipCard.classList.add("card--active")
    }, 800);
    changePokemon()
    youFindIt = false
})


    // * FIND POKEMON

document.addEventListener("keydown", e => {
    if(e.key === "Enter") findPokemon()
})

searchBtn.addEventListener("click", findPokemon)

function findPokemon() {
    let findName = searchName.value.toLowerCase()
    let answerName = response.name.toLowerCase()
    console.log(answerName);
    
    if(youFindIt === false) {
        if(findName === answerName && findName !== ''){
            image.style.filter = "none"
            playSound()
            pokeName.textContent = response.name
            youFindIt = true
        }
    }
}


// * AUDIO
sound.addEventListener("click", playSound)

function playSound() {
    const pokeID = response.id

    let audio

    switch (response.name) {
        case "Pikachu":
            audio = new Audio(`./PKMN-cries/pikachu.ogg`)
            break;
    
        case "Rondoudou":
            audio = new Audio(`./PKMN-cries/rondoudou-chant.ogg`)
            break;

        default :
            audio = new Audio(`./PKMN-cries/${pokeID}.ogg`)
    }

    audio.volume = 0.3
    audio.play()


}