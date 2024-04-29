function generatePaymentCardId() {
    const generateRandomNumber = () => Math.floor(Math.random() * 9000) + 1000;

    return (
        generateRandomNumber() + '-' +
        generateRandomNumber() + '-' +
        generateRandomNumber() + '-' +
        generateRandomNumber()
    );
}

module.exports = generatePaymentCardId;