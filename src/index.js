const cardContainer = document.querySelector('[data-type=card-container]');
const ladingOverlay = document.getElementById('loading-overlay');
const cardTamplate = document.querySelector('[data-card-template]');
 

let allCards = [];
let likedStorage = JSON.parse(localStorage.getItem('likedStorage')) || [];

function createCardElement (items) {
    const cardCopy = document.importNode(cardTamplate.content, true);

    const isLiked = likedStorage.includes(items.id);

    if (items.category.image) {
        cardCopy.querySelector('[data-card-image]').src = items.image;
    } else {
        cardCopy.querySelector('[data-card-image]').src = 'https://placehold.co/230x230';
    }
    cardCopy.querySelector('[data-card-header]').textContent = items.title;
    const descriptionElement = cardCopy.querySelector('[data-card-description]');
    const likesButtonContainer = cardCopy.getElementById('likes-button-container');
    const likeButton = cardCopy.querySelector('[data-card-like-button]');
    const likeImage = cardCopy.querySelector('[data-card-like-image]');
    
    cardCopy.querySelector('[data-card-category]').textContent = items.category.name;
    cardCopy.querySelector('[data-card-price-value]').textContent = '$'+ items.price;
    
    likeImage.setAttribute('src', isLiked? './src/img/like_image.png': './src/img/unlike_image.png');

    if (items.description.length > 30) {
        const button = document.createElement('button');
        button.setAttribute('class', 'read-more__button');
        descriptionElement.textContent = `${items.description.slice(0, 30)} ...`;
        button.textContent = 'Read More';
        button.addEventListener('click', function() {
            descriptionElement.textContent = items.description;
        });
        descriptionElement.appendChild(button);
    } else {
        descriptionElement.textContent = items.description;
    }

    likeButton.addEventListener('click', function() {
        if (isLiked) {
            likedStorage = likedStorage.filter((id) => id !== items.id);
        } else {
            likedStorage.push(items.id);
        }
        localStorage.setItem('likedStorage', JSON.stringify(likedStorage));
        renderCards(cardContainer, allCards);
    })
    return cardCopy

} 


function renderCards(container, dataItems) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    dataItems.forEach((item) => {
        const cardElement = createCardElement(item);
        fragment.appendChild(cardElement)
    });
    container.appendChild(fragment); 
}

async function getAllElement () {
    try {
        ladingOverlay.style.display = 'flex';
        await fetch(`https://api.escuelajs.co/api/v1/products`, {
            method: 'GET',
        }).then((response)=> response.json()).then((data) => {
            allCards = data;
            renderCards(cardContainer, data)
        }).finally(() => {
            ladingOverlay.style.display = 'none';
        })
    } catch (e) {
        console.error(e)
    }
}


document.addEventListener('DOMContentLoaded', function() {
    getAllElement();
})