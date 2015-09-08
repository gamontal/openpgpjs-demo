
// GENERATE NEW KEY PAIR //
function generate_key() {

var options = {     // used random data for demo purposes
    numBits: 2048, 
    userId: 'User Name <usr@someserver.com>', 
    passphrase: '123qweasdhgv34ghv'
};

     sessionStorage.setItem("passphrase", options.passphrase); // temporary local storage for passphrase  

     window.openpgp.generateKeyPair(options).then(function(keyPair) { // openpgp key gen function
         
      // window.prompt("Your public key:", keyPair.publicKeyArmored);
      console.log(keyPair.publicKeyArmored); // displays public key block in console
      
      // temporarily stores user's public and private key 
      sessionStorage.setItem("pubKeyString", keyPair.publicKeyArmored);
      sessionStorage.setItem("privKeyString", keyPair.privateKeyArmored);
     });
     
// status change			
document.getElementById("keyStat").className = "label label-primary";
document.getElementById("keyStat").innerHTML = "A key has been generated for you";

}

// ENCRYPTION METHOD //
function encryptMsg() {
    // public key instance
    var publicKey = window.openpgp.key.readArmored(sessionStorage.getItem("pubKeyString"));
    
    // stores textarea value
    var raw_message = document.getElementById("txtbox").value;
    
    window.openpgp.encryptMessage(publicKey.keys, raw_message).then(function(pgpMessage) {
        
        sessionStorage.setItem("message", pgpMessage);  
        
        pgpMessage = pgpMessage.replace("-----END PGP MESSAGE-----", " ");
        
        document.getElementById("txtbox").value = cut(pgpMessage, 0, 88); // display encrypted message
        
        // status change			
        document.getElementById("keyStat").className = "label label-default";
        document.getElementById("keyStat").innerHTML = "Encrypted";
        
    });
}   

// DECRYPTION METHOD //
function decryptMsg() {
    // private key instance
    var privateKey = window.openpgp.key.readArmored(sessionStorage.getItem("privKeyString")).keys[0];
    var passphrase = sessionStorage.getItem("passphrase");
    
    privateKey.decrypt(passphrase);
    
    var pgpMessage = sessionStorage.getItem("message");
    pgpMessage = window.openpgp.message.readArmored(pgpMessage);
    
    window.openpgp.decryptMessage(privateKey, pgpMessage).then(function(plaintext) {
    document.getElementById("txtbox").value = plaintext; // display plain text data
    });
    
    // status change			
    document.getElementById("keyStat").className = "label label-default";
    document.getElementById("keyStat").innerHTML = "Decrypted";
    
}

function disBtn(btn) {
    btn.disabled = true; // disable button method
}

function enabBtn(EncBtn) {
    EncBtn.disabled = false; // enable button method
}

function cut(str, cutStart, cutEnd){ // custom function to cut strings
  return str.substr(0,cutStart) + str.substr(cutEnd+1);
}

function clearMsg() { // clears textarea value
    document.getElementById("txtbox").value = "";
}

function disBox() {
    document.getElementById("txtbox").disabled = true; 
}

function enbBox() {
    document.getElementById("txtbox").disabled = false; 
}
