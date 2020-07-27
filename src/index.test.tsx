import React, { useState } from 'react';
import { mount } from 'enzyme';
import useValidityState, { CompositeValidity } from './';

const TestWrapperSingle = (): JSX.Element | null => {
  const [val, setVal] = useState<string>('');
  const validity = useValidityState();

  return (
    <form data-validity={validity}>
      <input
        name="input"
        onChange={(e): void => setVal(e.target.value)}
        pattern="[0-9]+"
        ref={validity.register}
        required
        type="text"
        value={val}
      />
    </form>
  );
};

const TestWrapperMultiple = (): JSX.Element | null => {
  const [val1, setVal1] = useState<string>('');
  const [val2, setVal2] = useState<string>('');

  const validity = useValidityState();

  return (
    <form data-validity={validity}>
      <input
        name="input1"
        onChange={(e): void => setVal1(e.target.value)}
        pattern="[0-9]+"
        ref={validity.register}
        required
        type="text"
        value={val1}
      />
      <input
        name="input2"
        onChange={(e): void => setVal2(e.target.value)}
        pattern="[0-9]+"
        ref={validity.register}
        required
        type="text"
        value={val2}
      />
    </form>
  );
};

describe('useValidityState', (): void => {
  describe('with single input', () => {
    it('should have one ValidityState member in addition to overall validity', (): void => {
      const wrapper = mount(<TestWrapperSingle />);

      // force re-render to populate ref
      wrapper.setProps({});

      const validity = wrapper.childAt(0).prop('data-validity');

      expect(validity).toEqual({
        every: expect.any(Boolean),
        any: {
          input: expect.any(ValidityState),
        },
        register: expect.any(Function),
      })
    });

    it('should return true if constraint validation successful', (): void => {
      const wrapper = mount(<TestWrapperSingle />);

      wrapper.find('input').simulate('change', { target: { value: '0123' }});

      // force re-render
      wrapper.setProps({});

      const validity: CompositeValidity = wrapper.childAt(0).prop('data-validity');

      expect(validity.every).toBeTruthy();
      expect(validity.any.input.valid).toBeTruthy();
    });

    it('should return false if pattern constraint validation failed', (): void => {
      const wrapper = mount(<TestWrapperSingle />);

      wrapper.find('input').simulate('change', { target: { value: 'lorem ipsum' }});

      // force re-render
      wrapper.setProps({});

      const validity: CompositeValidity = wrapper.childAt(0).prop('data-validity');

      expect(validity.every).toBeFalsy();
      expect(validity.any.input?.valid).toBeFalsy();
      expect(validity.any.input?.patternMismatch).toBeTruthy();
    });

    it('should return false if required constraint validation failed', (): void => {
      const wrapper = mount(<TestWrapperSingle />);

      wrapper.find('input').simulate('change', { target: { value: '' }});

      // force re-render
      wrapper.setProps({});

      const validity: CompositeValidity = wrapper.childAt(0).prop('data-validity');

      expect(validity.every).toBeFalsy();
      expect(validity.any.input.valid).toBeFalsy();
      expect(validity.any.input.valueMissing).toBeTruthy();
    });
  });

  describe('with multiple inputs', () => {
    it('should have one ValidityState member per input in addition to overall validity', (): void => {
      const wrapper = mount(<TestWrapperMultiple />);

      // force re-render to populate ref
      wrapper.setProps({});

      const validity = wrapper.childAt(0).prop('data-validity');

      expect(validity).toEqual({
        every: expect.any(Boolean),
        any: {
          input1: expect.any(ValidityState),
          input2: expect.any(ValidityState),
        },
        register: expect.any(Function),
      })
    });

    it('should return true if constraint validation successful for every input', (): void => {
      const wrapper = mount(<TestWrapperMultiple />);

      wrapper.find('input').forEach(node => {
        node.simulate('change', { target: { value: '0123' }})
      });

      // force re-render
      wrapper.setProps({});

      const validity: CompositeValidity = wrapper.childAt(0).prop('data-validity');

      expect(validity.every).toBeTruthy();
      expect(validity.any.input1.valid).toBeTruthy();
      expect(validity.any.input2.valid).toBeTruthy();
    });

    it('should return false if constraint validation failed for one input', (): void => {
      const wrapper = mount(<TestWrapperMultiple />);

      const inputs = wrapper.find('input');

      // simulate constraint violation
      inputs.at(0).simulate('change', { target: { value: '0123' }});

      // simulate constraint violation
      inputs.at(1).simulate('change', { target: { value: 'lorem ipsum' }});

      // force re-render
      wrapper.setProps({});

      const validity: CompositeValidity = wrapper.childAt(0).prop('data-validity');

      expect(validity.every).toBeFalsy();
      expect(validity.any.input1.valid).toBeTruthy();
      expect(validity.any.input2.valid).toBeFalsy();
    });
  });
});
