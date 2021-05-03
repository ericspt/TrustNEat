# TrustNEat
 This project is the technical work of a dissertation project: A hardly manipulable rating system 
 
 Department of Computer Science, University of Warwick
 ## Instructions on how to run it
 Step 1: Requirements
 
 [MetaMask](https://metamask.io/)
 
 [Node.js](https://nodejs.org/en/download/)
 
 [Ganache](https://www.trufflesuite.com/ganache)
 
 Step 2: Restart your machine (this will automatically assign PATH variables to Node.js and Ganache)
 
 Step 3: Chain ID = 1337 -> Follow [this](https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask) tutorial to configure MetaMask with Ganache
 
 Step 4: Go to the code's folder using the terminal and type ```npm install``` - this should install all the necessary packages, including truffle and React

 Step 5: Restart your PC again to assign the newer paths (including truffle) and run 
 
 ```npm install -g truffle```

 Step 6: Migrate the smart contracts using 
 
 ```truffle migrate --reset```
 
 Step 7: Run the code using 
 
 ```npm run start```
 
 Step 8: Go to http://localhost:3000/ 
 
 Step 9: It will automatically prompt you to login via MetaMask, but it will say that an error has occured. This is a bug from MetaMask. Press "Switch networks", then choose the network which you were on anyway, then login. After you have done that, the application will be usable. You can add new accounts from Ganache to MetaMask to get a better feel of how interactable the application is. 
 
 ## Testing
 Run ```truffle test```
 ## Compiling
 Run ```truffle compile```
 ## Resetting the restaurants, reviews and so on
 Run ```truffle migrate --reset```
 ## In case things go wrong
 In case it says "Review contract not detected on current network", go to MetaMask and select the added network
 
 Chain ID is 1337
 
 Installing and running a blockchain application on a local machine can be a tedious process. If something goes wrong, do not hesitate to contact me at eric.spataru@warwick.ac.uk and please CC my other email address: eric.spataru@gmail.com
 
  
