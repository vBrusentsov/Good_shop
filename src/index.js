const cardContainer = document.querySelector('[data-type=card-container]');
const ladingOverlay = document.getElementById('loading-overlay');
// const likeButton = document.querySelector('[data-card-like-button]');


function createCardElement (items) {
    const templateByAttribute = document.querySelector('[data-card-template]');
    const cardCopy = document.importNode(templateByAttribute.content, true);
    if (items.category.image) {
        cardCopy.querySelector('[data-card-image]').src = items.category.image;
    } else {
        cardCopy.querySelector('[data-card-image]').src = 'https://placehold.co/230x230';
    }
    cardCopy.querySelector('[data-card-header]').textContent = items.title;
    const descriptionElement = cardCopy.querySelector('[data-card-description]');
    const likesButtonContainer = cardCopy.getElementById('likes-button-container');
    const likeButton = document.createElement('button');
    const likeImage = document.createElement('img');
    let isLiked;
    
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
    

    cardCopy.querySelector('[data-card-category]').textContent = items.category.name;
    cardCopy.querySelector('[data-card-price-value]').textContent = '$'+ items.price;

    likeButton.setAttribute('class', 'card__button__likes');
    likeButton.setAttribute('id', 'like-button');

    isLiked = getLikedCardsFromLocalStorage().includes(items.id);

    function toggleLikeImage() {
        if (isLiked) {
            likeImage.setAttribute('src', '../img/like_image.png');
        } else {
            likeImage.setAttribute('src', '../img/unlike_image.png');
        }
    }

    toggleLikeImage();

    likeImage.setAttribute('width', '20px');
    likeImage.setAttribute('alt', 'Like');
    likeButton.appendChild(likeImage);


    likeButton.addEventListener('click', function() {
        isLiked = !isLiked;
        if(isLiked) {
            localStorage.setItem();
        } else {
            localStorage.removeItem(items.id);
        }
        
        console.log(localStorage)
        toggleLikeImage();
    });

likesButtonContainer.appendChild(likeButton);
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
            console.log(data);
            return renderCards(cardContainer, data)
        }).finally(() => {
            ladingOverlay.style.display = 'none';
        })
    } catch (e) {
        console.error(e)
    }
}

function getLikedCardsFromLocalStorage() {
    const likedCards = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (localStorage.getItem(key) === 'true') {
            likedCards.push(key);
        }
    }
    return likedCards;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log(localStorage)
    getAllElement();
})