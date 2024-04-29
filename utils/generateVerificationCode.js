function generateVerificationCode() {
    let randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
    let randomNumberString = randomNumber.toString();
    while (randomNumberString.charAt(0) === '0') {
        randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
        randomNumberString = randomNumber.toString();
    }
    return randomNumber;
}

module.exports = generateVerificationCode;