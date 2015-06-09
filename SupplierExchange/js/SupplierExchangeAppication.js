var SupplierExchangeAppication = angular.module('SupplierExchangeAppication', []);
SupplierExchangeAppication.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'partials/dashboard.html',
		controller : 'DashboardController'
	}).when('/dashboard', {
		templateUrl : 'partials/dashboard.html',
		controller : 'DashboardController'
	}).when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginController'
	}).when('/createcapitalproject', {
		templateUrl : 'partials/capitalproject.html',
		controller : 'CreateCapitalProjectController'
	}).when('/editcapitalproject/:capitalProjectIndex', {
		templateUrl : 'partials/capitalproject.html',
		controller : 'EditCapitalProjectController'
	}).when('/manageCapitalProjectCoordinators/:capitalProjectIndex', {
		templateUrl : 'partials/capitalprojectcoordinators.html',
		controller : 'ManageCapitalProjectCoordinatorsController'
	}).when('/createsuppliercontract/:capitalProjectIndex', {
		templateUrl : 'partials/suppliercontract.html',
		controller : 'CreateSupplierContractController'
	}).when('/viewsuppliercontract/:capitalProjectIndex/:supplierContractIndex', {
		templateUrl : 'partials/viewsuppliercontract.html',
		controller : 'ViewSupplierContractController'
	}).when('/editsuppliercontract/:capitalProjectIndex/:supplierContractIndex', {
		templateUrl : 'partials/suppliercontract.html',
		controller : 'EditSupplierContractController'
	}).when('/createdeliverable/:capitalProjectIndex/:supplierContractIndex', {
		templateUrl : 'partials/deliverable.html',
		controller : 'CreateDeliverableController'
	}).when('/editdeliverable/:capitalProjectIndex/:supplierContractIndex/:deliverableIndex', {
		templateUrl : 'partials/deliverable.html',
		controller : 'EditDeliverableController'
	}).when('/createdeliverableitem/:capitalProjectIndex/:supplierContractIndex/:deliverableIndex', {
		templateUrl : 'partials/deliverableitem.html',
		controller : 'CreateDeliverableItemController'
	}).when('/editdeliverableitem/:capitalProjectIndex/:supplierContractIndex/:deliverableIndex/:deliverableItemIndex', {
		templateUrl : 'partials/deliverableitem.html',
		controller : 'EditDeliverableItemController'
	}).otherwise({
		redirectTo : '/'
	});
});

function User(email, status) {
	this.name = null;
	this.email = email;
	this.status = status || User.UNKNOWN;
}

User.INVITATION_PENDING = "INVITATION_PENDING";
User.APPROVAL_PENDING = "APPROVAL_PENDING";
User.ACTIVE = "ACTIVE";
User.INACTIVE = "INACTIVE";
User.UNKNOWN = "UNKNOWN";

function NamedNode(name) {
	this.id = NamedNode.nextID();
	this.name = name;
}

// static
NamedNode.nextID = (function() {
	var id = 0;

	function _genNextID() {
		return id++;
	}

	return _genNextID;
})();

// methods
NamedNode.prototype.getID = function() {
	return this.id;
};

NamedNode.prototype.getName = function() {
	return this.name;
};

function DescriptionNode(name, description) {
	NamedNode.apply(this, arguments);
	this.description = description;
}

DescriptionNode.prototype.getDescription = function() {
	return this.description;
};

function CapitalProject(name, description) {
	DescriptionNode.apply(this, arguments);
	this.supplierContracts = [];
	this.coordinators = [];
}

CapitalProject.prototype.addSupplierContract = function(supplierContract) {
	this.supplierContracts.push(supplierContract);
};

CapitalProject.prototype.getSupplierContracts = function() {
	return this.supplierContracts;
};

CapitalProject.prototype.addCoordinator = function(coordinator) {
	this.coordinators.push(coordinator);
};

function SupplierContract(name, description) {
	DescriptionNode.apply(this, arguments);
	this.deliverables = [];
}

SupplierContract.prototype.addDeliverable = function(deliverable) {
	this.deliverables.push(deliverable);
};

SupplierContract.prototype.getDeliverables = function() {
	return this.deliverables;
};

function Deliverable(name, description) {
	DescriptionNode.apply(this, arguments);
	this.deliverableItems = [];
}

Deliverable.prototype.addDeliverableItem = function(deliverableItem) {
	this.deliverableItems.push(deliverableItem);
};

Deliverable.prototype.getDeliverableItems = function() {
	return this.deliverableItems;
};

