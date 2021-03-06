// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = {prompter: prompter};

// When a user runs `git cz`, prompter will
// be executed. We pass you cz, which currently
// is just an instance of inquirer.js. Using
// this you can ask questions and get answers.
//
// The commit callback should be executed when
// you're ready to send back a commit template
// to git.
//
// By default, we'll de-indent your commit
// template and will keep empty lines.
function prompter(cz, commit) {

  // Let's ask some questions of the user
  // so that we can populate our commit
  // template.
  //
  // See inquirer.js docs for specifics.
  // You can also opt to use another input
  // collection library if you prefer.
  cz.prompt([
    {
      type: 'input',
      name: 'issues',
      message: 'Jira Issue ID(s) (required):\n',
      validate: function(input) {
        if (!input) {
          return 'Must specify issue IDs, otherwise, just use a normal commit message';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'time',
      message: 'Time spent (i.e. 3h 15m) (optional):\n'
    },
    {
      type: 'input',
      name: 'workflow',
      message: 'Workflow command (testing, closed, etc.) (optional):\n',
      validate: function(input) {
        if (input && input.indexOf(' ') !== -1) {
          return 'Workflows cannot have spaces in smart commits. If your workflow name has a space, use a dash (-)';
        } else {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'comment',
      message: 'Jira comment (optional):\n'
    },
    {
      type: 'input',
      name: 'message',
      message: 'Anything else that would be helpful to note (not included in the Jira issue) (optional):\n'
    }
  ], commitAnswers);

  function commitAnswers(answers) {
    commit(filter([
      answers.issues,
      answers.comment ? '#comment ' + answers.comment : undefined,
      answers.time ? '#time ' + answers.time : undefined,
      answers.workflow ? '#' + answers.workflow : undefined,
      answers.message ? '\n' + answers.message : undefined
    ]).join(' '));
  }
}

function filter(array) {
  return array.filter(function(item) {
    return !!item;
  });
}
