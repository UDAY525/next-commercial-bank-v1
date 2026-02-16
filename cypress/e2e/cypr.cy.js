describe("Basic test", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("heading test", () => {
    cy.get('[data-testid="first-fold"]').contains(/Blood Bank/i);
  });
  // it("redirects to request page when Request CTA is clicked", () => {
  //   cy.get('[data-testid="request-cta"]').should("be.visible").click();

  //   cy.url().should("include", "/request");
  // });
  // it("redirects to request page when Donations CTA is clicked", () => {
  //   cy.get('[data-testid="donations-cta"]').click();

  //   cy.location("pathname", { timeout: 10000 }).should("include", "/donations");
  // });

  it("checks if user is logged in", () => {
    cy.getCookie("authjs.session-token")
      .or(cy.getCookie("__Secure-next-auth.session-token"))
      .should("exist");
  });
});
