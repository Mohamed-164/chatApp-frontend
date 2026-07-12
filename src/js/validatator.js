

export function validateName(name){

    return  name.length >= 3 && /^[A-Za-z ]+$/.test(name);
}

export function validateMail(mail) {
    return mail.length > 0 && /^[a-zA-Z0-9]+@gmail\.com$/.test(mail);
}

export function validatePhone(phone) {
    return phone.length > 0 && /^[6-9]\d{9}$/.test(phone);
}

export function validatePassword(pass) {
    let hasUpper = /[A-Z]/.test(pass);
    let hasLower = /[a-z]/.test(pass);
    let hasNumber = /[0-9]/.test(pass);
    let hasSymbol = /[^A-Za-z0-9]/.test(pass);

    return pass.length >= 8 && hasUpper && hasLower && hasNumber && hasSymbol;
}

export function checkExistsContact(id, arr) {

    const friend = arr.find(
        element => element.number === id
    );

    return {
        ExistsFriend: friend !== undefined,
        friendData: friend
    };
}

export function getContact(id,arr){
    const friend = arr.find(
        element => element.number == id
    );
    return friend;
}

export function checkUserBlocked(id,arr){
    
    const friend = arr.find(
        element => element.number === id
    );

    return friend !== undefined

}