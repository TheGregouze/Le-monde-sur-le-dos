'use strict'

//VARIABLES GLOBALES

let userID; //sert a verifier si l'utilisateur est connecté, et permet de lister les pays dans le "carnet" correct.
let userList; //stocke de manière globale les ID, pseudos et mots de passes des users.
let carnetList;//liste des pays et leurs notes dans le carnet.
let paysList; //liste des pays.
let tableDrapeau = [];

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//PARTIE LOGIN ET REGISTER.																																							//
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

	//permet d'avoir une distinction entre une tentative de création de compte et une connexion a un compte.
function changeLogin(){
	let sub = document.getElementById('userIDSubmit');
	if (sub.value == "Login"){
		sub.value = "Register";
	}else{
		sub.value = "Login";
	}
}

	//gestion du login
function userLogin(name, password){
	if (userExiste(name)){
		let uIndex;
		for (let i in userList){
			if(userList[i].username == name){
				uIndex = i;
			}
		}
		if(userList[uIndex].pswd == password){//test si le mot de passe est valide
			getUserID(name);
			displayErreure('ok');
		}else{
			displayErreure("Mauvais mot de passe");
		}
	}else{
		displayErreure("Compte introuvable");
	}
}

	//fait appel a la procedure du meme nom et sert a charger le carnet lié au bon userId.
function getUserID(name){
	let xhr = new XMLHttpRequest();
	let url = 'getUserID?username=' + name;
	xhr.open('get', url, true);
	xhr.onload = function(){
			userID = xhr.responseText; 
			//console.log("votre id est = " + xhr.responseText); 
			displayFormProd();
			recupererCarnet();
			};
	xhr.send();
}

	//dirige les infos vers la fonction adéquate;
function userSubHandler(){
	let form = document.getElementById("userID");
	if(form.username.value && form.pswd.value){//si les deux champs ne sont pas remplis, rien ne se passe du coté JS, la page affiche que les champs sont requis
		userListRequest()	
		if (form.sub.value == "Login"){
			//console.log("test login");
			userLogin(form.username.value, form.pswd.value);
		}else if(form.sub.value == "Register"){
			//console.log("test Register");
			userRegister(form.username.value, form.pswd.value);
		}	
	}
}

	//recuperation de la liste des IDS , pseudos et mots de passe.
function userListRequest(){
	let xhr = new XMLHttpRequest();
	xhr.open('get','listUsers',true);
	xhr.onload = function(){
		userList = JSON.parse(xhr.responseText); 
		//console.log(userList)
		};
	xhr.send();
}

	//retourne faux si l'utilisateur n'existe pas, vrai sinon.
function userExiste(name){
	for(let i in userList){
		//console.log(userList[i].username);
		if(userList[i].username == name){
			return true;
		}
	}
	return false;
}

	//gestion du register.
function userRegister(name, password){
	if (!userExiste(name)){//si le nom est libre
		let xhr = new XMLHttpRequest();
		let url = 'register?username=' + name + '&password=' + password;

		xhr.open('get', url, true);
		xhr.onload = function(){
			userID = xhr.responseText;
			displayFormProd();
			userListRequest();
		}
		xhr.send();
		displayErreure('ok');
	}else{
		displayErreure('Pseudo non disponible');
	}	
}

	//s'occupe de lancer les eventListeners et fonctions a lancer lors du chargerment.
window.onload = function(){
	let loginChange = document.getElementById("loginRegister");
	let userSub = document.getElementById("userIDSubmit");
	
	loginChange.addEventListener('click', changeLogin);
	userSub.addEventListener('click', userSubHandler);
	
	userListRequest();
	getPays();
}

	//masque la selection des pays avant connexion, et le formulaire du login après connexion.
