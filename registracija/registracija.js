const registrationForm = document.querySelector("#registration-form");

if (registrationForm) {
  const registrationTypeInputs = document.querySelectorAll(
    'input[name="registrationType"]'
  );

  const friendsSection = document.querySelector("#friends-section");
  const friendsList = document.querySelector("#friends-list");
  const addFriendButton = document.querySelector("#add-friend-button");
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

  registrationTypeInputs.forEach((input) => {
    input.addEventListener("change", updateFriendsSection);
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

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedTimes = registrationForm.querySelectorAll(
      'input[name="availableTime"]:checked'
    );

    if (selectedTimes.length === 0) {
      alert("Pasirink bent vieną tinkamą užsiėmimų laiką.");
      return;
    }

    formMessage.textContent =
      "Registracijos forma užpildyta teisingai. Registracijos išsiuntimą prijungsime kitame etape.";

    formMessage.hidden = false;

    formMessage.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  updateFriendsSection();
  updateAddFriendButton();
}