#!/usr/bin/env node

const fs = require('fs')
// const express = require('express')
const path = require('path')

// const app = express()
const port = 3000
const routesFolder = 'routes'
const routesFile = 'index.js'
const controllersFolder = 'controllers'
const middlewareFolder = 'middleware'
const errorHandlerFile = 'errorHandler.js'
const utilsFolder = 'utils'
const tryCatchFile = 'tryCatch.js'
const routesContent = `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Welcome to my Express app');
});
module.exports = router;`
const errorHandlerContent = `const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
}

module.exports = errorHandler`
const tryCatchContent = `exports.tryCatch = (controller) => async (req, res, next) => {
    try {
        return await controller(req, res)
    } catch (err) {
        return next(err)
    }
}`

const prompt = require('prompt-sync')()

//ask the user for the name of the directory
const userDirName = prompt('Enter the name of the directory: ')

const createApp = () => {
    //let the user enter the name of the directory
    // const dirName = dir || 'express-app'

    // Check if a directory name was provided
    if (!userDirName) {
        throw new Error('Please provide a directory name')
    }

    // Create the app directory
    if (!fs.existsSync(userDirName)) {
        fs.mkdirSync(userDirName)
    }

    // Create the directories
    fs.mkdirSync(path.join(userDirName, routesFolder))
    fs.mkdirSync(path.join(userDirName, controllersFolder))
    fs.mkdirSync(path.join(userDirName, middlewareFolder))
    fs.mkdirSync(path.join(userDirName, utilsFolder))

    // Create the routes file
    fs.writeFileSync(path.join(userDirName, routesFolder, routesFile), routesContent)

    // Create the errorHandler file
    fs.writeFileSync(path.join(userDirName, middlewareFolder, errorHandlerFile), errorHandlerContent)

    // Create the tryCatch file
    fs.writeFileSync(path.join(userDirName, utilsFolder, tryCatchFile), tryCatchContent)

    // Create the .gitignore file
    fs.writeFileSync(
        path.join(userDirName, '.gitignore'),
        `node_modules
.DS_Store
.env
`,
    )

    // Create the .env file
    fs.writeFileSync(
        path.join(userDirName, '.env'),
        `PORT=3000
`,
    )

    //create the .prettierrc file
    fs.writeFileSync(
        path.join(userDirName, '.prettierrc'),
        `{
    "semi": false,
    "trailingComma": "all",
    "singleQuote": true,
    "printWidth": 120,
    "tabWidth": 4
}`,
    )

    // Create the main file
    fs.writeFileSync(
        path.join(userDirName, 'index.js'),
        `const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT||3000;

const app = express();
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);
app.use(errorHandler);
app.listen(port, () =>console.log('Server running on port ' + port));
`,
    )
}

// const [, ,] = process.argv
createApp(userDirName)
console.log(`Express app created at ${userDirName}`)