function DeliverableItem(name, description) {
	DescriptionNode.apply(this, arguments);
	this.documents = [];
}

SupplierExchangeAppication.controller('SupplierExchangeController', function($scope, $location) {
	$scope.logout = function() {
		delete $scope.application.loggedInUser;
		$location.path('/login');
	};

	$scope.application = {
		name : 'Supplier Exchange',
		capitalProjects : [],
	};

	var capitalProject = new CapitalProject("Long Island Power Plant Construction", "");
	$scope.application.capitalProjects.push(capitalProject);
	var supplierContract = new SupplierContract("Contract 123 - High Point Electricals Inc", "");
	capitalProject.supplierContracts.push(supplierContract);
	var deliverable = new Deliverable("Electircals", "");
	supplierContract.addDeliverable(deliverable);
	var deliverableItem = new DeliverableItem("FX-HR-12211-PR-2401-XYZ-0001", "Engineering specifications for cooling element 120-124.");
	deliverable.addDeliverableItem(deliverableItem);
});

SupplierExchangeAppication.controller('LoginController', function($scope, $routeParams, $location) {
	$scope.loginUser = new User("cayote@acme.com", "p");
	$scope.login = function() {
		$scope.application.loggedInUser = $scope.loginUser;
		$location.path('/');
	};
});

SupplierExchangeAppication.controller('DashboardController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProjectExpandedState = [];
	if ($scope.application.capitalProjects.length > 0) {
		$scope.capitalProjectExpandedState[0] = true;
	}
	$scope.toggleExpansionState = function(capitalProjectIndex) {
		$scope.capitalProjectExpandedState[capitalProjectIndex] = !$scope.capitalProjectExpandedState[capitalProjectIndex];
	};
	$scope.isExpanded = function(capitalProjectIndex) {
		return !!($scope.capitalProjectExpandedState[capitalProjectIndex]);
	};
	$scope.deleteCapitalProject = function(capitalProjectIndex) {
		$scope.application.capitalProjects.splice(capitalProjectIndex, 1);
	};
	$scope.deleteSupplierContract = function(capitalProjectIndex, supplierContractIndex) {
		$scope.application.capitalProjects[capitalProjectIndex].supplierContracts.splice(supplierContractIndex, 1);
	};
});

SupplierExchangeAppication.controller('CreateCapitalProjectController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProjectName = "";
	$scope.capitalProjectDescription = "";
	$scope.createCapitalProject = function() {
		$scope.application.capitalProjects.push(new CapitalProject($scope.capitalProjectName, $scope.capitalProjectDescription));
		$location.path('/');
	};
	$scope.cancel = function() {
		$location.path('/');
	};
});

SupplierExchangeAppication.controller('EditCapitalProjectController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}

	$scope.capitalProjectToEdit = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.capitalProjectName = $scope.capitalProjectToEdit.name;
	$scope.capitalProjectDescription = $scope.capitalProjectToEdit.description;
	$scope.createCapitalProject = function() {
		$scope.capitalProjectToEdit.name = $scope.capitalProjectName;
		$scope.capitalProjectToEdit.description = $scope.capitalProjectDescription;
		$location.path('/dashboard');
	};

	$scope.cancel = function() {
		$location.path('/dashboard');
	};
});

SupplierExchangeAppication.controller('ManageCapitalProjectCoordinatorsController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.email = "roadrunner@acme.com";
	$scope.addCapitalProjectCoordinator = function() {
		$scope.capitalProject.coordinators.push(new User($scope.email, User.INVITATION_PENDING));
	};
	$scope.deleteCapitalProjectCoordinator = function(capitalProjectCoordinatorIndex) {
		$scope.capitalProject.coordinators.splice(capitalProjectCoordinatorIndex, 1);
	};
	$scope.isInvitatonPending = function(status) {
		return (status === User.INVITATION_PENDING);
	};
});

SupplierExchangeAppication.controller('CreateSupplierContractController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContractName = "";
	$scope.supplierContractDescription = "";
	$scope.createSupplierContract = function() {
		$scope.capitalProject.addSupplierContract(new SupplierContract($scope.supplierContractName, $scope.supplierContractDescription));
		$location.path('/dashboard');
	};
	$scope.cancel = function() {
		$location.path('/dashboard');
	};
});

