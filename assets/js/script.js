"use strict";
//MVC
let teideController;
let gMenuView;
let waiterView;
let orderWaiterView;
let receivedOrderWaiterView;
let chiefView;

window.onload = function() {
	teideController = new TeideController();
	gMenuView = new GlobalMenuView();
	waiterView = new WaiterView();
	orderWaiterView = new OrderWaiterView();
	receivedOrderWaiterView = new ReceivedOrdersWaiterView();
	chiefView = new ChiefView();
		
	teideController.getToken()
		.then(result => {
			teideController.accessToken = result.access_token;
			teideController.instanceUrl = 'https://sfpxy.herokuapp.com';
			teideController.tokenType = result.token_type;
			teideController.createModel('menuModel', new MenuModel());	
			teideController.createModel('waiterModel', new WaiterModel());
			teideController.createModel('chiefModel', new ChiefModel());
			teideController.menuModel.init(gMenuView);
			teideController.waiterModel.init(waiterView, orderWaiterView, receivedOrderWaiterView);
			teideController.chiefModel.init(chiefView);
			gMenuView.init(teideController.menuModel);
			waiterView.init(teideController.waiterModel);
			orderWaiterView.init(teideController.waiterModel);
			receivedOrderWaiterView.init(teideController.waiterModel);
			chiefView.init(teideController.chiefModel);
			switchToStateFromURLHash();
		})
		.catch(error => console.error(error));
}


// Переключение страниц		  
window.onhashchange=switchToStateFromURLHash;
let SPAState={};

function switchToStateFromURLHash() {
	let URLHash=window.location.hash;
	let stateStr=URLHash.substr(1);
	if ( stateStr!="" ) { 
		let parts=stateStr.split("_")
		SPAState={ pagename: parts[0] }; // первая часть закладки - номер страницы
	}
	else
	  SPAState={pagename:'Main'}; // иначе показываем главную страницу 

	$('section').hide();
	$('header').show('drop', {direction: 'up'}, 500);
	switch ( SPAState.pagename ) {
		case 'Main':
			$('#slider').show('drop', null, 500);
			break;
		case 'Menu':
			teideController.menuModel.receiveCategories().then(function() {
				$('#menuCategories').show('drop', null, 500)
			});
			break;
		case 'Starter':
			teideController.menuModel.receiveCategories().then(function() {
				$('#categoryMeals').show();
				$('#Starter').show('drop', null, 500);
			});
			break;
		case 'Soup':
			teideController.menuModel.receiveCategories().then(function() {
					$('#categoryMeals').show();
					$('#Soup').show('drop', null, 500);
			});
			break;
		case 'Fish':
			teideController.menuModel.receiveCategories().then(function() {
				$('#categoryMeals').show();
				$('#Fish').show('drop', null, 500);
			});
			break;
		case 'Meat':
			teideController.menuModel.receiveCategories().then(function() {
				$('#categoryMeals').show();
				$('#Meat').show('drop', null, 500);
			});
			break;
		case 'Sidedish':
			teideController.menuModel.receiveCategories().then(function() {
				$('#categoryMeals').show();
				$('#Sidedish').show('drop', null, 500);
			});
			break;
		case 'Dessert':
			teideController.menuModel.receiveCategories().then(function() {
				$('#categoryMeals').show();
				$('#Dessert').show('drop', null, 500);
			});
			break;
		case 'TableReservation':
			teideController.menuModel.receiveCategories().then(function() {
				$('#booking').show('drop', null, 500);
				$('#name').focus();
			});
			break;
		case 'Contacts':
			$('#contacts').show('drop', null, 500);
			break;
		case 'Signin':
			$('#signin').show('drop', null, 500);
			break;
		case 'Signup':
			$('#signup').show('drop', null, 500);
			$('#welldone').addClass('d-none');
			$('.form-signup').removeClass('d-none');
			break;
		case 'Chief':
			if (teideController.user && teideController.user.Role__c === 'Chief') {
				teideController.chiefModel.recieveOrders().then(function() {
					$('#containerChief').show('drop', null, 500);
					teideController.chiefModel.updateViews();
					setInterval(teideController.refreshDataChief.bind(teideController), 1000 * 10);
				});
			} else {
				window.location.hash = 'Main';
			}
			break;
		case 'Waiter':
			if (teideController.user && teideController.user.Role__c === 'Waiter') {
				teideController.waiterModel.recieveOrders().then(function() {
					$('#containerOrderWaiter').show('drop', null, 500);
					teideController.waiterModel.updateViews();
					setInterval(teideController.refreshDataWaiter.bind(teideController), 1000 * 10);
				});
			} else {
				window.location.hash = 'Main';
			}
			break;
		case 'NewOrder':
			if (teideController.user && teideController.user.Role__c === 'Waiter') {
				teideController.waiterModel.receiveCategories().then(function() {
					$('#newOrder').show('drop', null, 500);
					teideController.waiterModel.updateViews();
				});
			} else {
				window.location.hash = 'Main';
			}
			break;
/* 		case 'Schedule':
			$('#schedule').show('drop', null, 500);
			break;
		case 'Table':
			$('#accordionAdministrator').show('drop', null, 500);
			break; */
	}
	$('footer').show('drop', {direction: 'down'}, 500);
	if (SPAState.pagename === 'Signup') {
		addListeners();
	}
}

function switchToState(newState) {
var stateStr=newState.pagename;
location.hash=stateStr;
}

//datepicker
$('#datepicker').datepicker({
  showAnim: "slideDown",
  minDate: 0
});

//timepicker 
$('#time').datetimepicker({
	datepicker:false,
	format:'H:i',
	defaultTime:'19:00',
	allowTimes:[
		'10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
		'16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
		'22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00'
	]
});

//свернуть toggle в navbar
$('.navbar-nav li a').on('click', function(){
	$('.navbar-collapse').addClass('d-none');
    $('.navbar-collapse').collapse('hide');
	$('.navbar-collapse').removeClass('d-none');
});

//handlebars helper - if (a ===  b)
Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});




