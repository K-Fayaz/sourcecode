  // Validating the subscribe FORM
  let subscribeButton = $('#subscribeForm button');
  let regX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  function disable()
  {
    $('#subscribeForm button').prop('disabled',true);
    $('#subscribeForm button').css('background','rgba(154, 6, 72,0.5)');
    $('#subscribeForm button').css('opacity','0.7');
    $('#subscribeForm button').css('cursor','not-allowed');
  }

  function enableButton()
  {
    // if(enable){
      $('#subscribeForm button').prop('disabled',false);
      $('#subscribeForm button').css('background','#9A0648');
      $('#subscribeForm button').css('opacity','1');
      $('#subscribeForm button').css('cursor','pointer');
    // }
  }

  disable();

  function isValid()
  {
    let str = $('#email').val().trim();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    if(regX.test(str) && firstname.trim().length >= 3 && lastname.trim().length){
        $('.invalid-text-hero').css('display','none');
      enableButton();
    }else{
      disable();
      //$('.invalid-text-hero').css('display','block');
    }
  }

  document.getElementById('email').addEventListener('input',()=>{
    // for now get the input data and check if the length is greater than or equal to 7
    let email = $('#email').val();
    isValid();
    if(regX.test(email)){
      $('#email').css('border-color','green');
    }else{
      $('#email').css('border-color','red');
    }
  })


  document.getElementById("firstname").addEventListener('input',()=>{
    isValid();
    if($('#firstname').val().trim().length >= 3)
      $('#firstname').css('border-color','green');
    else
      $('#firstname').css('border-color','red');
  })

  document.getElementById("lastname").addEventListener('input',()=>{
    isValid();
    if($('#lastname').val().trim().length)
      $('#lastname').css('border-color','green');
    else
      $('#lastname').css('border-color','red');
  })

  document.getElementById('subscribeForm').addEventListener('submit',(event)=>{
    event.preventDefault();
    $("#subscriberBtn-hero div").css('display','block');
    disable();
    let email = $('#email').val().trim();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    console.log(email);
    let data = {
      email: email,
      firstname:firstname,
      lastname,lastname
    }
    $.ajax({
      method:'POST',
      url:'/user/emails/subscribe/news-letter',
      data
    }).then((data)=>{
      console.log(data);
      $("#subscriberBtn-hero div").css('display','none');
      $('.success-subscribe-hero').css('display','block');
      $('#email').val("");
      $('#firstname').val("");
      $('#lastname').val("");
      $('#email').css('border-color',document.documentElement.style.getPropertyValue('--brandColor'));
      $('#firstname').css('border-color','#9A0648');
      $('#lastname').css('border-color','#9A0648');
    })
    .catch((err)=>{
      console.log(err);
      $("#subscriberBtn-hero div").css('display','none');
      $('#firstname').css('border-color','#9A0648');
      $('#lastname').css('border-color','#9A0648');
      $('.failed-subscribe-hero').css('display','block');
    })
    // console.log('HI');
  })
