<h1 align="center"> Bee Staff </h1>

<p align="center">
    <img src="./assets/images/apple-touch-icon.png" alt="logo" width="125px" height="125px" />
  <br><br>
  <i> Employee Tracker
    <br> built using Node.js and MySQL</i>
  <br>
</p>
<br>

<div align="center">

![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-yellow.svg)
![Contributors](https://img.shields.io/github/contributors/larigens/bee-staff?style=plastic&color=yellow)
![Forks](https://img.shields.io/github/forks/larigens/bee-staff?style=plastic&color=yellow)
![Stars](https://img.shields.io/github/stars/larigens/bee-staff?style=plastic&color=yellow)
![Licence](https://img.shields.io/static/v1?label=License&message=Apache-2.0&color=yellow)
![Issues](https://img.shields.io/github/issues/larigens/bee-staff?style=plastic&color=yellow)

</div>

---

## Description

Bee Staff is a content management system (CMS) that can help you organize and plan your business more efficiently, allowing you to view and manage the company's departments, roles, and employees in the company according to your needs.

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Cloning the Repository](#cloning-the-repository)
  - [Prerequisites](#prerequisites)
  - [Setting Up](#setting-up)
- [Mock-Up](#mock-up)
- [Usage](#usage)
- [Questions](#questions)
- [Contributing](#contributing)
  - [Contributing Guidelines](#contributing-guidelines)
  - [Code of Conduct](#code-of-conduct)
- [Credits](#credits)
  - [Acknowledgements](#acknowledgements)
  - [Links](#links)
- [License](#license)

## Installation

### Cloning the Repository

Click `<> code` - the green button. After clicking, in the local tab, copy the SSH key. Open the terminal in your Macbook or [git bash](https://git-scm.com/downloads), if you have Windows/Linux, and type:

```bash
git clone [paste ssh key]
```

I would recommend downloading [Visual Studio Code](https://code.visualstudio.com/download) to edit the code locally. If you need more information on how to clone a repository, [click here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)!

### Prerequisites

This package requires you to have [Node.js](https://nodejs.org/en/download/), npm, Inquirer, [Express.js](https://expressjs.com/) and [MySQL2](https://www.npmjs.com/package/mysql2) installed on your machine. You can install these by running the code below on your terminal:

For `npm`

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

For `Node.js`

```bash
npm i node@lts
```

For `Express.js`

```bash
npm i express
```

### Setting Up

Open the project in VS Code and make sure you are in the directory of this application before installing `Inquirer`, `MySQL2` and `Console Table Package`. To install it, type the commands below on your terminal:

For `Inquirer`

```bash
npm install --save inquirer@^8.2.5
```

For `MySQL2`

```bash
npm i mysql2
```

For `Console Table Package`

```bash
npm i console.table
```

**Note: Be sure to download this version, because newer versions no longer use the commonjs syntax require('inquirer').**

You can also open the project in VS Code and make sure you are in the directory of this application and then type the command below on your terminal:

```bash
npm i
```

Once you run this, npm will begin the installation process of all of the current project's dependencies.

## Mock-Up

The following image is an illustration of the schema of the existing tables in the database of this application:

<img src="./assets/images/demo1.png" alt="App Screenshot" width="700px" height="342px" />

## Usage

Launch the application by entering the command below on your terminal:

```bash
npm start
```

Once the application is launched, the main menu will appear so that the user can select the request. The option's are:

| Request                                            | Response                                                                                            | Purpose |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| **View all departments**                           | Displays the Department IDs and Department Names                                                    | View    |
| **View the total utilized budget of a department** | Displays the Department Name and Total Utilized Budget                                              | View    |
| **View all roles**                                 | Displays the Roles IDs, Job title, Roles Salary and Roles Department                                | View    |
| **View roles by department**                       | Displays the Same as above, but sorted by Department                                                | View    |
| **View all employees**                             | Displays the Employee IDs, First Names, Last Names, Job Titles, Departments, Salaries, and Managers | View    |
| **View employees by manager**                      | Displays the Same as above, but sorted by Manager                                                   | View    |
| **View employees by department**                   | Displays the Same as above, but sorted by Department                                                | View    |
| **Add a department**                               | Prompted to enter the Name of the new Department                                                    | Add     |
| **Add a role**                                     | Prompted to enter the Name, Salary, and Department for the Role                                     | Add     |
| **Add an employee**                                | Prompted to enter the Employee’s First Name, Last Name, Role, and Manager                           | Add     |
| **Update an employee role**                        | Prompted to select an Employee to update their new Role                                             | Update  |
| **Update an employee manager**                     | Prompted to select an Employee to update their new Manager                                          | Update  |
| **Delete a department**                            | Prompted to select a Department they want to remove from the database                               | Delete  |
| **Delete a role**                                  | Prompted to select a Role they want to remove from the database                                     | Delete  |
| **Delete an employee**                             | Prompted to select an Employee they want to remove from the database                                | Delete  |
| **Exit**                                           | Exits the application and disconnects from the database                                             | Ends    |

The app will receive the request, process the response, demonstrate the resolution for 1 second, and then display the main menu again.

If you need more guidance on how to use Bee Staff, click [here](https://drive.google.com/file/d/1aiaZmMR_TSPpIeG2L0_GRiJnVM3NaBYW/view) for the tutorial!

## Questions

For questions and support feel free to contact me via:

<a href="mailto:larigens@gmail.com">📧 Email </a>

<a href="https://github.com/larigens">🐈‍⬛ GitHub </a>

## Contributing

### Contributing Guidelines

Want to report a bug, contribute some code, request a new feature, or improve the documentation? You can submit an issue and I will gladly welcome you as a contributor, but before submitting an issue, please search the issue tracker, as it may already exist!

### Code of Conduct

Our Code of Conduct follows the same principles as the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/), version 2.1.

## Credits

### Acknowledgements

- [W3 Schools](https://www.w3schools.com)
- [MDN](https://developer.mozilla.org/en-US/)
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Inquirer](https://www.npmjs.com/package/inquirer)
- [PaksTech](https://pakstech.com/blog/inquirer-js/)
- [README Lab](https://github.com/larigens/readme-lab)
- [Express.js](https://expressjs.com/en/4x/api.html)
- [MySQL](https://dev.mysql.com/doc/)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [Console Table Package](https://www.npmjs.com/package/console.table)
- [Stack Overflow](https://stackoverflow.com/)

### Links

[![Portfolio](https://img.shields.io/badge/my_portfolio-000?style=flat&logo=ko-fi&logoColor=white)](https://larigens.github.io/lari-gui/)
[![Linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lari-gui/)
[![Twitter](https://img.shields.io/badge/twitter-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://twitter.com/coffeebr_eak)

## License

Please refer to the [LICENSE](https://choosealicense.com/licenses/apache-2.0/) in the repo.
