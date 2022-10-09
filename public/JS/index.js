
  // Toggling dark mode and light mode
  let modeBtn = document.getElementById('checkbox');

  window.addEventListener('load',()=>{
    if(localStorage.getItem('mode') === 'dark'){
      modeBtn.checked = true;
    }else{
      modeBtn.checked = false;
    }

    changeTheme();

    // POP UP
    document.getElementById("loginLink").addEventListener('click',()=>{
      document.getElementById("popUp-Container").classList.remove("displayPopUp");
    })

    document.getElementById("loginPOPUP").addEventListener('click',()=>{
      document.getElementById("popUp-Container").classList.remove("displayPopUp");
    })

    // closing the pop up
    document.getElementById("closeBtn").addEventListener("click",()=>{
      document.getElementById("popUp-Container").classList.add("displayPopUp");
    })
  })

  if(!localStorage.getItem('mode')){
    localStorage.setItem('mode','light');
  }

  modeBtn.addEventListener('change',()=>{
    if(localStorage.getItem('mode') == 'light'){
      localStorage.setItem('mode','dark');
    }else{
      localStorage.setItem('mode','light');
    }

    changeTheme();

  })

  function changeTheme()
  {
    if(localStorage.getItem('mode') === 'light'){
      document.documentElement.style.setProperty('--bgColor','white');
      document.documentElement.style.setProperty('--textColor','black');
      // console.log('Light');
    }else{
      document.documentElement.style.setProperty('--bgColor','black');
      document.documentElement.style.setProperty('--textColor','white');
      // console.log('Dark');
    }
  }


  // Toggling Navbar

  let hamburger = document.querySelector('.togller h1');
  let navLinks = document.querySelector('.nav-links');

  let flag = 1;


  hamburger.addEventListener('click',()=>{
    if(flag){
      navLinks.style.display = 'flex';
      flag = 0;
    }else{
      flag = 1;
      navLinks.style.display = 'none';

    }
  })
