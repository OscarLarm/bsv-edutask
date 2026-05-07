describe("Interaction with todo-items", () => {
  let uid; // user id
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the user
  let taskId; // task id
  let title; // task title
  let description; // task description
  let url; // task url
  let todos; // todos associated with task

  beforeEach(function () {
    // enter the main main page
    cy.visit("http://localhost:3000");

    // detect a div which contains "Email Address", find the input and type (in a declarative way)
    cy.contains("div", "Email Address").find("input[type=text]").type(email);
    // alternative, imperative way of detecting that input field
    //cy.get('.inputwrapper #email')
    //    .type(email)

    // submit the form on this page
    cy.get("form").submit();
  });

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture("user.json").then((user) => {
      cy.request({
        method: "POST",
        url: "http://localhost:5000/users/create",
        form: true,
        body: user,
      }).then((response) => {
        uid = response.body._id.$oid;
        name = user.firstName + " " + user.lastName;
        email = user.email;

        // Create a task
        cy.fixture("task.json").then((task) => {
          cy.request({
            method: "POST",
            url: "http://localhost:5000/tasks/create",
            form: true,
            body: {...task, userid: uid}
          }).then((response) => {
            taskId = response.body[0]._id.$oid;
            title = task.title;
            description = task.description;
            url = task.url;
            todos = task.todos;
          });
        });
      });
    });
  });

  
  it('see tasks', () => {
    cy.get('.title-overlay').should('contain.text', title);
  })

  it('open detailed view', () => {
    cy.get()
  })
  

  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  });
});
