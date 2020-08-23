'use strict'

//VARIABLES GLOBALES

let userID; //sert a verifier si l'utilisateur est connecté, et permet de lister les pays dans le "carnet" correct
let userList; //stocke de manière globale les ID, pseudos et mots de passes des users

/* **Systeme de register** */



	//permet d'avoir une distinction entre une tentative de création de compte et d'une connexion a un compte
function changeLogin(){
	let sub = document.getElementById('userIDSubmit');
	if (sub.value == "Login"){
		sub.value = "Register";
	}else{
		sub.value = "Login";
	}
}

function userLogin(name, password){
	if (userExiste(name)){
		let uIndex;
		for (let i in userList){
			if(userList[i].username == name){
				uIndex = i;
			}
		}
		if(userList[uIndex].pswd == password){//test si le mot de passe est valide	
			//console.log("Connection!");
			getUserID(name);
			displayErreure('ok');
		}else{
			displayErreure("Mauvais mot de passe");
		}
	}else{
		displayErreure("Compte introuvable");
	}
}

function getUserID(name){
	let xhr = new XMLHttpRequest();
	let url = 'getUserID?username=' + name;
	xhr.open('get', url, true);
	xhr.onload = function(){
			userID = xhr.responseText; 
			//console.log("votre id est = " + xhr.responseText); 
			displayFormProd();
			//ICI SE TROUVE L AFFICHAGE CARNET
			};
	xhr.send();
}

	//dirige les infos vers la fonction adéquate
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


function userListRequest(){ //recuperation de la liste des IDS , psuedos et mot de passes
	let xhr = new XMLHttpRequest();
	xhr.open('get','listUsers',true);
	xhr.onload = function(){
		userList = JSON.parse(xhr.responseText); 
		//console.log(userList)
		};
	xhr.send();
}


function userExiste(name){//retourne faux si l'utilisateur n'existe pas, vrai sinon

	for(let i in userList){
		//console.log(userList[i].username);
		if(userList[i].username == name){
			return true;
		}
	}
	return false;
}


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


	//s'occupe de lancer les eventListeners et fonctions a lancer lors du chargerment
window.onload = function(){
	let loginChange = document.getElementById("loginRegister");
	let userSub = document.getElementById("userIDSubmit");
	
	loginChange.addEventListener('click', changeLogin);
	userSub.addEventListener('click', userSubHandler);
	
	userListRequest();
}

	
	//masque la selection des pays avant connexion, et le formulaire du login après connexion
function displayFormProd(){
	document.getElementById("main").style.display = "inline-block";
	document.getElementById("userID").style.display = "none";
}



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


	function recupererCarnet(){//va chercher le contenu d'un carnet associé a l'id de l'utilisateur connecté
	let xhr = new XMLHttpRequest();
	let url = 'recupererCarnet?userID=' + userID;

	xhr.open("get", url, true);
	xhr.onload = construireTableCarnet;
	xhr.send();
}


function construireTableCarnet(){//construire la table des pays et de leurs notes dans le carnet associé a l'ID de l'utilisateur, et l'affiche sur la page dynamiquement
	//console.log(this.responseText);
	carnetList = JSON.parse(this.responseText);
	let tableCarnet = "";
	//console.log(carnetList);
	for(let i in carnetList){
		tableCarnet += "<tr><td>" + carnetList[i].libPays + "</td><td>" + carnetList[i].notes + "</td><td>";
	}//construction du corps de la table

	document.getElementById('carnet').innerHTML = "<tr><thead><strong>Votre carnet :</strong></thead></tr><tr><th>Pays</th><th>Notes</th><th></th></tr>"
	document.getElementById('carnet').innerHTML += tableCarnet;
}

//recuperer la liste des pays sur le serveur
function getPays(){
	let xhr = new XMLHttpRequest(); // instancier XMLHttpRequest

	xhr.open('get', "getPays", true); // préparer
	xhr.onload = // callback : fonction anonyme
			function(){ paysList = JSON.parse(xhr.responseText);
			faireSelect();		 
	}
	xhr.send(); // envoyer
}

function trierListe(attribut) {//permet de trier une liste donnée en format JSON selon un certain attribut
    return function(a, b) {    //algorithme pour le sort qui se trouve dans le makeselect
        if (a[attribut] > b[attribut]) {    
            return 1;    
        } else if (a[attribut] < b[attribut]) {    
            return -1;
        }    
        return 0;    
    }    
}   

function faireSelect(){ // faire une liste déroulante alphabétiquement triée des produits
	let liste;
	paysList.sort(trierListe('libPays'));
	for(let i in paysList){
		liste += '<option value=' + paysList[i].idPays + '>' + paysList[i].libPays + '</option>';
	}

	document.getElementById("pays").innerHTML = liste;
}

function ajouterPays(x){
		let xhr = new XMLHttpRequest(); // instancier XMLHttpRequest
		let url = 'ajouterPays?userId=' + userID + '&idPays=' + document.getElementById("pays").value + '&notes='+ document.getElementById("note").value  ;
	xhr.open('get', url, true); 
	xhr.onload = // callback : fonction anonyme	
	xhr.send(); // envoyer
}
