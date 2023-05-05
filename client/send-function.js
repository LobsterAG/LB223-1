$(document).ready(function () {
    const $sendButton = $('#sendButton');
    const $twittContainer = $('#twitts');
    const $twitts = $('#twitts');

    function sendTwitt() {
        console.log('work:)');
        //Create a new HTML element in the memory and ad CSS
        const $twittContainer = $('<div></div>').addClass('twitt-container');

        const $twitt = $('<p></p>').addClass('twitts').text($('#twittInput').val());

        const $iconsContainer = $('<div></div>').addClass('icons-container');

        const $likeIcon = $('<img>').addClass('icon').attr('src', 'img/like.svg').attr('data-liked', 'false');
        $iconsContainer.append($likeIcon);

        const $commentIcon = $('<img>').addClass('icon').attr('src', 'img/coment.svg');
        $iconsContainer.append($commentIcon);

        const $editIcon = $('<img>').addClass('icon').attr('src', 'img/edit.svg');
        $iconsContainer.append($editIcon);

        const $deleteIcon = $('<img>').addClass('icon').attr('src', 'img/delete.svg');
        $iconsContainer.append($deleteIcon);

        $twittContainer.append($twitt);
        $twittContainer.append($iconsContainer);
        $twitts.append($twittContainer);

        $('#twittInput').val('');

        $likeIcon.on('click', function () {
            if ($(this).attr('data-liked') === 'false') {
                $(this).attr('data-liked', 'true');
                $(this).attr('src', 'img/like.png');
            } else {
                $(this).attr('data-liked', 'false');
                $(this).attr('src', 'img/like.svg');
            }
        });

        $commentIcon.on('click', function () {
            const $commentInput = $('<input>').addClass('message-input');
            const $commentButton = $('<button>').addClass('message-button').text('Comment');

            $commentButton.on('click', function () {
                const $commentContainer = $('<div></div>').addClass('comment-container');
                const $comment = $('<p></p>').addClass('comment').text($commentInput.val());

                $commentContainer.append($comment);
                $twittContainer.append($commentContainer);

                $commentInput.remove();
                $commentButton.remove();
            });

            $twittContainer.append($commentInput);
            $twittContainer.append($commentButton);
        });

        $deleteIcon.on('click', () => {
            $twittContainer.remove();
        });
    }

    $sendButton.on('click', sendTwitt);

    $('#twittInput').on('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendTwitt();
        }
    });
});
