'use strict';

function getShown(elementId) {
  return loot.DOM.elementShownStates.get(elementId);
}

function getEnabled(elementId) {
  return loot.DOM.elementEnabledStates.get(elementId);
}

function getDomState() {
  return loot.DOM.state;
}

beforeEach(() => {
  loot.DOM.elementShownStates.clear();
  loot.DOM.elementEnabledStates.clear();
});

/* eslint-disable no-unused-expressions */
describe('State', () => {
  describe('State()', () => {
    it('should set the current state to DEFAULT_STATE', () => {
      const state = new loot.State();
      state.currentState.should.equal(loot.State.DEFAULT_STATE);
    });
  });

  describe('DEFAULT_STATE', () => {
    it('should not equal EDITING_STATE', () => {
      loot.State.DEFAULT_STATE.should.not.equal(loot.State.EDITING_STATE);
    });

    it('should not equal SORTING_STATE', () => {
      loot.State.DEFAULT_STATE.should.not.equal(loot.State.SORTING_STATE);
    });
  });

  describe('EDITING_STATE', () => {
    it('should not equal SORTING_STATE', () => {
      loot.State.EDITING_STATE.should.not.equal(loot.State.SORTING_STATE);
    });
  });

  describe('isInDefaultState()', () => {
    it('should return true if the default state is the current state', () => {
      const state = new loot.State();

      state.isInDefaultState().should.be.true;
    });

    it('should return false if the editing state is the current state', () => {
      const state = new loot.State();
      state.enterEditingState();

      state.isInDefaultState().should.be.false;
    });

    it('should return false if the sorting state is the current state', () => {
      const state = new loot.State();
      state.enterSortingState();

      state.isInDefaultState().should.be.false;
    });
  });

  describe('isInEditingState()', () => {
    it('should return true if the editing state is the current state', () => {
      const state = new loot.State();
      state.enterEditingState();

      state.isInEditingState().should.be.true;
    });

    it('should return false if the default state is the current state', () => {
      const state = new loot.State();

      state.isInEditingState().should.be.false;
    });

    it('should return false if the sorting state is the current state', () => {
      const state = new loot.State();
      state.enterSortingState();

      state.isInEditingState().should.be.false;
    });
  });

  describe('isInSortingState()', () => {
    it('should return true if the sorting state is the current state', () => {
      const state = new loot.State();
      state.enterSortingState();

      state.isInSortingState().should.be.true;
    });

    it('should return false if the editing state is the current state', () => {
      const state = new loot.State();
      state.enterEditingState();

      state.isInSortingState().should.be.false;
    });

    it('should return false if the default state is the current state', () => {
      const state = new loot.State();

      state.isInSortingState().should.be.false;
    });
  });

  describe('enterSortingState()', () => {
    it('should change state to the sorting state from the default state', () => {
      const state = new loot.State();
      state.enterSortingState();

      state.currentState.should.equal(loot.State.SORTING_STATE);

      getShown('updateMasterlistButton').should.be.false;
      getShown('sortButton').should.be.false;
      getShown('applySortButton').should.be.true;
      getShown('cancelSortButton').should.be.true;
      getEnabled('gameMenu').should.be.false;
      getEnabled('refreshContentButton').should.be.false;

      getDomState().should.equal('sorting');
    });

    it('should throw an error if called in the editing state', () => {
      const state = new loot.State();
      state.enterEditingState();

      should.throw(() => { state.enterSortingState(); }, Error);
    });

    it('should have no effect if already in the sorting state', () => {
      const state = new loot.State();
      state.enterSortingState();
      state.enterSortingState();

      state.currentState.should.equal(loot.State.SORTING_STATE);

      getShown('updateMasterlistButton').should.be.false;
      getShown('sortButton').should.be.false;
      getShown('applySortButton').should.be.true;
      getShown('cancelSortButton').should.be.true;
      getEnabled('gameMenu').should.be.false;
      getEnabled('refreshContentButton').should.be.false;
    });
  });

  describe('exitSortingState()', () => {
    it('should change state to the default state from the sorting state', () => {
      const state = new loot.State();
      state.enterSortingState();
      state.exitSortingState();

      state.currentState.should.equal(loot.State.DEFAULT_STATE);

      getShown('updateMasterlistButton').should.be.true;
      getShown('sortButton').should.be.true;
      getShown('applySortButton').should.be.false;
      getShown('cancelSortButton').should.be.false;
      getEnabled('gameMenu').should.be.true;
      getEnabled('refreshContentButton').should.be.true;

      getDomState().should.equal('default');
    });

    it('should throw an error if called in the editing state', () => {
      const state = new loot.State();
      state.enterEditingState();

      should.throw(() => { state.exitSortingState(); }, Error);
    });

    it('should have no effect if already in the default state', () => {
      const state = new loot.State();
      state.exitSortingState();

      state.currentState.should.equal(loot.State.DEFAULT_STATE);

      should.equal(undefined, getShown('updateMasterlistButton'));
      should.equal(undefined, getShown('sortButton'));
      should.equal(undefined, getShown('applySortButton'));
      should.equal(undefined, getShown('cancelSortButton'));
      should.equal(undefined, getEnabled('gameMenu'));
      should.equal(undefined, getEnabled('refreshContentButton'));
    });
  });

  describe('enterEditingState()', () => {
    it('should change state to the editing state from the default state', () => {
      const state = new loot.State();
      state.enterEditingState();

      state.currentState.should.equal(loot.State.EDITING_STATE);

      getEnabled('wipeUserlistButton').should.be.false;
      getEnabled('copyContentButton').should.be.false;
      getEnabled('refreshContentButton').should.be.false;
      getEnabled('settingsButton').should.be.false;
      getEnabled('gameMenu').should.be.false;
      getEnabled('updateMasterlistButton').should.be.false;
      getEnabled('sortButton').should.be.false;

      getDomState().should.equal('editing');
    });

    it('should throw an error if called in the sorting state', () => {
      const state = new loot.State();
      state.enterSortingState();

      should.throw(() => { state.enterEditingState(); }, Error);
    });

    it('should have no effect if already in the editing state', () => {
      const state = new loot.State();
      state.enterEditingState();
      state.enterEditingState();

      state.currentState.should.equal(loot.State.EDITING_STATE);

      getEnabled('wipeUserlistButton').should.be.false;
      getEnabled('copyContentButton').should.be.false;
      getEnabled('refreshContentButton').should.be.false;
      getEnabled('settingsButton').should.be.false;
      getEnabled('gameMenu').should.be.false;
      getEnabled('updateMasterlistButton').should.be.false;
      getEnabled('sortButton').should.be.false;
    });
  });

  describe('exitEditingState()', () => {
    it('should change state to the default state from the editing state', () => {
      const state = new loot.State();
      state.enterEditingState();
      state.exitEditingState();

      state.currentState.should.equal(loot.State.DEFAULT_STATE);

      getEnabled('wipeUserlistButton').should.be.true;
      getEnabled('copyContentButton').should.be.true;
      getEnabled('refreshContentButton').should.be.true;
      getEnabled('settingsButton').should.be.true;
      getEnabled('gameMenu').should.be.true;
      getEnabled('updateMasterlistButton').should.be.true;
      getEnabled('sortButton').should.be.true;

      getDomState().should.equal('default');
    });

    it('should throw an error if called in the sorting state', () => {
      const state = new loot.State();
      state.enterSortingState();

      should.throw(() => { state.exitEditingState(); }, Error);
    });

    it('should have no effect if already in the default state', () => {
      const state = new loot.State();
      state.exitEditingState();

      state.currentState.should.equal(loot.State.DEFAULT_STATE);

      should.equal(undefined, getEnabled('wipeUserlistButton'));
      should.equal(undefined, getEnabled('copyContentButton'));
      should.equal(undefined, getEnabled('refreshContentButton'));
      should.equal(undefined, getEnabled('settingsButton'));
      should.equal(undefined, getEnabled('gameMenu'));
      should.equal(undefined, getEnabled('updateMasterlistButton'));
      should.equal(undefined, getEnabled('sortButton'));
    });
  });
});
