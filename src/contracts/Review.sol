//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Review {

	string public contractName = "Review SC";
	address public owner; 

    struct ReviewStruct {
        string name;
        string text;
        uint8 rating;
        string code;
        string timeAdded;
        address reviewOwner;
    }

    struct Code {
        string code;
        string timeGenerated;
    }

    struct Restaurant { 
        string name;
        string restaurantAddress;
        string restaurantLocality;
        string restaurantCountry;
        string restaurantWebsite;
        string imageHash;
        string rating;
        bool deleted;
        address restaurantOwner;
        uint reviewCount;
        uint numberOfCodes;
        mapping(uint => Code) codes;
        mapping(uint => ReviewStruct) reviews;
    }

    uint public restaurantCount = 0;
    mapping(uint => Restaurant) public restaurants;

    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

	constructor() {
		owner = msg.sender;
	}

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }

    function deleteRestaurant(uint _restaurantId) external {
        restaurants[_restaurantId].deleted = true;
    }

    function getReview(uint restaurantID, uint reviewID)
    external view returns (ReviewStruct memory) {
        return restaurants[restaurantID].reviews[reviewID];
    }

    function addRestaurant(string memory _name, string memory _address, string memory _locality, string memory _country, string memory _website,
    string memory _imageHash, address payable _restaurantOwner) 
    external returns (uint restaurantID) {
        restaurantID = restaurantCount;
        Restaurant storage restaurant = restaurants[restaurantID];
        restaurantCount++;
        restaurant.name = _name;
        restaurant.restaurantAddress = _address;
        restaurant.restaurantLocality = _locality;
        restaurant.restaurantCountry = _country;
        restaurant.restaurantWebsite = _website;
        restaurant.imageHash = _imageHash;
        restaurant.rating = "";
        restaurant.restaurantOwner = _restaurantOwner;
    }

    function buyCodes(uint _restaurantId, uint _idx1, uint _idx2, string[] memory _codesArray, string memory _timeGenerated) 
    external {
        Restaurant storage restaurant = restaurants[_restaurantId];
        restaurant.numberOfCodes = restaurant.numberOfCodes + _idx2 - _idx1;
        uint i;
        for (i = _idx1; i < _idx2; i ++) {
            restaurant.codes[i] = Code(_codesArray[i - _idx1], _timeGenerated);
        }
    }

    function getCode(uint _restaurantId, uint _codeIndex) 
    external view returns (Code memory) {
        return restaurants[_restaurantId].codes[_codeIndex];
    }

    function addReview(uint _restaurantId, string memory _name, string memory _description, 
    uint8 _rating, string memory _code, string memory _timeAdded, address payable _to) 
    external payable returns (bool success) {
        Restaurant storage restaurant = restaurants[_restaurantId];
        restaurant.reviews[restaurant.reviewCount++] = ReviewStruct(_name, _description, _rating, _code, _timeAdded, _to);
        uint i;
        bool pp = false;
        for (i = 0; i < restaurant.reviewCount; i ++) {
            if (keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked(restaurant.reviews[i].code))) {
                return false;
            }
        }
        for (i = 0; i < restaurant.numberOfCodes; i ++) {
            if (keccak256(abi.encodePacked(_code)) == keccak256(abi.encodePacked(restaurant.codes[i].code))) {
                pp = true;
                break;
            }
        }
        if (pp) {
            payable(msg.sender).transfer(msg.value + 0.0001 ether);
            return true;
        }
        else return false;
    }

    function uploadImage(uint _restaurantID, string memory _imageHash) 
    external {
        require(bytes(_imageHash).length > 0);
        require(msg.sender != address(0));
        restaurants[_restaurantID].imageHash = _imageHash;
    }

    function editRestaurant(uint _restaurantId, string memory _address, string memory _locality, 
    string memory _country, string memory _website) external {
        restaurants[_restaurantId].restaurantAddress = _address;
        restaurants[_restaurantId].restaurantLocality = _locality;
        restaurants[_restaurantId].restaurantCountry = _country;
        restaurants[_restaurantId].restaurantWebsite = _website;
    }
}
