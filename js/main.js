function disBtn(btn) {
    btn.disabled = true;
}

function enabBtn(EncBtn) {
    EncBtn.disabled = false;
}


function generate_key() {

var options = {
    numBits: 2048,
    userId: 'User Name <usr@someserver.com>',
    passphrase: '123qweasdhgv34ghv'
};

var privkey;
var pubkey;

     window.openpgp.generateKeyPair(options).then(function(keyPair) {
      
      console.log(keyPair.privateKeyArmored);
      privkey = keyPair.privateKeyArmored;
      pubkey = keyPair.publicKeyArmored;
      
      var pubKeyString = JSON.stringify(pubkey);  
      
      sessionStorage.setItem("pubKeyString", pubKeyString);

     });
				
document.getElementById("keyStat").className = "label label-primary";
document.getElementById("keyStat").innerHTML = "A key has been generated for you";

}

function encryptMsg() {

    var key = sessionStorage.getItem("pubKeyString");
    var publicKey = window.openpgp.key.readArmored(key);
    
    var raw_message = "This is a test. this is a normal sentence";
    
    window.openpgp.encryptMessage(publicKey.keys, raw_message).then(function(pgpMessage) {
        console.log(pgpMessage);
    });
   
}   

