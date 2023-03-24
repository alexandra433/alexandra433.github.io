/*
 * Name: Alexandra Hao
 * Date: Nov. 4, 2022
 * Section: AB
 * This Javascipt file makes the buttons on the index.html page respond to user
 * actions so that the game on the page is playable. It requests data from the
 * Bored API and Random User Generator API and uses that data to make the profiles
 * that appear on the page.
 */

"use strict";
(function() {
  const RANDOM_USER_API_URL =
  "https://randomuser.me/api/?nat=us?format=json&nat=us&inc=name,location,dob,picture";
  const BORED_API_URL = "http://www.boredapi.com/api/activity/";

  let isAcceptable = true;

  window.addEventListener("load", init);

  /** Makes the "Start your workday" button clickable. */
  function init() {
    id("start-btn").addEventListener("click", startWork);
  }

  /**
   * Starts the game after the start button is clicked. Makes the accept and reject
   * buttons clickable, builds the first profile card and displays it on the page.
   */
  async function startWork() {
    id("start-btn").disabled = true;
    id("accept-btn").addEventListener("click", handleChoice);
    id("reject-btn").addEventListener("click", handleChoice);
    await makeRequests();
    id("game-section").classList.toggle("hidden");
  }

  /**
   * Makes requests to the Bored API and Random User Generator API and
   * uses the information they return to build a profile card to display on
   * the page.
   */
  async function makeRequests() {
    try {
      let profileResponse = await fetch(RANDOM_USER_API_URL);
      await statusCheck(profileResponse);
      let profileJson = await profileResponse.json();
      buildCardWithUserInfo(profileJson);
      if (profileJson.results[0].name.first.length <= 4 ||
      (profileJson.results[0].location.state[0] === "M" &&
      profileJson.results[0].dob.age < 25)) {
        isAcceptable = false;
      } else {
        isAcceptable = true;
      }
    } catch (error) {
      handleRequestError(error);
    }
    try {
      let activityResponse = await fetch(BORED_API_URL);
      await statusCheck(activityResponse);
      let activityJson = await activityResponse.json();
      buildCardWithActivityInfo(activityJson);
      if (activityJson.type === "recreational") {
        isAcceptable = false;
      }
    } catch (error) {
      handleRequestError(error);
    }
  }

  /**
   * Displays an error message on the page and disables the reject and accept buttons.
   * @param {object} error The error that was thrown.
   */
  function handleRequestError(error) {
    id("accept-btn").disabled = true;
    id("reject-btn").disabled = true;
    let errorMessage = id("error-message");
    let errorText = gen("p");
    errorText.textContent = error;
    errorMessage.appendChild(errorText);
    if (errorMessage.classList.contains("hidden")) {
      errorMessage.classList.remove("hidden");
    }
  }

  /**
   * Adds a profile picture and name, location, and age information to the profile
   * that will be displayed on the page.
   * @param {object} profile The JSON object that contains the profile information.
   */
  function buildCardWithUserInfo(profile) {
    let userImg = gen("img");
    userImg.src = profile.results[0].picture.large;
    userImg.alt = "profile picture";
    let userName = gen("p");
    userName.textContent = "Name: " + profile.results[0].name.first + " " +
      profile.results[0].name.last;
    let userLocation = gen("p");
    userLocation.textContent = "Location: " + profile.results[0].location.state + ", U.S.";
    let userAge = gen("p");
    userAge.textContent = "Age: " + profile.results[0].dob.age;

    let infoText = gen("section");
    infoText.id = "candidate-info";
    let infoCard = id("info-card");
    infoCard.appendChild(userImg);
    infoCard.appendChild(infoText);
    infoText.appendChild(userName);
    infoText.appendChild(userLocation);
    infoText.appendChild(userAge);
  }

  /**
   * Adds information about activites to the profile on the page.
   * @param {object} activityInfo The JSON object that contains info about activities.
   */
  function buildCardWithActivityInfo(activityInfo) {
    let activityChoice = gen("p");
    activityChoice.textContent = "Activity: " + activityInfo.activity;
    let activityType = gen("p");
    activityType.textContent = "Activity type: " + activityInfo.type;

    let infoText = id("candidate-info");
    infoText.appendChild(activityChoice);
    infoText.appendChild(activityType);
  }

  /**
   * Handles what happens when the accept or reject buttons are clicked.
   * If the correct button clicked, the score for the number of correctly
   * processed people is incremented by one. If not, the amount of pay deducted
   * is decremented by five. In both cases, the current profile displayed on the
   * page is replaced by a new one.
   */
  async function handleChoice() {
    if ((isAcceptable && this.id === "accept-btn") ||
      (!isAcceptable && this.id === "reject-btn")) {
      let numCorrect = id("num-processed");
      numCorrect.textContent = parseInt(numCorrect.textContent) + 1;
    } else {
      let deduction = id("deduction");
      deduction.textContent = parseInt(deduction.textContent) + 5;
    }
    let infoCard = id("info-card");
    infoCard.innerHTML = "";
    infoCard.classList.toggle("hidden");
    await makeRequests();
    infoCard.classList.toggle("hidden");
  }

  /**
   * Throws an error if the given response is not ok.
   * @param {object} response The response from a fetch request.
   * @returns {object} The response from a fetch request.
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * Shortcut function from lecture for accessing an element by id.
   * @param {string} id - The id of the element.
   * @returns {HTMLElement} The html element with the given id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Shortcut function from lecture for creating new DOM elements.
   * @param {string} tagName - The name of the html tag.
   * @returns {HTMLElement} An empty DOM node with type tagName.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();