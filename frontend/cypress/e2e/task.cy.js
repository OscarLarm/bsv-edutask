describe("Interaction with todo-items", () => {
  let uid; // user id
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the user
  // let taskId; // task id
  // let title; // task title
  // let description; // task description
  // let url; // task url
  // let todos; // todos associated with task

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
    cy.get(".title-overlay").should("contain.text", "Test task");
    // Open detailed view of task
    cy.get(".container > :nth-child(1) > a").click();
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

        // // Create a task
        // cy.fixture("task.json").then((task) => {
        //   cy.request({
        //     method: "POST",
        //     url: "http://localhost:5000/tasks/create",
        //     form: true,
        //     body: { ...task, userid: uid },
        //   }).then((response) => {
        //     taskId = response.body[0]._id.$oid;
        //     title = task.title;
        //     description = task.description;
        //     url = task.url;
        //     todos = task.todos;
        //   });
        // });
      });
    });
  });

  it("Create a todo-item", () => {
    cy.get(".inline-form").click().type("test todo").submit();
    cy.get(".todo-list").should("contain.text", "test todo");
  });

  // --- R8UC2 ---
  // #1
  it("Check todo item", () => {
    // assign alias
    cy.get(".todo-item > .checker").first().as("todoChecker");
    cy.get(".todo-list > :nth-child(1) > .editable").as("todoText");

    // Verify todo item has unchecked class and no strikethrough text decoration
    cy.get("@todoChecker")
      .should("not.have.class", "checked")
      .and("have.class", "unchecked");
    cy.get("@todoText").should(
      "not.have.css",
      "text-decoration-line",
      "line-through",
    );

    cy.get("@todoChecker").click();

    // Verify todo item has checked class and strikethrough text decoration
    cy.get("@todoChecker")
      .should("not.have.class", "unchecked")
      .and("have.class", "checked");
    cy.get("@todoText").should(
      "have.css",
      "text-decoration-line",
      "line-through",
    );
  });

  // #2
  // Problem?? Reliant on checking todo item working correctly
  it("Uncheck todo item", () => {
    // assign alias
    cy.get(".todo-item > .checker").first().as("todoChecker");
    cy.get(".todo-list > :nth-child(1) > .editable").as("todoText");

    // Verify todo item has checked class and strikethrough text decoration
    cy.get("@todoChecker")
      .should("not.have.class", "unchecked")
      .and("have.class", "checked");
    cy.get("@todoText").should(
      "have.css",
      "text-decoration-line",
      "line-through",
    );

    cy.get("@todoChecker").click();

    // Verify todo item has unchecked class and no strikethrough text decoration
    cy.get("@todoChecker")
      .should("not.have.class", "checked")
      .and("have.class", "unchecked");
    cy.get("@todoText").should(
      "not.have.css",
      "text-decoration-line",
      "line-through",
    );
  });

  // --- R8UC3 ---
  // #1
  // FAILS. Test pass if you click twice. Fault in code.
  it("Delete todo item", () => {
    cy.contains('.todo-item', 'test todo')
      .find('.remover').click(); // Adding an additional .click() here passes the test.

    cy.contains('.todo-item', 'test todo').should('not.exist');
  });

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
