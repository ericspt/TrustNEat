const { assert } = require('chai');

const Review = artifacts.require('Review')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('Review', () => {

    let review
    let restaurantID 
    let success

    let restaurantCount 
    let restaurant 
    let reviewCount
    let aReview

    before(async () => {
        review = await Review.new()
        restaurantID = await review.addRestaurant("Test Name", "1 Memory Lane", "Testville", "Testania", "nullweb.com", "", review.address)
        restaurantCount = await review.restaurantCount()
        success = await review.addReview(restaurantCount - 1, "Test Name", "Good food", 9, "abc", "Some time", review.address)

        restaurant = await review.restaurants(restaurantCount - 1)
        reviewCount = restaurant.reviewCount
        aReview = await review.getReview(restaurantCount - 1, reviewCount - 1)
        
    })

    describe('Review Deployment', async () => {
        it('has a name', async () => {
            const name = await review.contractName()
            assert.equal(name, 'Review SC')
        })
    })

    describe('Review Initial Balance', async () => {
        it('contract has no ether', async () => {
            let theBalance = await review.balanceOf()
            assert.equal(theBalance.toString(), tokens('0'))
        })
    })

    describe('Adding Restaurants', async () => {
        it('contract can add restaurants', async () => {
            assert.equal(restaurant.name, "Test Name")
        })
        it('restaurants have localities', async () => {
            assert.equal(restaurant.restaurantLocality, "Testville")
        })
    })

    describe('Adding Reviews', async () => {
        it('contract can add reviews', async () => {
            assert.equal(reviewCount, 1, 'First review correctly added')
        })
        it('reviews have codes correctly assigned', async () => {
            assert.equal(aReview.code, "abc", 'First review correctly added')
        })
    })

    describe('Deleting Restaurants', async () => {
        it('contract can delete restaurants', async () => {
            success = await review.deleteRestaurant(restaurantCount - 1)
            restaurant = await review.restaurants(restaurantCount - 1)
            assert.equal(restaurant.deleted, true)
        })
    })
    
    describe('Buying Codes', async () => {
        it('contract can buy review codes', async () => {
            success = await review.buyCodes(restaurantCount - 1, 0, 5, ['abc1', 'abc2', 'abc3', 'abc4', 'abc5'], "someTime")
            let theCode = await review.getCode(restaurantCount - 1, 4)
            restaurant = await review.restaurants(restaurantCount - 1)
            assert.equal(restaurant.numberOfCodes, 5)
        })
        it('codes are correctly assigned', async () => {
            success = await review.buyCodes(restaurantCount - 1, 0, 5, ['abc1', 'abc2', 'abc3', 'abc4', 'abc5'], "someTime")
            let theCode = await review.getCode(restaurantCount - 1, 4)
            restaurant = await review.restaurants(restaurantCount - 1)
            assert.equal(theCode.code, 'abc5')
        })
    })

    describe('Uploading images', async () => {
        it('contract can upload images for restaurants', async () => {
            success = await review.uploadImage(restaurantCount - 1, "someHash")
            restaurant = await review.restaurants(restaurantCount - 1)
            assert.equal(restaurant.imageHash, "someHash")
        })
    })

    describe('Editing Restaurants', async () => {
        it('contract can edit restaurants', async () => {
            restaurant = await review.restaurants(restaurantCount - 1)
            success = await review.editRestaurant(restaurantCount - 1, restaurant.restaurantAddress, restaurant.restaurantLocality, "New Country", restaurant.restaurantWebsite)
            restaurant = await review.restaurants(restaurantCount - 1)
            assert.equal(restaurant.restaurantCountry, "New Country")
        })
        it('restaurants edits do not affect previous data', async () => {
            restaurant = await review.restaurants(restaurantCount - 1)
            success = await review.editRestaurant(restaurantCount - 1, restaurant.restaurantAddress, restaurant.restaurantLocality, "New Country", restaurant.restaurantWebsite)
            restaurant = await review.restaurants(restaurantCount - 1)
            assert.equal(restaurant.restaurantWebsite, "nullweb.com")
        })
    })
})