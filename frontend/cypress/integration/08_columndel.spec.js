describe('Deletes a column',()=>{
    it('waits for db connect', () => {
        cy.visit('http://localhost:3000')
        cy.wait(3000)
    })
   it('clicks trashcan incon',()=>{
        cy.get('[class="sc-fzoNJl bSaEMQ"]')
        .children('span.material-icons.MuiIcon-root.sc-fzoXWK.bXwIoC')
        .eq(1)
        .click()
   })
   it('confirms choice',()=>{
    cy.get('button')
    .contains('Yes')
    .click()
    .wait(3000)
})
})