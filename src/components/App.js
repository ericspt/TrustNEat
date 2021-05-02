import React, { Component } from 'react'
import Web3 from 'web3'
import Review from '../abis/Review.json'
import AddRestaurant from './AddRestaurant'
import Main from './Main'
import Navbar from './Navbar'
import './App.css'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import ViewRestaurant from './ViewRestaurant'
import RateRestaurant from './RateRestaurant'
import ViewCodes from './ViewCodes'
import EditRestaurant from './EditRestaurant'
import ViewReview from './ViewReview'

/**
 * This class, which is a React component, represents the central point of the web application
 * Even though it does not render a page on its own, it contains the connection Web3 and all the blockchain data.
 * Moreover, it contains the means for calling smart contract functions (e.g. addRestaurant)
 */
class App extends Component {

	// This function will be called as soon as the page loads and it loads Web3 (MetaMask) and the blockchain data
    async componentWillMount() { 
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

	// This function loads the blockchain data using the existent connection to Web3
    async loadBlockchainData() {
		// Get the Web3 window
        const web3 = window.web3 

		// Get all the accounts for Ethereum from Web3
        const accounts = await web3.eth.getAccounts()
		// accounts[0] is the selected account, assign it to the state variable of account
        this.setState({ account: accounts[0] })

		// Get the network id of Web3
        const networkId = await web3.eth.net.getId()

        // Load the review data smart contract
        const reviewData = Review.networks[networkId]
        if (reviewData) {
			// Use the review data smart contract and the ABI to get the smart contract functions and data
            const review = new web3.eth.Contract(Review.abi, reviewData.address)
			// The smart contract that operates the web application's address is given by cAddress
            this.setState({ cAddress: review.options.address })
            this.setState({ review })
			// The typical way to extract blockchain data and put it in a variable
            const restaurantCount = await review.methods.restaurantCount().call()
			// Assigning said variable to the state
            this.setState({ restaurantCount })
			// Helper arrays for assigning reviews and codes to separate arrays
            let reviewsHelper = this.state.reviews.slice(); 
            let codesHelper = this.state.codes.slice(); 
			// For each restaurant, add it to the state, and add its reviews and codes to the lists
            for (var i = 0; i < restaurantCount; i = i + 1) {
                const restaurant = await review.methods.restaurants(i).call()
                this.setState({
                    restaurants: [...this.state.restaurants, restaurant]
                })
                var lista = []
                var listaCodes = []
                for (var j = 0; j < restaurant.reviewCount; j = j + 1) {
                    const reviewObj = await review.methods.getReview(i, j).call()
                    lista.push(reviewObj)
                }
                for (j = 0; j < restaurant.numberOfCodes; j = j + 1) {
                    const codeObj = await review.methods.getCode(i, j).call()
                    listaCodes.push(codeObj)
                }
				// Then add the lists to the big lists (having bidimensional arrays)
                reviewsHelper.push(lista)
                codesHelper.push(listaCodes)
            }
            this.setState({
                reviews: reviewsHelper,
                codes: codesHelper
            })
        } else {
            window.alert('Review contract not deployed to detected network.')
        }
        this.setState({ loading: false })
    }
    
	// This function loads Web3 (or MetaMask in our case)
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable() 
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
		// In case the user did not install MetaMask or other crypto browser extensions
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

	/*
	Region Functions that call the blockchain methods
	*/

    addRestaurant = (name, restaurantAddress, restaurantLocality, restaurantCountry, restaurantWebsite, imageHash, restaurantOwner) => {
        this.setState({ loading: true })
        this.state.review.methods.addRestaurant(name, restaurantAddress, restaurantLocality, restaurantCountry, restaurantWebsite, imageHash, restaurantOwner).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            window.location.reload()
        })
    }

    addReview = (id, name, description, rating, codeToSubmit, timeAdded, account) => {
        this.setState({ loading: true })
        this.state.review.methods.addReview(id, name, description, rating, codeToSubmit, timeAdded, account).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            window.location.reload()
        })
    }

    uploadImage = (restaurantID, hash) => {
        this.setState({ loading: true})
        this.state.review.methods.uploadImage(restaurantID, hash).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            window.location.reload()
        })
    }

    editRestaurant = (restaurantId, address, locality, country, website) => {
        this.setState({ loading: true})
        this.state.review.methods.editRestaurant(restaurantId, address, locality, country, website).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            window.location.reload()
        })
    }

    deleteRestaurant = (restaurantId) => {
        this.setState({ loading: true})
        this.state.review.methods.deleteRestaurant(restaurantId).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            window.location.reload()
        })
    }

    buyCodes = (restaurantID, idx1, idx2, codesArray, timeGenerated) => {
        this.setState({ loading: true})
        this.state.review.methods.buyCodes(restaurantID, idx1, idx2, codesArray, timeGenerated).send({ from: this.state.account }).on('transactionHash', (hash) => {
            
			// This condition computes whether one code was bought or five at the same time
            const web3 = window.web3
            if (idx2 - idx1 === 1) {
                web3.eth.sendTransaction({from: this.state.account, to: this.state.cAddress, value: web3.utils.toWei("0.005", "ether")}).on('transactionHash', (hash) => {
                    this.setState({ loading: false })
                    window.location.reload()
                })
            }
            else {
                web3.eth.sendTransaction({from: this.state.account, to: this.state.cAddress, value: web3.utils.toWei("0.025", "ether")}).on('transactionHash', (hash) => {
                    this.setState({ loading: false })
                    window.location.reload()
                })
            }
        })
    }

	/*
	EndRegion
	*/

	// The constructor of the class that initializes the App.js state variables
    constructor(props) {
        super(props)
        this.state = {
            buffer: null,
            account: '0x0',
            cAddress: '0x0',
            review: {},
            restaurants: [],
            reviews: [],
            codes: [],
            loading: true
        }
    }
    
	// Rendering the loading text, as well as routing
    render() {
        if(this.state.loading) {
            return(
                <div>
                    <p id="loader" className="text-center">Loading...</p>
                </div>
                );
        } else {
            return (
				/*
				Routing for the application
				Navbar is rendered for every path
				Main is rendered for the exact path of / for listing restaurants
				and the pattern continues
				Whenever a variable is passed through to a component, it will be present 
				in the routing object (e.g restaurants for Main)
				*/
                <Router>

					<Route path="/">
					<Navbar
					account = {this.state.account}
					/>
					</Route>
					<Route exact path="/">
						<Main 
						restaurants={this.state.restaurants} 
						reviews={this.state.reviews}
						/>
					</Route>
					<Route exact path="/add-restaurant">
						<AddRestaurant 
						account={this.state.account} 
						addRestaurant = {this.addRestaurant} />
					</Route>
					<Route exact path="/view-restaurant/:id">
						<ViewRestaurant 
						restaurants={this.state.restaurants} 
						reviews={this.state.reviews}
						account={this.state.account}
						uploadImage = {this.uploadImage}
						buyCodes = {this.buyCodes}
						codes={this.state.codes}
						deleteRestaurant={this.deleteRestaurant}
						/>
					</Route>
					<Route exact path="/view-restaurant/:id/rate-restaurant/:code">
						<RateRestaurant 
						restaurants={this.state.restaurants}
						reviews={this.state.reviews} 
						codes={this.state.codes}
						account={this.state.account} 
						addReview={this.addReview}/>
					</Route>
					<Route exact path="/view-restaurant/:id/view-codes">
						<ViewCodes 
						restaurants={this.state.restaurants} 
						account={this.state.account} 
						codes={this.state.codes}
						reviews={this.state.reviews}/>
					</Route>
					<Route exact path="/edit-restaurant/:id">
						<EditRestaurant
						editRestaurant={this.editRestaurant}
						restaurants={this.state.restaurants}
						/>
					</Route>
					<Route exact path="/view-restaurant/:id/view-review/:idRv">
						<ViewReview
						codes={this.state.codes}
						reviews={this.state.reviews}/>
					</Route>
                </Router> 
            );
        }
    }
}

export default App;
