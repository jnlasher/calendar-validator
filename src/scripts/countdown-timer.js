/**
 * Converts an endTime in seconds into a countdown timer
 * that can be used to trigger expiration of the authorization
 * code from Google's Server
 * @param {*} id ID to update in the DOM
 * @param {*} endTime end time to count down to
 */
function setCountdown(id, endTime) {
  // Get the DOM element to update and store it
  var element = document.getElementById(id);

  // Convert string to base 10 number
  var countTo = parseInt(endTime, 10);
  
  // Run the update every second
  var interval = setInterval(function() {
    countTo--;
    var minutes = Math.floor(countTo / 60);
    var seconds = Math.floor(countTo % 60);
    element.innerHTML = `${minutes} minutes ${seconds} seconds`;

    if(interval <= 0) {
      clearInterval(interval);
      element.innerHTML = `CODE EXPIRED`;
    }
  }, 1000);
}