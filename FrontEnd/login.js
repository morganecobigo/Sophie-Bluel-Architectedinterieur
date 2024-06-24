const formButton = document.querySelector(".form-button");
const token = localStorage.getItem("token");

if (token) {
  window.location.href = "./index.html";
}

const loginUser = async (e) => {
  e.preventDefault();
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  if (!emailInput.value || !passwordInput.value) {
    alert("veuillez renseigner votre email et votre mot de passe");
  }
  const body = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "./index.html";
  } else {
    alert("vos identifiants de connexion sont incorrectes");
  }
};

formButton.addEventListener("click", loginUser);
