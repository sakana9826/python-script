const baseUrl = pm.request.getBaseUrl();

let username = "18888888888";
let password = "xxxxxxxxxxxxxx";
let appid = "xxxxxxxxxx";
let publicKey = "";
let publicKeyPassword = "";

function getPublicKey() {
  return new Promise((resolve, reject) => {
    const passwordPubKey = {
      url: baseUrl + "/passwordPubKey",
      method: "GET",
      header: {
        "appid": appid,
      },
    };
    pm.sendRequest(passwordPubKey, function(err, res) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const jsonData = res.json();
        publicKey = "-----BEGIN PUBLIC KEY-----\n" + jsonData.payload + "\n-----END PUBLIC KEY-----";
        resolve(publicKey);
      }
    });
  });
}

function getPubbkeyPassword() {
  const loginRequest = {
    url: "https://www.bejson.com/Bejson/Api/Rsa/pubEncrypt",
    method: "POST",
    body: {
      mode: "urlencoded",
      urlencoded: [
        { key: "publicKey", value: publicKey },
        { key: "encStr", value: password },
        { key: "etype", value: "rsa2" },
      ],
    },
  };

  return new Promise((resolve, reject) => {
    pm.sendRequest(loginRequest, function(err, res) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const jsonData = res.json();
        publicKeyPassword = jsonData.data;
        resolve(publicKeyPassword);
      }
    });
  });
}

function sendLoginRequest() {
  const loginRequest = {
    url: baseUrl + "/login",
    method: "POST",
    header: {
      "appid": appid,
      "Content-Type": "application/json",
    },
    body: {
      mode: "raw",
      raw: JSON.stringify({
        password: publicKeyPassword,
        username: username,
      }),
    },
  };
  pm.sendRequest(loginRequest, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      const jsonData = res.json();
      pm.environment.set("ACCESS_TOKEN", jsonData.payload.accessToken);

      const currentDate = new Date();
      const secondsToAdd = jsonData.payload.expiresIn;
      const millisecondsToAdd = secondsToAdd * 1000;
      const newDate = new Date(currentDate.getTime() + millisecondsToAdd);
      pm.environment.set("ACCESS_TOKEN_EXPIRES", newDate);
    }
  });
}

const accessTokenExpires = pm.environment.get("ACCESS_TOKEN_EXPIRES");

if (!accessTokenExpires || new Date(accessTokenExpires) <= new Date()) {
  getPublicKey()
    .then(getPubbkeyPassword)
    .then(sendLoginRequest)
    .catch((error) => {
      console.error("操作失败", error);
    });
}
