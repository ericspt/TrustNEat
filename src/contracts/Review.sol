//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

contract Review {

	string public contractName = "Review SC";
	address public owner; 

    Restaurant[] restaurants;

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

	constructor() {
		owner = msg.sender;
	}

    function addRestaurant(uint _id, string memory _name, string memory _description) public {
        restaurants[_id] = Restaurant(_name, _description, "", "0");
    }

    function addReview(uint )

}
