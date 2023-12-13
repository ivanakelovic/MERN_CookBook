const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {authService, userService, tokenService, emailService} = require('../services');
const {fileService} = require('../services');
const {uploadFile} = require("./file.controller");
const {loginUserWithEmailAndPassword} = require("../services/auth.service");
const {generateAuthTokens} = require("../services/token.service");

const register = catchAsync(async (req, res) => {
    // console.log('auth.controller');
    // const saveFile = await uploadFile(req, res);
    //console.log('uploaded file: ',saveFile);
    // const files = await fileService.queryFiles({}, {limit: 9999999});
    // console.log('files: ',files);
    // const lastUploadedFile = files.results[files.results.length - 1];

    const userData = {
        ...req.body,
        //  documents: lastUploadedFile.id
    }
    console.log('userdata', userData);

    const user = await userService.createUser(userData);
    console.log('user :', user);
    console.log('req.body', req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({user, tokens});
});

const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;
   // console.log('auth controller');
   // console.log(email);
   // console.log(password);
    //console.log('login funct in controller',await loginUserWithEmailAndPassword(email,password));
    const user = await authService.loginUserWithEmailAndPassword(email, password);

   // console.log('user in controller:',user);
    const tokens = await tokenService.generateAuthTokens(user);
    //console.log('auth controller');
    //console.log('user, tokens',user,tokens);
    res.send({user, tokens});
});

const logout = catchAsync(async (req, res) => {
    console.log('auth controller');
    console.log('req.body',req.body);
    await authService.logout(req.body.refreshToken);

    console.log( await authService.logout(req.body.refreshToken))

    console.log('logout: refreshtoken',req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({...tokens});
});

const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
    const service = await authService.verifyEmail(req.body.token);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};
