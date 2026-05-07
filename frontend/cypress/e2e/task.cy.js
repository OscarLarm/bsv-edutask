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

  it("Create a todo-item", () => {
    cy.contains("img");
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