SupplierExchangeAppication.controller('EditSupplierContractController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContractToEdit = $scope.capitalProject.supplierContracts[$routeParams.supplierContractIndex];
	$scope.supplierContractName = $scope.supplierContractToEdit.name;
	$scope.supplierContractDescription = $scope.supplierContractToEdit.description;
	$scope.createSupplierContract = function() {
		$scope.supplierContractToEdit.name = $scope.supplierContractName;
		$scope.supplierContractToEdit.description = $scope.supplierContractDescription;
		$location.path('/');
	};

	$scope.cancel = function() {
		$location.path('/');
	};
});

SupplierExchangeAppication.controller('ViewSupplierContractController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProjectIndex = $routeParams.capitalProjectIndex;
	$scope.supplierContractIndex = $routeParams.supplierContractIndex;
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContract = $scope.capitalProject.supplierContracts[$routeParams.supplierContractIndex];

	$scope.deliverableExpandedState = [];
	if ($scope.supplierContract.deliverables.length > 0) {
		$scope.deliverableExpandedState[0] = true;
	}
	$scope.toggleExpansionState = function(deliverableIndex) {
		$scope.deliverableExpandedState[deliverableIndex] = !$scope.deliverableExpandedState[deliverableIndex];
	};
	$scope.isExpanded = function(deliverableIndex) {
		return !!($scope.deliverableExpandedState[deliverableIndex]);
	};
	
	$scope.deleteDeliverable = function(deliverableIndex) {
		$scope.supplierContract.deliverables.splice(deliverableIndex, 1);
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
	$scope.deleteDeliverableItem = function(deliverableIndex, deliverableItemIndex) {
		$scope.supplierContract.deliverables[deliverableIndex].deliverableItems.splice(deliverableItemIndex, 1);
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
});

SupplierExchangeAppication.controller('CreateDeliverableController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContract = $scope.capitalProject.supplierContracts[$routeParams.supplierContractIndex];
	$scope.deliverableName = "";
	$scope.deliverableDescription = "";
	$scope.createDeliverable = function() {
		$scope.supplierContract.addDeliverable(new Deliverable($scope.deliverableName, $scope.deliverableDescription));
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
	$scope.cancel = function() {
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
});

SupplierExchangeAppication.controller('EditDeliverableController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContract = $scope.capitalProject.supplierContracts[$routeParams.supplierContractIndex];
	$scope.deliverableToEdit = $scope.supplierContract.deliverables[$routeParams.deliverableIndex];
	$scope.deliverableName = $scope.deliverableToEdit.name;
	$scope.deliverableDescription = $scope.deliverableToEdit.description;
	$scope.createDeliverable = function() {
		$scope.deliverableToEdit.name = $scope.deliverableName;
		$scope.deliverableToEdit.description = $scope.deliverableDescription;
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};

	$scope.cancel = function() {
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
});

SupplierExchangeAppication.controller('CreateDeliverableItemController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContract = $scope.capitalProject.supplierContracts[$routeParams.supplierContractIndex];
	$scope.deliverable = $scope.supplierContract.deliverables[$routeParams.deliverableIndex];
	$scope.deliverableItemName = "";
	$scope.deliverableItemDescription = "";
	$scope.createDeliverableItem = function() {
		$scope.deliverable.addDeliverableItem(new DeliverableItem($scope.deliverableItemName, $scope.deliverableItemDescription));
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
	$scope.cancel = function() {
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
});

SupplierExchangeAppication.controller('EditDeliverableItemController', function($scope, $routeParams, $location) {
	if (!$scope.application.loggedInUser) {
		$location.path('/login');
		return;
	}
	$scope.capitalProject = $scope.application.capitalProjects[$routeParams.capitalProjectIndex];
	$scope.supplierContract = $scope.capitalProject.supplierContracts[$routeParams.supplierContractIndex];
	$scope.deliverable = $scope.supplierContract.deliverables[$routeParams.deliverableIndex];
	$scope.deliverableItemToEdit = $scope.deliverable.deliverableItems[$routeParams.deliverableItemIndex];
	$scope.deliverableItemName = $scope.deliverableItemToEdit.name;
	$scope.deliverableItemDescription = $scope.deliverableItemToEdit.description;
	$scope.createDeliverableItem = function() {
		$scope.deliverableItemToEdit.name = $scope.deliverableItemName;
		$scope.deliverableItemToEdit.description = $scope.deliverableItemDescription;
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};

	$scope.cancel = function() {
		$location.path('/viewsuppliercontract/' + $routeParams.capitalProjectIndex + '/' + $routeParams.supplierContractIndex);
	};
});

