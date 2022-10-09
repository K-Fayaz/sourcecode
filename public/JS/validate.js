  // **************** COMMENT FORM VALIDATION ***************

  let disabledButton = $('#Form button:disabled');
  let inputFormField = false;
  let textField = false;


  //declare all the functions here
  function disable()
  {
    // console.log(commentFormValidator);
    $('#Form button').prop('disabled',true);
    $('#Form button').css('background','rgba(198,198,198,1)');
    $('#Form button').css('opacity','0.7');
    $('#Form button').css('cursor','not-allowed');
  }

  function enable()
  {
    if(textField)
    {
      $('#Form button').prop('disabled',false);
      $('#Form button').css('background','#9A0648');
      $('#Form button').css('opacity','1');
      $('#Form button').css('cursor','pointer');
    }
  }

  // disabling the button earlier as it does not have any values in the fields
  disable();

  /*  //validating the username field of the comment form
  document.getElementById('user').addEventListener('input',()=>{
    let len = $('#user').val();
    if(len.trim().length < 3){
      $('.validUser').css('display','block');
      inputFormField = false;
      disable();
    }else{
      $('.validUser').css('display','none');
      inputFormField = true;
      enable();
    }
  })*/

  // validating the textarea of the comment post form
  document.getElementById('commentField').addEventListener('input',()=>{
    let text = $('#commentField').val();
    if(text.trim().length == 0){
      $('.in-valid-Comment').css('display','block');
      textField = false;
      disable();
    }else{
      $('.in-valid-Comment').css('display','none');
      textField = true;
      enable();
    }
  })

  // ***************** REPLY FORM VALIADATION ********************
  let replyButton = $("#replyForm form button");

  let replyTextField = false;

  // Functions of reply form validations
  function disableReply()
  {
    $('#replyForm form button').prop('disabled',true);
    $('#replyForm form button').css('background','rgba(198,198,198,1)');
    $('#replyForm form button').css('opacity','0.7');
    $('#replyForm form button').css('cursor','not-allowed');
  }

  function enableReply()
  {
    if(replyTextField)
    {
      $('#replyForm form button').prop('disabled',false);
      $('#replyForm form button').css('background','#9A0648');
      $('#replyForm form button').css('opacity','1');
      $('#replyForm form button').css('cursor','pointer');
    }
  }

  // Disabling the Reply form replyButton
  disableReply();



  /*document.getElementById('user-comment').addEventListener('input',()=>{
    let len = $('#user-comment').val();
    if(len.trim().length < 3){
      $('.validateReplyUser').css('display','block');
      replyInputField = false;
      disableReply();
    }else{
      $('.validateReplyUser').css('display','none');
      replyInputField = true;
      enableReply();
    }
  })*/


  document.getElementById('commentFieldReply').addEventListener('input',()=>{
    let len = $('#commentFieldReply').val();
    if(len.trim().length == 0){
      $('.validateReplyText').css('display','block');
      replyTextField = false;
      disableReply();
    }else{
      $('.validateReplyText').css('display','none');
      replyTextField = true;
      enableReply();
    }
  })
