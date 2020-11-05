//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

contract Review {
	string public name = "Review SC";

	address public owner; 

	address[] public stakers;
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(uint => mapping(uint => Review)) public restaurantReviews;
    mapping(uint => Restaurant) public restaurants;

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
        string rating
    }

	constructor() {
		owner = msg.sender;
	}

}