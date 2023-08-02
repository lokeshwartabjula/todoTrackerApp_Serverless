// import api from "./api";

// export const loginUser = (email, password) => {
//   return api.post("/TodoApiLogin", { email, password });
// };

// export const signupUser = (email, password) => {
//   return api.post("/TodoApiSignUp", { email, password });
// };

// export const forgotPassword = (email) => {
//   return api.post("user/forgot-password", { email });
// };

// export const resetPassword = (email, resetToken, newPassword) => {
//   return api.post("user/reset-password", { email, resetToken, newPassword });
// };


import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import api from "./api";

const poolData = {
  UserPoolId: 'us-east-1_Q5G8fva0n', // Your User Pool ID
  ClientId: '68fc2pe9j23okkeba8in13t37b', // Your Client ID
};

const userPool = new CognitoUserPool(poolData);

export const loginUser = (email, password) => {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        resolve(result);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
};

export const signupUser = (email, password) => {
  const attributeList = [];

  const dataEmail = {
    Name: 'email',
    Value: email,
  };

  const attributeEmail = new CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const forgotPassword = (email) => {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        resolve(result);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
};

export const resetPassword = (email, verificationCode, newPassword) => {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess() {
        resolve();
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
};
