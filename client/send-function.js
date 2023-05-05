//Html elements
const sendButton = document.getElementById('sendButton');
const twittContainer = document.getElementById('twittContainer');

function sendTwitt() {
    console.log('work:)');
    //Create a new HTML element in the memory and ad CSS
    const twittContainer = document.createElement('div');
    twittContainer.classList.add('twitt-container');

    const twitt = document.createElement('p');
    twitt.classList.add('twitts');
    twitt.textContent = twittInput.value;

    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons-container');

    const likeIcon = document.createElement('img');
    likeIcon.classList.add('icon');
    likeIcon.src = 'img/like.svg';
    iconsContainer.appendChild(likeIcon);

    const commentIcon = document.createElement('img');
    commentIcon.classList.add('icon');
    commentIcon.src = 'img/coment.svg';
    iconsContainer.appendChild(commentIcon);

    const editIcon = document.createElement('img');
    editIcon.classList.add('icon');
    editIcon.src = 'img/edit.svg';
    iconsContainer.appendChild(editIcon);

    const deleteIcon = document.createElement('img');
    deleteIcon.classList.add('icon');
    deleteIcon.src = 'img/delete.svg';
    iconsContainer.appendChild(deleteIcon);

    twittContainer.appendChild(twitt);
    twittContainer.appendChild(iconsContainer);
    twitts.appendChild(twittContainer);

    twittInput.value = '';

    likeIcon.setAttribute("data-liked", "false");

    likeIcon.addEventListener("click", function() {
        if (likeIcon.getAttribute("data-liked") === "false") {
          likeIcon.setAttribute("data-liked", "true");
          likeIcon.src = "img/like.png";
        } else {
          likeIcon.setAttribute("data-liked", "false");
          likeIcon.src = "img/like.svg";
        }
      });   
      
      deleteIcon.addEventListener('click', () => {
        twittContainer.remove();
    });
}

sendButton.addEventListener('click', sendTwitt);

twittInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendTwitt();
    }
});