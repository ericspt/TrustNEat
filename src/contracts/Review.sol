//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

contract Review {

	string public contractName = "Review SC";
	address public owner; 

    Restaurant[] public restaurants;

    struct ReviewStruct {
        string name;
        string text;
        string imageLink;
        string rating;
    }

    struct Restaurant {
        string name;
        string description;
        string imageLink;
        string rating;
        ReviewStruct[] reviews;
    }

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

	constructor() {
		owner = msg.sender;
	}

    function addRestaurant(string memory _name, string memory _description,
    address payable restaurant, uint256 addingRestaurantValue) public returns (bool success) {
        require(restaurant.balance >= addingRestaurantValue, "You cannot add a new restaurant because there are not enough funds!");
        Restaurant memory restaurantToBeAdded;
        restaurantToBeAdded.name = _name;
        restaurantToBeAdded.description = _description;
        restaurants.push(restaurantToBeAdded);
        return true;
    }

    function addReview(uint _restaurantId, string memory _name, string memory _description, string memory _rating, 
    address payable _to, uint256 reviewValue) public payable returns (bool success) {
        (bool successSend, ) = _to.call{value: reviewValue}("");
        require(successSend, "You cannot post a review because there are not enough funds!");
        emit Transfer(owner, _to, reviewValue);
        restaurants[_restaurantId].reviews.push(ReviewStruct(_name, _description, "", _rating));
        return true;
    }

}
