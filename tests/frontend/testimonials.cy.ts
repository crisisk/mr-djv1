/// <reference types="cypress" />

import React from 'react';
import { mount } from 'cypress/react18';
// @ts-ignore - JSX component without TypeScript definitions
import Testimonials from '../../mr-dj-eds-components/src/components/Organisms/Testimonials.jsx';

const getActiveTab = () => cy.get('[role="tab"][aria-selected="true"]');

describe('Testimonials carousel accessibility', () => {
  beforeEach(() => {
    mount(<Testimonials />);
  });

  it('supports keyboard navigation and updates ARIA state', () => {
    cy.get('[aria-roledescription="carousel"]').as('carousel');

    cy.get('@carousel').focus();

    // Initial slide is the first testimonial
    getActiveTab().should('have.attr', 'aria-controls', 'testimonial-slide-0');
    cy.get('#testimonial-slide-0').should('have.attr', 'aria-hidden', 'false');

    // Navigate forward with ArrowRight
    cy.get('@carousel').trigger('keydown', { key: 'ArrowRight' });
    getActiveTab().should('have.attr', 'aria-controls', 'testimonial-slide-1');
    cy.get('#testimonial-slide-1').should('have.attr', 'aria-hidden', 'false');

    // Navigate backward with ArrowLeft
    cy.get('@carousel').trigger('keydown', { key: 'ArrowLeft' });
    getActiveTab().should('have.attr', 'aria-controls', 'testimonial-slide-0');

    // Jump to the last slide with End
    cy.get('@carousel').trigger('keydown', { key: 'End' });
    getActiveTab().should('have.attr', 'aria-controls', 'testimonial-slide-2');
    cy.get('#testimonial-slide-2').should('have.attr', 'aria-hidden', 'false');

    // Jump back to the first slide with Home
    cy.get('@carousel').trigger('keydown', { key: 'Home' });
    getActiveTab().should('have.attr', 'aria-controls', 'testimonial-slide-0');
  });
});
