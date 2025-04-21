describe('User Registration and Login', () => {
    const testEmail = `test${Date.now()}@example.com`
    const testPassword = 'Test1234!'
    const testFirstName = 'Test'
    const testLastName = 'User'
  
    it('should allow a user to register, then log in', () => {
      cy.visit('http://localhost:5173/register') // or the correct dev URL
  
      // Fill out the registration form
      cy.get('input[name="firstName"]').type(testFirstName)
      cy.get('input[name="lastName"]').type(testLastName)
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('input[name="confirmPassword"]').type(testPassword)
  
      // Upload profile image
      cy.get('input[name="profileImage"]').selectFile('cypress/fixtures/profile.jpg', { force: true })
  
      // Submit the form
      cy.get('button[type="submit"]').click()
  
      // Should redirect to login
      cy.url().should('include', '/login')
  
      // Login with the same credentials
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()
  
      // Should redirect to home page
      cy.url().should('eq', 'http://localhost:5173/')
  
      // Verify navbar updates (check for user image or menu)
      cy.get('.navbar_right_account img').should('exist')
    })
  })
  