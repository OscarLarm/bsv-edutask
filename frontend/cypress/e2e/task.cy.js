describe("Interaction with todo-items", () => {
  let uid; // user id
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the user

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
      });
    });
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

  // The test todo-items must have unique names with this approach since cypress will get confused otherwise
  it("Create a todo-item with name and add-btn clicked", () => {
    cy.get("img").first().click();
    cy.get(".inline-form").first().click().type("test todo 1").submit();
    cy.get(".todo-list").should("contain.text", "test todo 1");
  });

  it("Create a todo-item with name but add-btn not clicked", () => {
    cy.get("img").first().click();
    cy.get(".inline-form").first().find("input[type=text]").type("test todo 2", { force: true }); // force added because of cypress getting confused
    cy.get(".todo-list").should("not.contain.text", "test todo 2");
  });

  // bit unsure if this is how we should test it, but anyway the test will fail because there is a bug in the system.
  // bug is: You can still create todo-items even if you dont put in a name!
  it("Checking that add button is disabled when todo-item has no name", () => {
    cy.get("img").first().click(); // open task in detail view mode
    cy.get('.inline-form > [type="submit"]').click({ force: true });
    cy.get(".todo-list").should("not.contain.text", "");
    // cy.get('.inline-form > [type="submit"]').should("be.disabled");
  });

  it("No name and not add button clicked", () => {});
});
