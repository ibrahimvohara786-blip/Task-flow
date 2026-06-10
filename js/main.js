// Theme

const themeBtn =
document.getElementById("themeBtn");

if(localStorage.getItem("theme")==="dark"){
document.body.classList.add("dark");
}

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){
localStorage.setItem("theme","dark");
}else{
localStorage.setItem("theme","light");
}

});

// Tabs

const loginTab =
document.getElementById("loginTab");

const signupTab =
document.getElementById("signupTab");

const loginForm =
document.getElementById("loginForm");

const signupForm =
document.getElementById("signupForm");

loginTab.addEventListener("click",()=>{

loginTab.classList.add("active");
signupTab.classList.remove("active");

loginForm.classList.remove("hidden");
signupForm.classList.add("hidden");

});

signupTab.addEventListener("click",()=>{

signupTab.classList.add("active");
loginTab.classList.remove("active");

signupForm.classList.remove("hidden");
loginForm.classList.add("hidden");

});

// Signup

signupForm.addEventListener("submit",(e)=>{

e.preventDefault();

const user={

name:
document.getElementById("signupName").value,

email:
document.getElementById("signupEmail").value,

password:
document.getElementById("signupPassword").value

};

localStorage.setItem(
"user",
JSON.stringify(user)
);

alert("Account Created Successfully");

signupForm.reset();

loginTab.click();

});

// Login

loginForm.addEventListener("submit",(e)=>{

e.preventDefault();

const savedUser=
JSON.parse(
localStorage.getItem("user")
);

if(!savedUser){

alert("Please create account first");
return;

}

const email=
document.getElementById("loginEmail").value;

const password=
document.getElementById("loginPassword").value;

if(
savedUser.email===email &&
savedUser.password===password
){

localStorage.setItem(
"loggedIn",
"true"
);

window.location.href=
"dashboard.html";

}
else{

alert("Invalid Credentials");

}

});