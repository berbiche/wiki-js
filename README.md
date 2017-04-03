# Wiki-js
A simple [Angular](https://github.com/angular/angular)(2) + [Express](https://github.com/expressjs/express) + [Gulp](https://github.com/gulpjs/gulp) project.  
The purpose of this project is to "ajaxify" an existing project and rewrite it under typescript.  
This project is a simple wiki that implements crud, l10n and basic authentication.
## Requirements (has not be tested under older versions)
* Node 7.x.x
* npm 3.x.x
## Installation instruction
### Make sure you [meet the requirements](#requirements) beforehand
1. Clone this repository
```
mkdir wiki-js

cd wiki-js

git clone https://github.com/berbiche/wiki-js.git .
```
2. Run the following commands inside the directory to install all the depedencies
```
npm install

npm install -g gulp-cli
```
## Running the application
* Available commands can be displayed using `gulp --tasks`
```
gulp build

gulp run:express
```
