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
    // login
    cy.contains("div", "Email Address").find("input[type=text]").type(email);
    cy.get("form").submit();
    cy.get("h1").should("contain.text", "Your tasks, " + name);
    // create one task before each test
    cy.get(".submit-form").find("#title").type("Test task");
    cy.get(".submit-form").submit();
    // See tasks
    cy.get('.title-overlay').should('contain.text', title);
    // Open detailed view of task
    cy.get('.container > :nth-child(1) > a').click();
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


  
  it("Create a todo-item", () => {
    cy.get(".inline-form").click().type("test todo").submit();
    cy.get(".todo-list").should("contain.text", "test todo");
  });

    it('mark todo item as done', () => {
    // Mark todo as done.
    cy.get(':nth-child(2) > .checker').click();
    
    // TODO: CHECK SHOULD NOT EXIST
    // cy.get('.todo-list > :nth-child(2)').should('contain.text', 'Wow another todo item')
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
