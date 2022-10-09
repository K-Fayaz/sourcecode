let head = document.getElementById("textContainer");
let first = document.getElementById("firstFour");
let second = document.getElementById("secondFour");


head.addEventListener("mouseover",()=>{
  first.style = 'transform:rotate(15deg);';
  second.style = 'transform:rotate(-15deg);';
})

head.addEventListener("mouseleave",()=>{
  first.style = 'transform:rotate(0deg);'
  second.style = 'transform:rotate(0deg);'
})
