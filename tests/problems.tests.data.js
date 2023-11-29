const CompileJob = require('../schemas/CompileJobSchema')
const ProblemCode = require('../schemas/problemCodeSchema')
const addTask = require('../queue/send')


//Test suite for ensuring solutions and their test cases are valid.
// Usage: user-manager: npm run dev
// Run rabbitmq docker container
// node tests/problems.test.js
//
// TODO: Implement with jest test suite so we can ensure response is valid programatically
//


class Problem {
  constructor(problemTitle, language, solutionCode) {
    this.problemTitle = problemTitle
    this.language = language
    this.solutionCode = solutionCode

  }

  async run() {
    this.getProblem().then((problemCode) => {

      this.createCompileJob(this.solutionCode, problemCode).then((compileJob) => {
        console.log(compileJob)
        this.addToQueue(problemCode, compileJob)
      }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
  }

  async getProblem() {
    try {
      const problemCode = await ProblemCode.findOne({ title: this.problemTitle, language: this.language })

      if (!problemCode) {
        throw new Error(`no problem found matching title: ${this.problemTitle} and language: ${this.language}`)
      }

      problemCode.userStarterCode = this.solutionCode
      return problemCode

    } catch (err) {
      throw new Error(`An error occured when fetching problemCode: ${err}`)
    }
  }

  createMockProblem() {
    const mockProblem = {
      title: 'Common Prefix',
      language: 'javascript',
      userStarterCode: '',
      filePrefix: "commonPrefix",
      fileExt: ".mjs",
      inputCode: "",
      callerCode: "",
      output: ''
    }


  }

  addToQueue(problemCode, compileJob) {
    //the queue needs to be given data in string format to be sent as a buffer
    const data = JSON.stringify({
      jobId: compileJob._id,
      code: compileJob.code,
      problem: problemCode,
    })

    addTask(data, function(success, data) {
      if (!success) {
        throw new Error(`error adding job to queue, error: ${data}`)
      } else {
        console.log('data: ', data)
        return data
      }
    });
  }

  async createCompileJob(code, problem) {
    try {

      const compileJob = await CompileJob.create({

        status: "pending",
        code,
        problem,
      });

      if (!compileJob) {
        throw new Error('Error creating compile job')
      } else {
        console.log('compile job: ', compileJob)
        return compileJob
      }
    } catch (err) {

      throw new Error(`error creating compile job: ${err}`)
    }
  }
}


const commonPrefixTestData = {
  correctSolution: `var longestCommonPrefix = function(strs) {
    let output = "";

    for (let i = 0; i < strs[0].length; i++) {
       if (strs.every((str => str[i] === strs[0][i]))) {
           output += strs[0][i];
       } else {
           break
       }
    }

    return output;
};`,
  incorrectSolution: `var longestCommonPrefix = function(strs) {
    let output = "";

    for (let i = 0; i < strs[0].length; i++) {
       if (strs.every((str => str[i] === strs[0][i]))) {
           output += strs[0][1];
       } else {
           break
       }
    }

    return output;
};`
}

const twoSumTestData = {


  correctSolution: `function twoSum(nums, target) { 
let mp = new Map()

  for (let i=0; i<nums.length; i++){
    let diff = target - nums[i]

     if(mp.has(diff)) {
            return [i, mp.get(diff)]
          }
     mp.set(nums[i], i)
}
};`,

  incorrectSolution: `let mp = new Map()

  for (let i=0; i<nums.length; i++){
    let diff = target + nums[i]

     if(mp.has(diff)) {
            return [i, mp.get(diff)]
          }
     mp.set(nums[i+ 1], i)
}`
}
module.exports = { Problem, twoSumTestData, commonPrefixTestData }
