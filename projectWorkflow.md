
######################## step 1 #####################################

  Initial Setup
* Add home page
* Add books page that lists all books

 Each books has:
* Name
* Image
* Author

 Layout and Basic Styling
* Create our header and footer partials
* Add in Bootstrap

Creating New Books
* Setup new book POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

 Style the books page
* Add a better header/title
* Make books display in a grid

 Style the Navbar and Form
* Add a navbar to all templates
* Style the new book form


######################## step 2 #####################################


##Add Mongoose
* Install and configure Mongoose
* Setup book model
* Use book model inside of our routes


##Show Page
* Add description to our book model
* Add a show route/template

######################## step 3 #####################################

##Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!

##Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts

##Add the Comment model!
* Display comments on campground show page

######################## step 4 #####################################

##Refactor views folder
* Split template pages with proper sub-folder


##Comment New/Create
* Add the comment new and create routes
* Add the new comment form


##################### step 5 #########################################

##Finish Styling Show Page
* Add public directory
* Add custom stylesheet


##################### step 6 #########################################


##Auth Pt. 1 - Add User Model
* Install all packages needed for auth
* Define User model

##Auth Pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

##Auth Pt. 3 - Login
* Add login routes
* Add login template

##Auth Pt. 4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar

##Auth Pt. 5 - Show/Hide Links
* Show/hide auth links in navbar
