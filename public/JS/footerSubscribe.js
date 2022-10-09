
let regular = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;4

// regX

// set display none to message containers
$('.success-subscribe-hero-footer').css('display','none');
$('.failed-subscribe-hero-footer').css('display','none');
$(".invalid-text-hero-footer").css('display','none');

// disable the button

function disableBtn()
{
  $('#subscribeForm-footer button').prop('disabled',true);
  $('#subscribeForm-footer button').css('background','rgba(154, 6, 72,0.5)');
  $('#subscribeForm-footer button').css('opacity','0.7');
  $('#subscribeForm-footer button').css('cursor','not-allowed');
}

function enable()
{
    $('#subscribeForm-footer button').prop('disabled',false);
    $('#subscribeForm-footer button').css('background','#9A0648');
    $('#subscribeForm-footer button').css('opacity','1');
    $('#subscribeForm-footer button').css('cursor','pointer');
}

disableBtn();


function isFooterValid()
{
  let str = $('#email-footer').val().trim();
  let firstname = $("#firstname-footer").val();
  let lastname = $("#lastname-footer").val();
  if(regular.test(str) && firstname.trim().length >= 3 && lastname.trim().length){
      $('.invalid-text-hero-footer').css('display','none');
    enable();
  }else{
    disableBtn();
    //$('.invalid-text-hero').css('display','block');
  }
}

document.getElementById("firstname-footer").addEventListener('input',()=>{
  isFooterValid();
  $("#subscriberBtn-hero-footer div").css('display','none');
  $('.failed-subscribe-hero-footer').css('display','none');
  $('.success-subscribe-hero-footer').css('display','none');
  let firstname = $("#firstname-footer").val();
  if(firstname.trim().length >= 3)
    $("#firstname-footer").css('border-color','green');
  else {
    $('#firstname-footer').css('border-color','red');
  }
})

document.getElementById("email-footer").addEventListener('input',()=>{
  isFooterValid();
  $("#subscriberBtn-hero-footer div").css('display','none');
  $('.failed-subscribe-hero-footer').css('display','none');
  $('.success-subscribe-hero-footer').css('display','none');
  let email = $("#email-footer").val().trim();
  if(regular.test(email)){
  // console.log('I am good');
    $("#email-footer").css('border-color','green');
    $(".invalid-text-hero-footer").css('display','none');
  }
  else{
    $("#email-footer").css('border-color','red');
    $(".invalid-text-hero-footer").css('display','block');
    $(".invalid-text-hero-footer").css('color','red');
  }
    // console.log('No');

})

document.getElementById("lastname-footer").addEventListener('input',()=>{
  isFooterValid();
  $("#subscriberBtn-hero-footer div").css('display','none');
  $('.failed-subscribe-hero-footer').css('display','none');
  $('.success-subscribe-hero-footer').css('display','none');
  let lastname = $("#lastname-footer").val();
  if(lastname.trim().length)
    $("#lastname-footer").css('border-color','green');
  else {
    $("#lastname-footer").css('border-color','red');
  }
})



document.getElementById("subscribeForm-footer").addEventListener('submit',(event)=>{
  event.preventDefault();
  $("#subscriberBtn-hero-footer div").css('display','block');
  disableBtn();

  // sending the  emails on submit
  let email = $("#email-footer").val().trim();
  let firstname = $("#firstname-footer").val().trim();
  let lastname = $("#lastname-footer").val().trim();

  let data = {
    email:email,
    firstname: firstname,
    lastname:lastname
  };

  $.ajax({
    method:'POST',
    url:'/user/emails/subscribe/news-letter',
    data
  }).then((data)=>{
    console.log(data);
    $("#subscriberBtn-hero-footer div").css('display','none');
    $('.success-subscribe-hero-footer').css('display','block');
    $('#email-footer').val("");
    $('#firstname-footer').val("");
    $('#lastname-footer').val("");
    $('#email-footer').css('border-color',document.documentElement.style.getPropertyValue('--brandColor'));
    $('#firstname-footer').css('border-color','#9A0648');
    $('#lastname-footer').css('border-color','#9A0648');
  })
  .catch((err)=>{
    console.log(err);
    $("#subscriberBtn-hero-footer div").css('display','none');
    $('#firstname-footer').css('border-color','#9A0648');
    $('#lastname-footer').css('border-color','#9A0648');
    $('.failed-subscribe-hero-footer').css('display','block');
  })

})

function deletePost(id)
{
  // now delete the post from the database and from the DOM

  // first delete from DOM

  $.ajax({
    method:'DELETE',
    url:`/blog/delete/${id}/`
  })
  .then((data)=>{
    // console.log(data);
    // console.log('Post deleted successfully');
    $('#display_message p').text('Post deleted successfully');
    $('#display_message').css('background','rgba(23,136,14,.7)');
    document.getElementById('blog-' + id).style.display = 'none';
    document.getElementById('display_message').classList.add('message');
    setTimeout(()=>{
      document.getElementById('display_message').classList.remove('message');
    },5000)
  })
  .catch((err)=>{
    $('#display_message p').text(err.responseJSON);
    document.getElementById('display_message').classList.add('message');
    $('#display_message').css('background','rgba(187,48,17,.7)');
    setTimeout(()=>{
      document.getElementById('display_message').classList.remove('message');
    },5000)
    // console.log(err.responseJSON);
  })
}
