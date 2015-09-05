function disBtn(btn) {
    btn.disabled = true;
}

function enabBtn(EncBtn) {
    EncBtn.disabled = false;
}

function cut(str, cutStart, cutEnd){
  return str.substr(0,cutStart) + str.substr(cutEnd+1);
}

function clearMsg() {
    document.getElementById("usrInput").value = "";
}

function generate_key() {

var options = {
    numBits: 2048,
    userId: 'User Name <usr@someserver.com>',
    passphrase: '123qweasdhgv34ghv'
};

     sessionStorage.setItem("passphrase", options.passphrase);

     window.openpgp.generateKeyPair(options).then(function(keyPair) {
         
      // window.prompt("Your public key:", keyPair.publicKeyArmored);
      console.log(keyPair.publicKeyArmored);
      
      sessionStorage.setItem("pubKeyString", keyPair.publicKeyArmored);
      sessionStorage.setItem("privKeyString", keyPair.privateKeyArmored);
     });
				
document.getElementById("keyStat").className = "label label-primary";
document.getElementById("keyStat").innerHTML = "A key has been generated for you";

}

function encryptMsg() {

    var publicKey = window.openpgp.key.readArmored(sessionStorage.getItem("pubKeyString"));
    
    var raw_message = document.getElementById("usrInput").value;
    
    window.openpgp.encryptMessage(publicKey.keys, raw_message).then(function(pgpMessage) {
        
        sessionStorage.setItem("message", pgpMessage);
        
        pgpMessage = pgpMessage.replace("-----END PGP MESSAGE-----", " ");
        
        document.getElementById("usrInput").value = cut(pgpMessage, 0, 88);
    });
}   

function decryptMsg() {
    
    var privateKey = window.openpgp.key.readArmored(sessionStorage.getItem("privKeyString")).keys[0];
    var passphrase = sessionStorage.getItem("passphrase");
    
    privateKey.decrypt(passphrase);
    
    var pgpMessage = sessionStorage.getItem("message");
    pgpMessage = window.openpgp.message.readArmored(pgpMessage);
    
    window.openpgp.decryptMessage(privateKey, pgpMessage).then(function(plaintext) {
    document.getElementById("usrInput").value = plaintext;
    });
}
