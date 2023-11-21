const { Problem, twoSumTestData } = require('./problems.tests.data')
const connectDB = require('../config/db')

connectDB()

const problemTest = new Problem('Two Sum', 'javascript', twoSumTestData.incorrectSolution)

problemTest.run().then((res) => console.log(res)).catch((err) => console.log(err))
