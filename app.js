const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];

// Choose to enter a new team member: Engineer, Intern or none
function promptUser() {
  return inquirer.prompt([
    {
      type: "list",
      name: "teamMember",
      message: "Which type of team member would you like to add?",
      choices: [
        "Engineer",
        "Intern",
        "I don't want to add any more team members",
      ],
    },
  ]);
}

// Manager Questions for the user
function managerQuestions() {
  return inquirer.prompt([
    {
      type: "input",
      name: "managerName",
      message: "What is the Manager's name?",
    },
    {
      type: "input",
      name: "managerID",
      message: "What is the Manager's ID?",
      validate: (val) => /^\d+$/.test(val),
    },
    {
      type: "input",
      name: "managerEmail",
      message: "What is the Manager's email?",
      validate: (val) => /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val),
    },
    {
      type: "input",
      name: "office",
      message: "What is the Manager's Office Number?",
    },
  ]);
}

// Intern questions for the user
function internQuestions() {
  return inquirer.prompt([
    {
      type: "input",
      name: "internName",
      message: "What is the name of your Intern?",
    },
    {
      type: "input",
      name: "internID",
      message: "What is your Intern's ID?",
      validate: (val) => /^\d+$/.test(val),
      // validate: function (answer) {
      //   if (answer === `${answer.managerID}` || `${answer.engineerID}`) {
      //     return console.log(
      //       "This ID is already taken. Please enter a new ID number."
      //     );
      //   }
      // },
      // for each on team and look at the ID;s in there and see if they match ===
      // use .match for email
    },
    {
      type: "input",
      name: "internEmail",
      message: "What is your Intern's email?",
      validate: (val) => /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val),
    },
    {
      type: "input",
      name: "internSchool",
      message: "Which school does your Intern attend?",
    },
  ]);
}
//  Engineer Questions for the user
function engineerQuestions() {
  return inquirer.prompt([
    {
      type: "input",
      name: "engineerName",
      message: "What is the name of your Engineer?",
    },
    {
      type: "input",
      name: "engineerID",
      message: "What is your Engineer's ID?",
      validate: (val) => /^\d+$/.test(val),
      //   validate: function (answer) {
      //     if (answer = `${answer.managerID}` || `${answer.internID}`){
      //     return console.log("This ID is already taken. Please enter a new ID number.")
      //   }
    },
    {
      type: "input",
      name: "engineerEmail",
      message: "What is the email of your Engineer?",
      validate: (val) => /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val),
    },
    {
      type: "input",
      name: "engineerGit",
      message: "What is your Engineer's GitHub username?",
    },
  ]);
}

// Trying to save the result of render into a variable - save HTML variable to a file
function createHTML() {
  let HTML = render(team);
  fs.writeFile(outputPath, HTML, (err) => {
    if (err) throw err;
    console.log("Refresh your browser now to see updated team...");
  });
}

// check that the path exists - check a dir exists if doesn;t exist create it!
// output dir first

// name of the file, content
// https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options
// over ride with new HTML

async function init() {
  try {
    const managerInfo = await managerQuestions();
    // new manager
    const newManager = new Manager(
      managerInfo.managerName,
      managerInfo.managerID,
      managerInfo.managerEmail,
      managerInfo.office
    );
    // team is a global variable and so you can refer to it here
    team.push(newManager);
    createNewTeamMember();
  } catch (err) {
    console.log(err);
  }
}

async function createNewTeamMember() {
  const newEmployeeType = await promptUser();

  switch (newEmployeeType.teamMember) {
    case "Engineer":
      const newEngineerInfo = await engineerQuestions();
      const newEngineer = new Engineer(
        newEngineerInfo.engineerName,
        newEngineerInfo.engineerID,
        newEngineerInfo.engineerEmail,
        newEngineerInfo.engineerGit
      );
      team.push(newEngineer);
      createNewTeamMember();
      break;
    case "Intern":
      const newInternInfo = await internQuestions();
      const newIntern = new Intern(
        newInternInfo.internName,
        newInternInfo.internID,
        newInternInfo.internEmail,
        newInternInfo.internSchool
      );
      team.push(newIntern);
      createNewTeamMember();
      break;
    default:
      // generate HTML and save to the disk
      createHTML();
  }
  // console.log(team);
}

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, Intern, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