function displayFormProd(){
	document.getElementById("main").style.display = "inline-block";
	document.getElementById("formPays").style.display = "inline-block";
	document.getElementById("userID").style.display = "none";
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//MESSAGE ERREUR.																																									//
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

	//permet l'affichage des messages d'erreures ainsi que le effacement
function displayErreure(erreure){
	let erreureDiv = document.getElementById('erreure');
	if (erreure == 'ok'){
		erreureDiv.style.display = 'none';
	}else{
		erreureDiv.style.display = 'inline-block';
		erreureDiv.innerHTML = "Erreure : " + erreure;
	}
}
	
	
	
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//GESTION DU CARNET.
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
	
	//va chercher le contenu d'un carnet associé a l'id de l'utilisateur connecté
function recupererCarnet(){
	let xhr = new XMLHttpRequest();
	let url = 'recupererCarnet?userID=' + userID;
	
	xhr.open("get", url, true);
	xhr.onload = construireTableCarnet;
	xhr.send();
}

	//construit la table des pays et de leurs notes dans le carnet associé a l'ID de l'utilisateur, et l'affiche sur la page dynamiquement.
function construireTableCarnet(){
	//console.log(this.responseText);
	carnetList = JSON.parse(this.responseText);
	let tableCarnet = "";
	for(let i in carnetList){
		tableCarnet += "<tr><td>" + carnetList[i].libPays + "</td><td>" + carnetList[i].notes + "</td><td>";
	}//construction du corps de la table
	document.getElementById('carnet').innerHTML = "<tr><thead><strong>Votre carnet :</strong></thead></tr><tr><th>Pays</th><th>Notes</th></tr>"
	document.getElementById('carnet').innerHTML += tableCarnet;
	
	
	//Construction de la table comprenant les drapeaux.
	document.getElementById('flag').innerHTML = "";
	tableDrapeau=['<tr>'];
	for(let i in carnetList){
		if(tableDrapeau.length  %6 == 0){
			tableDrapeau.push('</tr><tr>');
			tableDrapeau.push('<td><img src=IMG/flags/' + carnetList[i].drapeaux + ".jpg></td>")
		}
		else{
			tableDrapeau.push('<td><img src=IMG/flags/' + carnetList[i].drapeaux + '.jpg></td>');
		}
	}
	let affichageDrapeau="";
	for(let i=0; i<tableDrapeau.length; i++){
			affichageDrapeau+=tableDrapeau[i];
	}
	
	document.getElementById('flag').innerHTML = affichageDrapeau+'</tr>';
}


	//recupere la liste des pays sur le serveur pour en faire un select.
function getPays(){
	let xhr = new XMLHttpRequest(); // instancier XMLHttpRequest

	xhr.open('get', "getPays", true); // préparer
	xhr.onload = // callback : fonction anonyme
			function(){ paysList = JSON.parse(xhr.responseText);
			faireSelect();		 
	}
	xhr.send(); // envoyer
}

	//permet de trier une liste donnée en format JSON selon un certain attribut.
function trierListe(attribut) {
    return function(a, b) {//algorithme pour le sort qui se trouve dans le makeselect
        if (a[attribut] > b[attribut]) {    
            return 1;    
        } else if (a[attribut] < b[attribut]) {    
            return -1;
        }    
        return 0;    
    }    
}   

	// faire une liste déroulante alphabétiquement triée des produits.
function faireSelect(){
	let liste;
	paysList.sort(trierListe('libPays'));
	for(let i in paysList){
		liste += '<option value=' + paysList[i].idPays + '>' + paysList[i].libPays + '</option>';
	}

	document.getElementById("pays").innerHTML = liste;
}

	//Ajoute un pays dans le carnet associé au compte connecté.
function ajouterPays(x){
		let xhr = new XMLHttpRequest(); // instancier XMLHttpRequest
		let url = 'ajouterPays?userId=' + userID + '&idPays=' + document.getElementById("pays").value + '&notes='+ document.getElementById("note").value  ;
	xhr.open('get', url, true); 
	xhr.onload = function(){
		recupererCarnet();
		}
	xhr.send(); // envoyer
}

	//efface le carnet.
function resetCarnet(){
	//document.getElementById('carnet').innerHTML = "<tr><thead><strong>Votre carnet :</strong></thead></tr><tr><th>Pays</th><th>Notes</th></tr>"
	let url = 'resetCarnet?userID=' + userID;//efface le carnet.
	let xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.onload = function(){
		recupererCarnet();//rafraichir la table carnet
	}
	xhr.send();
	paysList = [];//vide le carnet coté client
	displayErreure('ok');
}
