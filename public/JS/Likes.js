  let button = document.getElementById("LikesBut");
  let Span = document.getElementById('span-likes');
  let popUp = document.getElementById("popUp");
  let clapIcon = document.getElementById('clap--icon'); // updated on 22 july for like animation implementation
  let claps = 0;

  let para = document.getElementById("clap-counter");

  $(document).ready(function(){
    // addLikes();

    button.addEventListener('click',function(){
      Like();
    })

    // toggling the pop up div

    popUp.addEventListener('click',()=>{
      document.getElementById("popUp-Container").classList.remove("displayPopUp");
    })

    document.getElementById("closeBtn").addEventListener('click',()=>{
      document.getElementById("popUp-Container").classList.add("displayPopUp");
    })

  })


  function Like()
  {
    $.ajax({
      method:'PUT',
      url:`/blog/${likeId}/like`
    })
    .then((data)=>{
      // addLikes();

      Span.innerText = Number(Span.innerText) + 1;

      // this block of code was updated on 22 Juky for implementing animation using Animxyz

      claps += 1;
      para.innerText = `+${claps}`;
      para.classList.add("xyz-out");
      para.setAttribute("xyz","fade up-3 duration-3 ease-out");
      para.style.display = "block";

      clapIcon.classList.add("xyz-in");
      clapIcon.setAttribute("xyz","big-5");

      setTimeout(()=>{

        para.classList.remove("xyz-out");
        para.setAttribute("xyz"," ");
        para.style.display = "none";

        clapIcon.classList.remove("xyz-in");
        clapIcon.setAttribute("xyz","");

      },500)

    })
    .catch((error)=>{
      console.log(error);
    })
  }

  // function addLikes(){
  //   $.ajax({
  //     mathod:'GET',
  //     url:`/blog/${likeId}/get/likes`
  //   })
  //   .then((data)=>{
  //     Span.innerText = data.likes;
  //     // console.log(data.likes);
  //   })
  //   .catch((e)=>{
  //     console.log(e);
  //   })
  // }

  // /blog/comment/:id/reply/:replyId

  function delteReply(commentId,index,id)
  {
    $.ajax({
      method:'DELETE',
      url:`/blog/comment/${commentId}/reply/${id}`
    })
    .then((data)=>{
      // reply-div-<%= index %>
      document.getElementById(`reply-div-${index}`).style.display = 'none';
    }).catch((err)=>{
      console.log(err);
    })
  }

  // /blog/comment/:id/delete

  // delete the Comment
  function deleteComment(blog,id,index,user){
    $.ajax({
      method:'DELETE',
      url:`/blog/${blog}/comment/${id}/delete/${user}`
    }).then((data)=>{
      console.log(data);
      document.getElementById(`CommentSec-${index}`).style.display = 'none';
    }).catch((err)=>{
      console.log(err);
    })
  }
