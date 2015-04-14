'use strict';

export default class ValidationResult {
  constructor() {
    /**
     * Contains any validation errors that were found.
     */
    this.errors = [];
  }

  addError(error) {
    this.errors.push(error);
  }

  addErrors(errors) {
    for (let i = 0; i < errors.length; i++) {
      this.errors.push(errors[i]);
    }
  }

  /**
   * Returns true if no errors were found.
   */
  get isValid() { return this.errors.length === 0; }
}
