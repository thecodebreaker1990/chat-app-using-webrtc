import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  const localConnection = new RTCPeerConnection();
  const remoteConnection = new RTCPeerConnection();

  const btnConnect = document.getElementById("initiate_connection_btn");
  btnConnect.addEventListener("click", handleEstablishConnection);

  function handleEstablishConnection() {
    const dc = localConnection.createDataChannel("channel");
    dc.onmessage = (e) => console.log("Just got a message " + e.data);
    dc.onopen = (e) => console.log("Connection opened!!");

    localConnection.onicecandidate = () =>
      sendOfferToRemote(localConnection.localDescription);

    localConnection
      .createOffer()
      .then((o) => localConnection.setLocalDescription(o))
      .then((a) => console.log("Set successfully!"));
  }

  function sendOfferToRemote(sessionDescription) {
    console.log(
      "New Ice Candidate! reprinting SDP" + JSON.stringify(sessionDescription)
    );
    const offer = sessionDescription;
  }
});
