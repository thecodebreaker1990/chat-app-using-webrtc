import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  const localConnection = new RTCPeerConnection();
  const remoteConnection = new RTCPeerConnection();

  const btnConnect = document.getElementById("initiate_connection_btn");
  btnConnect.addEventListener("click", handleEstablishConnection);

  async function handleEstablishConnection() {
    const dc = localConnection.createDataChannel("channel");

    dc.onmessage = (e) => logger("Client", "Just got a message " + e.data);
    dc.onopen = (e) => logger("Client", "Connection Opened!!");

    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    logger("Client", "Session Description Set successfully!");
    const SDP = await waitToCompleteIceGathering(localConnection);
    sendOfferToRemote(SDP);
  }

  async function sendOfferToRemote(clientSDP) {
    const msg = "New Ice Candidate! reprinting SDP" + JSON.stringify(clientSDP);
    logger("Client", msg);

    const offer = clientSDP;

    remoteConnection.ondatachannel = (e) => {
      remoteConnection.dc = e.channel;
      remoteConnection.dc.onmessage = (e) =>
        logger("Remote", "New message from client! " + e.data);
      remoteConnection.dc.onopen = (e) =>
        logger("Remote", "Connection Opened!!");
    };

    await remoteConnection.setRemoteDescription(offer);
    logger("Remote", "Offer Set successfully!");

    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);
    logger("Remote", "Answer created");
    const remoteSDP = await waitToCompleteIceGathering(remoteConnection);
    sendAnswerToClient(remoteSDP);
  }

  function sendAnswerToClient(remoteSDP) {
    const answer = remoteSDP;
    localConnection.setRemoteDescription(answer);
  }

  function waitToCompleteIceGathering(pc) {
    return new Promise((resolve) => {
      pc.addEventListener(
        "icegatheringstatechange",
        (e) =>
          e.target.iceGatheringState === "complete" &&
          resolve(pc.localDescription)
      );
    });
  }

  function logger(connectionType, message) {
    console.log(`[${connectionType}] ${message}`);
  }
});
