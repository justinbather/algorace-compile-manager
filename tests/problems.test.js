const { Problem, twoSumTestData, commonPrefixTestData } = require('./problems.tests.data')
const connectDB = require('../config/db')

connectDB()

const problemTest = new Problem('Longest Common Prefix', 'javascript', commonPrefixTestData.correctSolution)

problemTest.run().then((res) => console.log(res)).catch((err) => console.log(err))
