const registrationForm = document.querySelector("#registration-form");

const ageStatusInputs = document.querySelectorAll(
  'input[name="studentAgeStatus"]'
);

const guardianSection =
  document.querySelector("#guardian-section");

if (registrationForm) {
  const registrationTypeInputs = document.querySelectorAll(
    'input[name="registrationType"]'
  );

  const friendsSection = document.querySelector("#friends-section");
  const friendsList = document.querySelector("#friends-list");
  const addFriendButton = document.querySelector("#add-friend-button");
  const submitButton = registrationForm.querySelector(
    'button[type="submit"]'
  );
  const formMessage = document.querySelector("#form-message");

  const maxFriends = 5;
  let friendNumber = 1;

  function updateFriendsSection() {
    const selectedType = document.querySelector(
      'input[name="registrationType"]:checked'
    );

    if (!selectedType) {
      return;
    }

    const registeringWithFriends =
      selectedType.value === "friends";

    friendsSection.hidden = !registeringWithFriends;

    const friendInputs =
      friendsSection.querySelectorAll(".friend-input");

    friendInputs.forEach((input) => {
      input.required = registeringWithFriends;
    });
  }

  function updateAddFriendButton() {
    const friendCount =
      friendsList.querySelectorAll(".friend-entry").length;

    if (friendCount >= maxFriends) {
      addFriendButton.disabled = true;
      addFriendButton.textContent =
        "Pasiektas 5 draugų limitas";
    } else {
      addFriendButton.disabled = false;
      addFriendButton.textContent =
        "+ Pridėti dar vieną draugą";
    }
  }

  function resetFriendsList() {
    const friendEntries =
      friendsList.querySelectorAll(".friend-entry");

    friendEntries.forEach((entry, index) => {
      if (index > 0) {
        entry.remove();
      }
    });

    updateAddFriendButton();
  }

function updateGuardianSection() {
  const selectedAgeStatus = document.querySelector(
    'input[name="studentAgeStatus"]:checked'
  );

  const studentIsMinor =
    selectedAgeStatus?.value === "minor";

  guardianSection.hidden = !studentIsMinor;

  const guardianInputs =
    guardianSection.querySelectorAll(".guardian-input");

  guardianInputs.forEach((input) => {
    input.required = studentIsMinor;
  });
}

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove(
      "form-message-success",
      "form-message-error"
    );

    formMessage.classList.add(
      type === "success"
        ? "form-message-success"
        : "form-message-error"
    );

    formMessage.hidden = false;

    formMessage.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
  
  registrationTypeInputs.forEach((input) => {
    input.addEventListener("change", updateFriendsSection);
  });

  ageStatusInputs.forEach((input) => {
  input.addEventListener("change", updateGuardianSection);
  });

  addFriendButton.addEventListener("click", () => {
    const friendCount =
      friendsList.querySelectorAll(".friend-entry").length;

    if (friendCount >= maxFriends) {
      return;
    }

    friendNumber++;

    const friendEntry = document.createElement("div");
    friendEntry.classList.add("friend-entry");

    friendEntry.innerHTML = `
      <div class="form-group">
        <label for="friend-first-name-${friendNumber}">
          Draugo vardas
        </label>

        <input
          type="text"
          id="friend-first-name-${friendNumber}"
          name="friendFirstName[]"
          class="friend-input"
          required
        >
      </div>

      <div class="form-group">
        <label for="friend-last-name-${friendNumber}">
          Draugo pavardė
        </label>

        <input
          type="text"
          id="friend-last-name-${friendNumber}"
          name="friendLastName[]"
          class="friend-input"
          required
        >
      </div>

      <button
        type="button"
        class="remove-friend-button"
      >
        Pašalinti
      </button>
    `;

    friendsList.appendChild(friendEntry);
    updateAddFriendButton();
  });

  friendsList.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("remove-friend-button")
    ) {
      const friendEntry = event.target.closest(".friend-entry");

      friendEntry.remove();
      updateAddFriendButton();
    }
  });

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedTimes = registrationForm.querySelectorAll(
      'input[name="availableTime"]:checked'
    );

    if (selectedTimes.length === 0) {
      showMessage(
        "Pasirink bent vieną tinkamą užsiėmimų laiką.",
        "error"
      );

      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Siunčiama...";

    formMessage.hidden = true;

    const formData = new FormData(registrationForm);

    try {
      const response = await fetch(registrationForm.action, {
        method: registrationForm.method,
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        registrationForm.reset();
        resetFriendsList();
        updateFriendsSection();
        updateGuardianSection();

        showMessage(
          "Registracija sėkmingai išsiųsta! Netrukus su tavimi susisieksime.",
          "success"
        );
      } else {
        const responseData = await response.json();

        let errorMessage =
          "Registracijos išsiųsti nepavyko. Patikrink duomenis ir bandyk dar kartą.";

        if (responseData.errors) {
          errorMessage = responseData.errors
            .map((error) => error.message)
            .join(" ");
        }

        showMessage(errorMessage, "error");
      }
    } catch (error) {
      showMessage(
        "Nepavyko prisijungti prie registracijos sistemos. Patikrink interneto ryšį ir bandyk dar kartą.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Pateikti registraciją";
    }
  });

  updateFriendsSection();
  updateAddFriendButton();
  updateGuardianSection();
}