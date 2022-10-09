  // let reply = document.querySelector('.links-comments .replies-link');
  let replyFormLink = document.querySelector('.links-comments .reply-form-link');

  document.getElementById('commentHead').addEventListener('click',()=>{
    document.getElementById('commentsContainer').classList.toggle('heighToggle')
  })

  // to toggle the comment-reply form - from display none to making it display
  function toggle(index)
  {
    document.getElementById(`Form-${index}`).classList.toggle('ReplyForm');
  }

  // to toggle the replies container - from display none to making it display
  function repltToggle(index){
    document.getElementById(`reply-${index}`).classList.toggle('all-replies');
  }

  //Social share buttons

  let currentPage = window.location.href;

  $("#share-icons").jsSocials({
    url:currentPage.toString(),
    text:'Check this amazing article',
    showLabel:false,
    shares:['whatsapp','linkedin']
  })
