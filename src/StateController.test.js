const assert = require('assert');
import StateController from './StateController';

describe('StateController', () => {
	it('Should instantiate', () => {
		const state = new StateController({}, {
			name: 'TestState'
		});
		
		assert.strictEqual(state instanceof StateController, true, 'Is correct type');
	});
	
	it('Should have emitter methods', () => {
		const state = new StateController({}, {
			name: 'TestState'
		});
		
		assert.strictEqual(typeof state.emit, 'function', 'Has emit function');
		assert.strictEqual(typeof state.on, 'function', 'Has on function');
		assert.strictEqual(typeof state.once, 'function', 'Has once function');
		assert.strictEqual(typeof state.emitStatic, 'function', 'Has emitStatic function');
		assert.strictEqual(typeof state.off, 'function', 'Has off function');
		assert.strictEqual(typeof state.cancelStatic, 'function', 'Has cancelStatic function');
	});
	
	it('Should emit a change event when state updates', () => {
		const state = new StateController({}, {
			name: 'TestState'
		});
		
		let emitted = false;
		
		state.on('change', () => {
			emitted = true;
		});
		
		state.update({foo: 'bar'});
		
		assert.ok(emitted, 'Change emitted');
	});
});